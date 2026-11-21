#!/usr/bin/env python3
"""
Script di migrazione una tantum:
- Carica i file binari esistenti in biblioteca_uploads/, media_uploads/, social_uploads/ su MinIO.
- Importa biblioteca_state.json, social_state.json (ed eventuale export JSON di localStorage) in MongoDB.

Uso:
  python migrate_to_mongo_minio.py [--dir /opt/atelier-liuteria] [--localstorage backup.json]
"""

import argparse
import json
import mimetypes
import os
import sys

def load_env(base_dir):
    env_path = os.path.join(base_dir, ".env")
    if os.path.isfile(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def main():
    parser = argparse.ArgumentParser(description="Migra file e stati esistenti in MinIO e MongoDB")
    parser.add_argument("--dir", default=os.path.dirname(os.path.abspath(__file__)), help="Directory base di server.py")
    parser.add_argument("--localstorage", default="", help="Percorso opzionale a un export JSON di localStorage (liuteria_gestionale_db_v1)")
    args = parser.parse_args()

    base_dir = os.path.abspath(args.dir)
    load_env(base_dir)

    from pymongo import MongoClient
    from minio import Minio

    mongo_uri = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017")
    mongo_db_name = os.environ.get("MONGO_DB", "atelier_liuteria")
    minio_endpoint = os.environ.get("MINIO_ENDPOINT", "127.0.0.1:9000")
    minio_access = os.environ.get("MINIO_ACCESS_KEY", "")
    minio_secret = os.environ.get("MINIO_SECRET_KEY", "")
    minio_bucket = os.environ.get("MINIO_BUCKET", "atelier-liuteria")
    minio_secure = os.environ.get("MINIO_SECURE", "false").lower() in ("1", "true", "yes")

    mc = Minio(minio_endpoint, access_key=minio_access, secret_key=minio_secret, secure=minio_secure)
    if not mc.bucket_exists(minio_bucket):
        mc.make_bucket(minio_bucket)
        print(f"[MinIO] Creato bucket '{minio_bucket}'")

    upload_dirs = [
        ("biblioteca", os.path.join(base_dir, "biblioteca_uploads")),
        ("media", os.path.join(base_dir, "media_uploads")),
        ("social", os.path.join(base_dir, "social_uploads")),
    ]
    uploaded_count = 0
    for prefix, folder in upload_dirs:
        if not os.path.isdir(folder):
            continue
        for fname in sorted(os.listdir(folder)):
            fpath = os.path.join(folder, fname)
            if not os.path.isfile(fpath):
                continue
            obj_key = f"{prefix}/{fname}"
            ctype = mimetypes.guess_type(fpath)[0] or "application/octet-stream"
            mc.fput_object(minio_bucket, obj_key, fpath, content_type=ctype)
            uploaded_count += 1
            print(f"[MinIO] -> {obj_key}")
    print(f"[MinIO] Migrazione file completata: {uploaded_count} file caricati.")

    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=4000)
    db = client[mongo_db_name]

    bib_state = os.path.join(base_dir, "biblioteca_state.json")
    if os.path.isfile(bib_state):
        with open(bib_state, "r", encoding="utf-8") as f:
            data = json.load(f)
        for item in data.get("items", []):
            if isinstance(item, dict) and item.get("id"):
                db["biblioteca"].replace_one({"id": item["id"]}, item, upsert=True)
        print(f"[MongoDB] Importate {len(data.get('items', []))} schede Biblioteca.")

    soc_state = os.path.join(base_dir, "social_state.json")
    if os.path.isfile(soc_state):
        with open(soc_state, "r", encoding="utf-8") as f:
            data = json.load(f)
        for post in data.get("posts", []):
            if isinstance(post, dict) and post.get("id"):
                db["social"].replace_one({"id": post["id"]}, post, upsert=True)
        print(f"[MongoDB] Importati {len(data.get('posts', []))} post Social.")

    if args.localstorage and os.path.isfile(args.localstorage):
        with open(args.localstorage, "r", encoding="utf-8") as f:
            ls_data = json.load(f)
        for col_name, val in ls_data.items():
            if isinstance(val, list):
                for item in val:
                    if isinstance(item, dict) and item.get("id"):
                        db[col_name].replace_one({"id": item["id"]}, item, upsert=True)
                print(f"[MongoDB] Importata collezione '{col_name}' ({len(val)} elementi).")
            elif isinstance(val, dict) and col_name in ("settings", "liuteriaMaking"):
                doc = dict(val)
                doc["_singleton_id"] = col_name
                db[col_name].replace_one({"_singleton_id": col_name}, doc, upsert=True)
                print(f"[MongoDB] Importato singleton '{col_name}'.")

    print("Migrazione completata con successo.")

if __name__ == "__main__":
    main()
