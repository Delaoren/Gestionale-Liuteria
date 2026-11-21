"""
Atelier Liuteria - Server Locale con Bridge MQTT & Proxy Home Assistant
Permette di eseguire il gestionale su http://localhost:8080 con:
1. Connessione MQTT diretta al broker locale (192.168.68.108:1883) per misurazioni T e H
2. Rilevamento automatico dei payload temperatura e umidità dai sensori (Zigbee2MQTT, Tasmota, ESPHome, ecc.)
3. Proxy per Home Assistant REST API (elimina ogni problema di CORS del browser)
"""

import http.server
import http.cookies
import socketserver
import urllib.request
import urllib.error
import urllib.parse
import json
import os
import sys
import threading
import time
import webbrowser
import base64
import mimetypes
import uuid
import re
import hashlib
import hmac
import secrets
import subprocess
import tarfile
import io
import shutil
import imaplib
import smtplib
import ssl
import email
import email.header
import email.utils
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

try:
    import paho.mqtt.client as mqtt
    HAS_PAHO = True
except ImportError:
    HAS_PAHO = False

try:
    from pymongo import MongoClient
    HAS_PYMONGO = True
except ImportError:
    HAS_PYMONGO = False

try:
    from minio import Minio
    HAS_MINIO = True
except ImportError:
    HAS_MINIO = False

PORT = int(os.environ.get("PORT", 8080))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def _load_dotenv_if_present():
    env_path = os.path.join(DIRECTORY, ".env")
    if not os.path.isfile(env_path):
        return
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k and k not in os.environ:
                    os.environ[k] = v
    except Exception as e:
        print(f"[Env] Errore lettura .env: {e}")

_load_dotenv_if_present()

DEFAULT_MQTT_BROKER = os.environ.get("MQTT_BROKER", "192.168.68.108")
DEFAULT_MQTT_PORT = int(os.environ.get("MQTT_PORT", 1883))
DEFAULT_ESPHOME_HOST = os.environ.get("ESPHOME_HOST", "192.168.68.101")

# ==============================================================================
# MONGODB & MINIO STORAGE LAYER (CON FALLBACK AUTOMATICO SU DISCO/JSON)
# ==============================================================================
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27017")
MONGO_DB_NAME = os.environ.get("MONGO_DB", "atelier_liuteria")
MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "127.0.0.1:9000")
MINIO_ACCESS_KEY = os.environ.get("MINIO_ACCESS_KEY", "")
MINIO_SECRET_KEY = os.environ.get("MINIO_SECRET_KEY", "")
MINIO_BUCKET = os.environ.get("MINIO_BUCKET", "atelier-liuteria")
MINIO_SECURE = os.environ.get("MINIO_SECURE", "false").lower() in ("1", "true", "yes")

mongo_client = None
mongo_db = None
minio_client = None

DB_ARRAY_COLLECTIONS = {
    "biblioteca", "calendarioAppuntamenti", "calendarioLavorazioni",
    "certificati", "clienti", "costruzione", "gestioneContabilita",
    "laboratorio", "magazzinoLegno", "magazzinoStrumenti", "media",
    "report", "restauro", "social", "mail"
}
DB_SINGLETON_COLLECTIONS = {"settings", "liuteriaMaking"}
DB_ALL_COLLECTIONS = DB_ARRAY_COLLECTIONS | DB_SINGLETON_COLLECTIONS

def init_mongo_and_minio():
    global mongo_client, mongo_db, minio_client
    if HAS_PYMONGO and MONGO_URI:
        try:
            c = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000, connectTimeoutMS=2000)
            c.admin.command("ping")
            mongo_client = c
            mongo_db = c[MONGO_DB_NAME]
            print(f"[MongoDB] Connesso al database '{MONGO_DB_NAME}'")
        except Exception as e:
            mongo_client = None
            mongo_db = None
            print(f"[MongoDB] Non disponibile ({e}) -> uso fallback JSON/localStorage")

    if HAS_MINIO and MINIO_ENDPOINT and MINIO_ACCESS_KEY and MINIO_SECRET_KEY:
        try:
            mc = Minio(
                MINIO_ENDPOINT,
                access_key=MINIO_ACCESS_KEY,
                secret_key=MINIO_SECRET_KEY,
                secure=MINIO_SECURE
            )
            if not mc.bucket_exists(MINIO_BUCKET):
                mc.make_bucket(MINIO_BUCKET)
            minio_client = mc
            print(f"[MinIO] Connesso a {MINIO_ENDPOINT} (bucket '{MINIO_BUCKET}')")
        except Exception as e:
            minio_client = None
            print(f"[MinIO] Non disponibile ({e}) -> uso fallback disco locale")

init_mongo_and_minio()

def storage_put_object(prefix, filename, data_bytes, mime_type="application/octet-stream", local_dir=None):
    """Salva su MinIO (se attivo) e su disco locale come fallback."""
    object_key = f"{prefix.strip('/')}/{filename}"
    saved_to_minio = False
    if minio_client is not None:
        try:
            minio_client.put_object(
                MINIO_BUCKET,
                object_key,
                io.BytesIO(data_bytes),
                length=len(data_bytes),
                content_type=mime_type or "application/octet-stream"
            )
            saved_to_minio = True
        except Exception as e:
            print(f"[MinIO] Errore put_object {object_key}: {e}")

    if local_dir and (not saved_to_minio or os.environ.get("KEEP_LOCAL_UPLOADS", "true").lower() == "true"):
        os.makedirs(local_dir, exist_ok=True)
        with open(os.path.join(local_dir, filename), "wb") as f:
            f.write(data_bytes)
    return saved_to_minio

def storage_get_object(prefix, filename, local_dir=None):
    """Legge da MinIO (se attivo), altrimenti da disco locale."""
    object_key = f"{prefix.strip('/')}/{filename}"
    if minio_client is not None:
        resp = None
        try:
            resp = minio_client.get_object(MINIO_BUCKET, object_key)
            data = resp.read()
            ctype = resp.headers.get("Content-Type") or mimetypes.guess_type(filename)[0] or "application/octet-stream"
            return data, ctype
        except Exception:
            pass
        finally:
            if resp is not None:
                try:
                    resp.close()
                    resp.release_conn()
                except Exception:
                    pass

    if local_dir:
        disk_path = os.path.join(local_dir, filename)
        if os.path.isfile(disk_path):
            with open(disk_path, "rb") as f:
                data = f.read()
            ctype = mimetypes.guess_type(disk_path)[0] or "application/octet-stream"
            return data, ctype
    return None, None

def storage_list_objects(prefix, local_dir=None):
    """Elenca i nomi file presenti in MinIO sotto prefix + disco locale."""
    found = {}
    if minio_client is not None:
        try:
            pfx = prefix.strip("/") + "/"
            for obj in minio_client.list_objects(MINIO_BUCKET, prefix=pfx, recursive=True):
                fname = os.path.basename(obj.object_name)
                if fname:
                    found[fname] = obj.size or 0
        except Exception as e:
            print(f"[MinIO] Errore list_objects {prefix}: {e}")
    if local_dir and os.path.isdir(local_dir):
        for fname in os.listdir(local_dir):
            fpath = os.path.join(local_dir, fname)
            if os.path.isfile(fpath) and fname not in found:
                found[fname] = os.path.getsize(fpath)
    return found

def _sanitize_mongo_doc(doc):
    if not isinstance(doc, dict):
        return doc
    clean = dict(doc)
    clean.pop("_id", None)
    return clean

SENSITIVE_SETTINGS_KEYS = {"apiKey", "token", "password", "smtpPass", "imapPass", "secret", "accessToken"}

def _sanitize_settings_doc(obj):
    """Rimuove chiavi/password sensibili dall'oggetto settings prima di salvarlo o esporlo in /api/db/all."""
    if isinstance(obj, list):
        return [_sanitize_settings_doc(x) for x in obj]
    if not isinstance(obj, dict):
        return obj
    out = {}
    for k, v in obj.items():
        if k in SENSITIVE_SETTINGS_KEYS:
            out[k] = ""
        elif isinstance(v, (dict, list)):
            out[k] = _sanitize_settings_doc(v)
        else:
            out[k] = v
    return out

# ==============================================================================
# AUTENTICAZIONE LATO SERVER (HMAC SESSION TOKEN + PBKDF2-SHA256)
# ==============================================================================
AUTH_STATE_FILE = os.path.join(DIRECTORY, "auth_state.json")
AUTH_SESSION_TTL = int(os.environ.get("ATELIER_SESSION_TTL", 86400 * 7))  # 7 giorni
AUTHORIZED_EMAIL = os.environ.get("ATELIER_AUTH_EMAIL", "fabio.delorenzi@gmail.com").strip().lower()
auth_lock = threading.Lock()
auth_state = {"sessionSecret": "", "passwordHash": ""}

def _hash_password_pbkdf2(password, salt=None):
    if not salt:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000)
    return f"pbkdf2_sha256${salt}${dk.hex()}"

def _verify_password_pbkdf2(password, stored_hash):
    try:
        parts = str(stored_hash).split("$")
        if len(parts) != 3 or parts[0] != "pbkdf2_sha256":
            return False
        _, salt, expected_hex = parts
        dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000)
        return hmac.compare_digest(dk.hex(), expected_hex)
    except Exception:
        return False

def load_or_init_auth_state():
    with auth_lock:
        loaded = {}
        if os.path.isfile(AUTH_STATE_FILE):
            try:
                with open(AUTH_STATE_FILE, "r", encoding="utf-8") as f:
                    loaded = json.load(f) or {}
            except Exception:
                loaded = {}
        changed = False
        if not loaded.get("sessionSecret"):
            loaded["sessionSecret"] = secrets.token_hex(32)
            changed = True
        env_pwd = os.environ.get("ATELIER_AUTH_PASSWORD", "").strip()
        if not loaded.get("passwordHash"):
            loaded["passwordHash"] = _hash_password_pbkdf2(env_pwd or "Liuteria2026!")
            changed = True
        auth_state["sessionSecret"] = loaded["sessionSecret"]
        auth_state["passwordHash"] = loaded["passwordHash"]
        if changed:
            try:
                with open(AUTH_STATE_FILE, "w", encoding="utf-8") as f:
                    json.dump(auth_state, f, indent=2)
            except Exception as e:
                print(f"[Auth] Errore salvataggio auth_state.json: {e}")

load_or_init_auth_state()

def _sign_session_token(email_addr, ttl_seconds=AUTH_SESSION_TTL):
    exp = int(time.time()) + ttl_seconds
    payload_b64 = base64.urlsafe_b64encode(json.dumps({"email": email_addr, "exp": exp}).encode("utf-8")).decode("ascii").rstrip("=")
    sig = hmac.new(auth_state["sessionSecret"].encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{sig}"

def _verify_session_token(token):
    if not token or "." not in token:
        return None
    try:
        payload_b64, sig = token.split(".", 1)
        expected_sig = hmac.new(auth_state["sessionSecret"].encode("utf-8"), payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        padded = payload_b64 + "=" * (-len(payload_b64) % 4)
        data = json.loads(base64.urlsafe_b64decode(padded.encode("ascii")).decode("utf-8"))
        if int(data.get("exp", 0)) < int(time.time()):
            return None
        if str(data.get("email", "")).lower() != AUTHORIZED_EMAIL:
            return None
        return data
    except Exception:
        return None

def mongo_get_all_data():
    if mongo_db is None:
        return None
    out = {}
    for col in DB_ARRAY_COLLECTIONS:
        if col == "mail":
            try:
                mongo_db[col].delete_many({"id": {"$regex": "^mail-init-"}})
            except Exception:
                pass
        docs = [_sanitize_mongo_doc(d) for d in mongo_db[col].find({})]
        if col == "mail":
            docs = [d for d in docs if not str(d.get("id", "")).startswith("mail-init-")]
        if docs:
            out[col] = docs
    for col in DB_SINGLETON_COLLECTIONS:
        doc = mongo_db[col].find_one({"_singleton_id": col})
        if doc:
            c = _sanitize_mongo_doc(doc)
            c.pop("_singleton_id", None)
            if col == "settings":
                c = _sanitize_settings_doc(c)
            out[col] = c
    return out

def mongo_sync_collection(collection, data):
    if mongo_db is None or collection not in DB_ALL_COLLECTIONS:
        return False
    col = mongo_db[collection]
    if collection in DB_SINGLETON_COLLECTIONS and isinstance(data, dict):
        payload = _sanitize_settings_doc(data) if collection == "settings" else dict(data)
        payload["_singleton_id"] = collection
        col.replace_one({"_singleton_id": collection}, payload, upsert=True)
        return True
    if collection in DB_ARRAY_COLLECTIONS and isinstance(data, list):
        col.delete_many({})
        if data:
            docs = [
                _sanitize_mongo_doc(it) for it in data
                if isinstance(it, dict) and not (collection == "mail" and str(it.get("id", "")).startswith("mail-init-"))
            ]
            if docs:
                col.insert_many(docs)
        return True
    return False

def mongo_upsert_item(collection, item):
    if mongo_db is None or collection not in DB_ALL_COLLECTIONS:
        return False
    if collection in DB_SINGLETON_COLLECTIONS and isinstance(item, dict):
        return mongo_sync_collection(collection, item)
    if isinstance(item, dict) and item.get("id"):
        if collection == "mail" and str(item.get("id", "")).startswith("mail-init-"):
            return False
        clean = _sanitize_mongo_doc(item)
        mongo_db[collection].replace_one({"id": clean["id"]}, clean, upsert=True)
        return True
    return False

def storage_delete_object(prefix, filename, local_dir=None):
    """Elimina un file da MinIO (se attivo) e dall'eventuale disco locale."""
    safe_fname = os.path.basename(filename or "")
    if not safe_fname:
        return
    object_key = f"{prefix.strip('/')}/{safe_fname}"
    if minio_client is not None:
        try:
            minio_client.remove_object(MINIO_BUCKET, object_key)
        except Exception as e:
            print(f"[MinIO] Errore remove_object {object_key}: {e}")
    if local_dir:
        disk_path = os.path.join(local_dir, safe_fname)
        if os.path.isfile(disk_path):
            try:
                os.remove(disk_path)
            except Exception:
                pass

def _cleanup_storage_for_doc(doc):
    """Rimuove da MinIO/disco eventuali file referenziati dal documento eliminato."""
    if not isinstance(doc, dict):
        return
    urls = []
    for k in ("fileUrl", "url"):
        if isinstance(doc.get(k), str) and doc.get(k):
            urls.append(doc[k])
    for arr_key in ("fotografie", "mediaAttachments"):
        arr = doc.get(arr_key)
        if isinstance(arr, list):
            for entry in arr:
                if isinstance(entry, dict) and isinstance(entry.get("url"), str):
                    urls.append(entry["url"])

    prefix_map = [
        ("/api/biblioteca/file/", "biblioteca", BIBLIOTECA_UPLOADS_DIR),
        ("/biblioteca_uploads/", "biblioteca", BIBLIOTECA_UPLOADS_DIR),
        ("/api/media/file/", "media", MEDIA_UPLOADS_DIR),
        ("/media_uploads/", "media", MEDIA_UPLOADS_DIR),
        ("/api/social/file/", "social", SOCIAL_UPLOADS_DIR),
        ("/social_uploads/", "social", SOCIAL_UPLOADS_DIR),
        ("/api/certificati/file/", "certificati", CERTIFICATI_UPLOADS_DIR),
        ("/certificati_uploads/", "certificati", CERTIFICATI_UPLOADS_DIR),
    ]
    for u in urls:
        clean_u = urllib.parse.unquote(u.split("?")[0])
        for url_pfx, minio_pfx, local_dir in prefix_map:
            if clean_u.startswith(url_pfx):
                fname = clean_u[len(url_pfx):].strip("/")
                storage_delete_object(minio_pfx, fname, local_dir)
                break

def mongo_delete_item(collection, item_id):
    if mongo_db is None or collection not in DB_ARRAY_COLLECTIONS or not item_id:
        return False
    doc = mongo_db[collection].find_one({"id": item_id})
    if doc:
        _cleanup_storage_for_doc(doc)
    mongo_db[collection].delete_one({"id": item_id})
    return True

def calculate_emc(temp_c, hum_pct):
    """
    Equilibrium Moisture Content (EMC) for tonewood / lutherie
    USDA Forest Products Laboratory (Simpson / Hailwood-Horrobin formula)
    """
    try:
        t_c = float(temp_c)
        h = max(0.01, min(0.99, float(hum_pct) / 100.0))
        t_f = t_c * 1.8 + 32.0
        w = 330.0 + 0.452 * t_f + 0.00415 * (t_f ** 2)
        k = 0.791 + 0.000463 * t_f - 0.000000844 * (t_f ** 2)
        k1 = 6.34 + 0.000775 * t_f - 0.0000935 * (t_f ** 2)
        k2 = 1.09 + 0.0171 * t_f - 0.0000905 * (t_f ** 2)
        kh = k * h
        term1 = kh / (1.0 - kh)
        term2 = (k1 * kh + 2.0 * k1 * k2 * (kh ** 2)) / (1.0 + k1 * kh + k1 * k2 * (kh ** 2))
        emc = (1800.0 / w) * (term1 + term2)
        return round(emc, 1)
    except Exception:
        return 9.0

# Global Telemetry State updated live by M5Stack ESPHome & MQTT
telemetry_data = {
    "temp": 24.3,
    "humidity": 61.3,
    "emc": 11.2,
    "lastUpdate": time.strftime("%Y-%m-%d %H:%M:%S"),
    "status": "ready",
    "source": "m5stack",
    "device": "M5Stack STAMPLC",
    "sensors": {
        "lab1": {"temp": 24.3, "humidity": 66.5, "name": "Lab Sensore 1"},
        "lab2": {"temp": 25.7, "humidity": 56.1, "name": "Lab Sensore 2"}
    },
    "topic": None,
    "broker": f"{DEFAULT_MQTT_BROKER}:{DEFAULT_MQTT_PORT}",
    "custom_topic": "",
    "recent_topics": []
}

class EsphomePoller(threading.Thread):
    def __init__(self, host=DEFAULT_ESPHOME_HOST, interval=5):
        super().__init__(daemon=True)
        self.host = host
        self.interval = interval
        self.running = True

    def run(self):
        print(f"[ESPHome] Monitoraggio attivo sensori M5Stack su http://{self.host}/...")
        while self.running:
            try:
                h1, h2, t1, t2 = None, None, None, None

                # Sensor 1 (Lab)
                try:
                    with urllib.request.urlopen(f"http://{self.host}/sensor/lab_umidit__", timeout=2) as r:
                        h1 = json.loads(r.read().decode('utf-8')).get('value')
                except Exception:
                    pass

                try:
                    with urllib.request.urlopen(f"http://{self.host}/sensor/lab_temperatura", timeout=2) as r:
                        t1 = json.loads(r.read().decode('utf-8')).get('value')
                except Exception:
                    pass

                # Sensor 2 (Lab 2)
                try:
                    with urllib.request.urlopen(f"http://{self.host}/sensor/lab2_umidit__", timeout=2) as r:
                        h2 = json.loads(r.read().decode('utf-8')).get('value')
                except Exception:
                    pass

                try:
                    with urllib.request.urlopen(f"http://{self.host}/sensor/lab2_temperatura", timeout=2) as r:
                        t2 = json.loads(r.read().decode('utf-8')).get('value')
                except Exception:
                    pass

                temps = [t for t in [t1, t2] if isinstance(t, (int, float))]
                hums = [h for h in [h1, h2] if isinstance(h, (int, float))]

                if hums and temps:
                    avg_t = round(sum(temps) / len(temps), 1)
                    avg_h = round(sum(hums) / len(hums), 1)
                    avg_emc = calculate_emc(avg_t, avg_h)

                    telemetry_data["temp"] = avg_t
                    telemetry_data["humidity"] = avg_h
                    telemetry_data["emc"] = avg_emc
                    telemetry_data["lastUpdate"] = time.strftime("%Y-%m-%d %H:%M:%S")
                    telemetry_data["status"] = "connected"
                    telemetry_data["source"] = "m5stack"
                    telemetry_data["device"] = "M5Stack STAMPLC"
                    telemetry_data["sensors"] = {
                        "lab1": {"temp": t1, "humidity": h1, "emc": calculate_emc(t1, h1), "name": "Lab Sensore 1"},
                        "lab2": {"temp": t2, "humidity": h2, "emc": calculate_emc(t2, h2), "name": "Lab Sensore 2"}
                    }

                    # Publish live readings to MQTT broker so all systems stay in sync
                    if mqtt_bridge_instance and mqtt_bridge_instance.client and mqtt_bridge_instance.client.is_connected():
                        mqtt_payload = json.dumps({
                            "temperature": avg_t,
                            "humidity": avg_h,
                            "emc": avg_emc,
                            "lab1": {"temperature": t1, "humidity": h1, "emc": calculate_emc(t1, h1)},
                            "lab2": {"temperature": t2, "humidity": h2, "emc": calculate_emc(t2, h2)},
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                        })
                        mqtt_bridge_instance.client.publish("atelier/laboratorio/telemetria", mqtt_payload, retain=True)
            except Exception as e:
                pass

            time.sleep(self.interval)

def extract_sensor_values(obj):
    """Recursively search for temperature and humidity in any JSON structure"""
    temp = None
    hum = None

    if isinstance(obj, dict):
        # Case-insensitive key checks
        lower_keys = {k.lower(): (k, v) for k, v in obj.items()}
        
        # Temp keys
        for tk in ["temperature", "temp", "t", "temperatura", "temp_c"]:
            if tk in lower_keys:
                orig_k, val = lower_keys[tk]
                if isinstance(val, (int, float)):
                    temp = float(val)
                    break
                elif isinstance(val, str):
                    try:
                        temp = float(val)
                        break
                    except ValueError:
                        pass
        
        # Humidity keys
        for hk in ["humidity", "hum", "h", "umidita", "umidità", "relative_humidity", "rh"]:
            if hk in lower_keys:
                orig_k, val = lower_keys[hk]
                if isinstance(val, (int, float)):
                    hum = float(val)
                    break
                elif isinstance(val, str):
                    try:
                        hum = float(val.replace('%', '').strip())
                        break
                    except ValueError:
                        pass

        # If not found at this level, recurse into nested dicts
        for k, v in obj.items():
            if isinstance(v, dict):
                sub_temp, sub_hum = extract_sensor_values(v)
                if temp is None and sub_temp is not None:
                    temp = sub_temp
                if hum is None and sub_hum is not None:
                    hum = sub_hum

    return temp, hum

class MqttBridge(threading.Thread):
    def __init__(self, broker=DEFAULT_MQTT_BROKER, port=DEFAULT_MQTT_PORT, custom_topic=""):
        super().__init__(daemon=True)
        self.broker = broker
        self.port = port
        self.custom_topic = custom_topic
        self.client = None
        self.running = True

    def run(self):
        if not HAS_PAHO:
            print("[MQTT] Libreria paho-mqtt non disponibile.")
            return

        while self.running:
            try:
                self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
                self.client.on_connect = self.on_connect
                self.client.on_message = self.on_message
                self.client.on_disconnect = self.on_disconnect
                print(f"[MQTT] Connessione in corso a {self.broker}:{self.port}...")
                self.client.connect(self.broker, self.port, 10)
                self.client.loop_forever()
            except Exception as e:
                print(f"[MQTT] Tentativo di riconnessione tra 5s ({e})...")
                telemetry_data["status"] = "error"
                time.sleep(5)

    def on_connect(self, client, userdata, flags, rc, properties=None):
        rc_str = str(rc)
        is_success = rc == 0 or getattr(rc, 'value', None) == 0 or rc_str == 'Success' or not getattr(rc, 'is_failure', False)
        if is_success:
            print(f"[MQTT] Connessione stabilita con successo a {self.broker}:{self.port}!")
            telemetry_data["status"] = "connected"
            telemetry_data["broker"] = f"{self.broker}:{self.port}"
            client.subscribe("#", qos=0)
            print("[MQTT] In ascolto su tutti i topic ('#') per sensori...")
        else:
            print(f"[MQTT] Connessione fallita: {rc}")
            telemetry_data["status"] = "error"

    def on_disconnect(self, client, userdata, flags, rc, properties=None):
        print(f"[MQTT] Disconnesso dal broker (codice: {rc})")
        telemetry_data["status"] = "disconnected"

    def on_message(self, client, userdata, msg):
        topic = msg.topic
        try:
            payload_str = msg.payload.decode('utf-8', errors='ignore').strip()
        except Exception:
            return

        # Track recent topics for topic picker
        found = False
        for item in telemetry_data["recent_topics"]:
            if item.get("topic") == topic:
                item["time"] = time.strftime("%H:%M:%S")
                item["preview"] = payload_str[:80]
                found = True
                break
        if not found:
            telemetry_data["recent_topics"].insert(0, {
                "topic": topic,
                "time": time.strftime("%H:%M:%S"),
                "preview": payload_str[:80]
            })
            if len(telemetry_data["recent_topics"]) > 30:
                telemetry_data["recent_topics"].pop()

        # If a specific custom topic is configured and does not match, ignore
        target_topic = telemetry_data.get("custom_topic", "").strip()
        if target_topic and target_topic != "#" and target_topic != topic:
            return

        parsed_temp = None
        parsed_hum = None

        # 1. Parse JSON payloads
        if (payload_str.startswith('{') and payload_str.endswith('}')) or (payload_str.startswith('[') and payload_str.endswith(']')):
            try:
                data = json.loads(payload_str)
                parsed_temp, parsed_hum = extract_sensor_values(data)
            except Exception:
                pass
        else:
            # 2. Parse plain numeric payloads based on topic name semantics
            try:
                val = float(payload_str)
                topic_lower = topic.lower()
                if "temp" in topic_lower or "temperatura" in topic_lower:
                    parsed_temp = val
                elif "hum" in topic_lower or "umid" in topic_lower or "rh" in topic_lower:
                    parsed_hum = val
            except ValueError:
                pass

        if parsed_temp is not None or parsed_hum is not None:
            if parsed_temp is not None:
                telemetry_data["temp"] = round(parsed_temp, 1)
            if parsed_hum is not None:
                telemetry_data["humidity"] = round(parsed_hum, 1)
            telemetry_data["emc"] = calculate_emc(telemetry_data["temp"], telemetry_data["humidity"])
            telemetry_data["lastUpdate"] = time.strftime("%Y-%m-%d %H:%M:%S")
            if "laboratorio" in topic or "m5stack" in topic:
                telemetry_data["source"] = "m5stack"
                telemetry_data["device"] = "M5Stack STAMPLC"
            else:
                telemetry_data["source"] = "mqtt"
            telemetry_data["topic"] = topic
            print(f"[MQTT Ricevuto] {topic} -> T: {telemetry_data['temp']}°C, H: {telemetry_data['humidity']}%, EMC: {telemetry_data['emc']}%")

    def publish_test(self, topic="atelier/sensore_laboratorio", temp=21.9, hum=48.2):
        if self.client and self.client.is_connected():
            payload = json.dumps({
                "temperature": temp,
                "humidity": hum,
                "sensor": "DHT22 / Zigbee",
                "unit_temp": "°C",
                "unit_hum": "%",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            })
            self.client.publish(topic, payload, qos=0)
            print(f"[MQTT Test Inviato] {topic} -> {payload}")
            return True
        return False

# Global bridge reference
mqtt_bridge_instance = None

# ==============================================================================
# SOCIAL WEBHOOK BRIDGE (MAKE.COM / ZAPIER / N8N) & 24/7 SERVER SCHEDULER
# ==============================================================================
SOCIAL_UPLOADS_DIR = os.path.join(DIRECTORY, "social_uploads")
BIBLIOTECA_UPLOADS_DIR = os.path.join(DIRECTORY, "biblioteca_uploads")
MEDIA_UPLOADS_DIR = os.path.join(DIRECTORY, "media_uploads")
CERTIFICATI_UPLOADS_DIR = os.path.join(DIRECTORY, "certificati_uploads")
SOCIAL_STATE_FILE = os.path.join(DIRECTORY, "social_state.json")
BIBLIOTECA_STATE_FILE = os.path.join(DIRECTORY, "biblioteca_state.json")
os.makedirs(CERTIFICATI_UPLOADS_DIR, exist_ok=True)
biblioteca_lock = threading.Lock()
biblioteca_state = {"items": [], "updatedAt": ""}

def load_biblioteca_state():
    if mongo_db is not None:
        try:
            docs = [_sanitize_mongo_doc(d) for d in mongo_db["biblioteca"].find({})]
            if docs:
                with biblioteca_lock:
                    biblioteca_state["items"] = docs
                return
        except Exception as e:
            print(f"[Biblioteca] Errore lettura MongoDB: {e}")
    with biblioteca_lock:
        if os.path.isfile(BIBLIOTECA_STATE_FILE):
            try:
                with open(BIBLIOTECA_STATE_FILE, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    if isinstance(loaded, dict) and isinstance(loaded.get("items"), list):
                        biblioteca_state["items"] = loaded["items"]
                        biblioteca_state["updatedAt"] = loaded.get("updatedAt", "")
            except Exception as e:
                print(f"[Biblioteca] Errore caricamento biblioteca_state.json: {e}")

def save_biblioteca_state():
    with biblioteca_lock:
        items_copy = [dict(it) for it in biblioteca_state.get("items", []) if isinstance(it, dict)]
        biblioteca_state["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%S")
        try:
            with open(BIBLIOTECA_STATE_FILE, "w", encoding="utf-8") as f:
                json.dump(biblioteca_state, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[Biblioteca] Errore salvataggio biblioteca_state.json: {e}")
    if mongo_db is not None:
        try:
            mongo_sync_collection("biblioteca", items_copy)
        except Exception as e:
            print(f"[Biblioteca] Errore sync MongoDB: {e}")

def _format_bytes_human(num_bytes):
    if not num_bytes or num_bytes <= 0:
        return "0 KB"
    mb = num_bytes / (1024 * 1024)
    if mb >= 1024:
        return f"{mb / 1024:.2f} GB"
    if mb >= 1:
        return f"{mb:.1f} MB"
    return f"{max(1, round(num_bytes / 1024))} KB"

def get_biblioteca_items_with_orphan_recovery():
    """Restituisce le schede salvate (MongoDB/JSON) e ripristina automaticamente eventuali file orfani in MinIO o biblioteca_uploads/."""
    if mongo_db is not None:
        try:
            docs = [_sanitize_mongo_doc(d) for d in mongo_db["biblioteca"].find({})]
            if docs:
                with biblioteca_lock:
                    biblioteca_state["items"] = docs
        except Exception:
            pass

    with biblioteca_lock:
        items = [dict(it) for it in biblioteca_state.get("items", []) if isinstance(it, dict)]

    known_file_ids = {str(it.get("fileId") or "").strip() for it in items if it.get("fileId")}
    known_urls = {str(it.get("fileUrl") or "").strip() for it in items if it.get("fileUrl")}
    known_names = {str(it.get("fileName") or "").strip() for it in items if it.get("fileName")}

    all_files = storage_list_objects("biblioteca", BIBLIOTECA_UPLOADS_DIR)
    for fname in sorted(all_files.keys()):
        api_url = f"/api/biblioteca/file/{fname}"
        legacy_url = f"/biblioteca_uploads/{fname}"

        m = re.match(r'^(ebk-[^_]+)_(.+)$', fname)
        file_id = m.group(1) if m else f"ebk-restored-{abs(hash(fname)) % 1000000}"
        orig_name = m.group(2) if m else fname

        if file_id in known_file_ids or api_url in known_urls or legacy_url in known_urls or orig_name in known_names:
            continue

        ext = os.path.splitext(orig_name)[1].lower() or ".pdf"
        mime = mimetypes.guess_type(orig_name)[0] or "application/octet-stream"
        size_bytes = all_files[fname]
        clean_title = re.sub(r'[-_]+', ' ', os.path.splitext(orig_name)[0]).strip()
        pretty_title = (clean_title[:1].upper() + clean_title[1:]) if clean_title else orig_name

        ext_upper = ext.lstrip('.').upper() or "DOC"
        fmt_label = "PDF Documento / Blueprint" if ext == ".pdf" else (
            "EPUB Ebook" if ext == ".epub" else (
                "TXT Testo / Appunti" if ext == ".txt" else f"{ext_upper} Ebook / Documento"
            )
        )
        items.append({
            "id": f"bib-srv-{file_id}",
            "titolo": pretty_title,
            "autore": "Archivio Liuteria De Lorenzi",
            "categoria": "Tecnica Costruttiva",
            "anno": int(time.strftime("%Y")),
            "formato": fmt_label,
            "pagine": 24,
            "note": "Testo/documento ripristinato automaticamente dall'archivio server/MinIO.",
            "tags": [ext_upper, "Ripristinato", "Liuteria"],
            "fileId": file_id,
            "fileName": orig_name,
            "fileExt": ext,
            "fileMime": mime,
            "fileSizeBytes": size_bytes,
            "fileSizeFormatted": _format_bytes_human(size_bytes),
            "fileUrl": api_url,
            "isIndexedDB": False
        })
    return items

load_biblioteca_state()
os.makedirs(SOCIAL_UPLOADS_DIR, exist_ok=True)
os.makedirs(BIBLIOTECA_UPLOADS_DIR, exist_ok=True)
os.makedirs(MEDIA_UPLOADS_DIR, exist_ok=True)

# Registra MIME types per i formati Ebook e Media (Audio, Video, Immagini, 3D, CAD)
mimetypes.add_type("application/pdf", ".pdf")
mimetypes.add_type("application/epub+zip", ".epub")
mimetypes.add_type("application/x-mobipocket-ebook", ".mobi")
mimetypes.add_type("application/vnd.amazon.ebook", ".azw")
mimetypes.add_type("application/vnd.amazon.ebook", ".azw3")
mimetypes.add_type("image/vnd.djvu", ".djvu")
mimetypes.add_type("image/vnd.djvu", ".djv")
mimetypes.add_type("application/x-fictionbook+xml", ".fb2")
mimetypes.add_type("application/vnd.comicbook+zip", ".cbz")
mimetypes.add_type("application/vnd.comicbook-rar", ".cbr")
mimetypes.add_type("audio/flac", ".flac")
mimetypes.add_type("audio/wav", ".wav")
mimetypes.add_type("audio/mp4", ".m4a")
mimetypes.add_type("audio/ogg", ".ogg")
mimetypes.add_type("audio/opus", ".opus")
mimetypes.add_type("audio/aac", ".aac")
mimetypes.add_type("audio/aiff", ".aiff")
mimetypes.add_type("video/mp4", ".mp4")
mimetypes.add_type("video/webm", ".webm")
mimetypes.add_type("video/quicktime", ".mov")
mimetypes.add_type("video/x-matroska", ".mkv")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/avif", ".avif")
mimetypes.add_type("model/gltf-binary", ".glb")
mimetypes.add_type("model/gltf+json", ".gltf")
mimetypes.add_type("model/obj", ".obj")
mimetypes.add_type("model/stl", ".stl")

social_lock = threading.Lock()

social_state = {
    "config": {
        "enabled": False,
        "provider": "make",
        "webhookUrl": "",
        "instagramWebhookUrl": "",
        "facebookWebhookUrl": "",
        "webhookSecret": "",
        "payloadFormat": "multipart",
        "publicBaseUrl": "",
        "instagramAccountLabel": "@liuteriadelorenzi",
        "facebookPageLabel": "Liuteria De Lorenzi",
        "lastTestStatus": "unconfigured",
        "lastTestTime": "",
        "lastTestMessage": ""
    },
    "posts": [],
    "mediaFiles": {},
    "history": []
}

def load_social_state():
    global social_state
    with social_lock:
        if os.path.exists(SOCIAL_STATE_FILE):
            try:
                with open(SOCIAL_STATE_FILE, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    if isinstance(loaded, dict):
                        if "config" in loaded and isinstance(loaded["config"], dict):
                            social_state["config"].update(loaded["config"])
                        if "posts" in loaded and isinstance(loaded["posts"], list):
                            social_state["posts"] = loaded["posts"]
                        if "mediaFiles" in loaded and isinstance(loaded["mediaFiles"], dict):
                            social_state["mediaFiles"] = loaded["mediaFiles"]
                        if "history" in loaded and isinstance(loaded["history"], list):
                            social_state["history"] = loaded["history"][:30]
            except Exception as e:
                print(f"[SocialScheduler] Errore caricamento social_state.json: {e}")

def save_social_state():
    with social_lock:
        try:
            with open(SOCIAL_STATE_FILE, "w", encoding="utf-8") as f:
                json.dump(social_state, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[SocialScheduler] Errore salvataggio social_state.json: {e}")

load_social_state()

def resolve_social_media_file(media_item):
    """Restituisce (bytes_data, filename, mime_type, rel_url) per un allegato social"""
    if not isinstance(media_item, dict):
        return None, None, None, ""

    m_id = media_item.get("id", "")
    m_name = media_item.get("name") or "media_atelier.jpg"
    m_mime = media_item.get("mimeType") or mimetypes.guess_type(m_name)[0] or "image/jpeg"
    m_url = media_item.get("url") or ""
    m_thumb = media_item.get("thumbnailDataUrl") or ""

    # 1. Check uploaded files in social_uploads/
    if m_id and m_id in social_state.get("mediaFiles", {}):
        info = social_state["mediaFiles"][m_id]
        disk_path = os.path.join(DIRECTORY, info.get("relPath", ""))
        if os.path.isfile(disk_path):
            try:
                with open(disk_path, "rb") as f:
                    return f.read(), info.get("name", m_name), info.get("mimeType", m_mime), "/" + info.get("relPath", "").replace("\\", "/")
            except Exception:
                pass

    # 2. Check if m_url points to /social_uploads/... or ./assets/...
    for candidate_url in [m_url, m_thumb]:
        if not candidate_url or candidate_url.startswith("data:") or candidate_url.startswith("http"):
            continue
        clean_rel = candidate_url.lstrip("./").lstrip("/")
        disk_path = os.path.join(DIRECTORY, clean_rel.replace("/", os.sep))
        if os.path.isfile(disk_path):
            try:
                with open(disk_path, "rb") as f:
                    guessed_mime = mimetypes.guess_type(disk_path)[0] or m_mime
                    return f.read(), os.path.basename(disk_path), guessed_mime, "/" + clean_rel
            except Exception:
                pass

    # 3. Check if thumbnailDataUrl is a base64 Data-URL
    if m_thumb.startswith("data:") and ";base64," in m_thumb:
        try:
            header, b64_part = m_thumb.split(";base64,", 1)
            data_mime = header.replace("data:", "").strip() or m_mime
            raw_bytes = base64.b64decode(b64_part)
            return raw_bytes, m_name, data_mime, ""
        except Exception:
            pass

    return None, m_name, m_mime, m_url

def build_multipart_request(fields, files):
    """Costruisce un body multipart/form-data standard per Make.com / Zapier / n8n"""
    boundary = f"----AtelierLiuteriaBoundary{uuid.uuid4().hex}"
    body_parts = []

    for key, val in fields.items():
        val_str = str(val if val is not None else "")
        body_parts.append(f"--{boundary}\r\n".encode("utf-8"))
        body_parts.append(f'Content-Disposition: form-data; name="{key}"\r\n\r\n'.encode("utf-8"))
        body_parts.append(f"{val_str}\r\n".encode("utf-8"))

    for field_name, filename, mime_type, file_bytes in files:
        safe_fn = filename.replace('"', '_')
        body_parts.append(f"--{boundary}\r\n".encode("utf-8"))
        body_parts.append(f'Content-Disposition: form-data; name="{field_name}"; filename="{safe_fn}"\r\n'.encode("utf-8"))
        body_parts.append(f"Content-Type: {mime_type}\r\n\r\n".encode("utf-8"))
        body_parts.append(file_bytes)
        body_parts.append(b"\r\n")

    body_parts.append(f"--{boundary}--\r\n".encode("utf-8"))
    return b"".join(body_parts), f"multipart/form-data; boundary={boundary}"

def dispatch_social_webhook(post, config_override=None, is_test=False):
    """
    Invia il post (testo, hashtag, piattaforme Instagram/Facebook e file foto/video)
    al Webhook configurato (Make.com / Zapier / n8n).
    """
    cfg = dict(social_state.get("config", {}))
    if isinstance(config_override, dict):
        cfg.update(config_override)

    main_url = (cfg.get("webhookUrl") or "").strip()
    ig_url = (cfg.get("instagramWebhookUrl") or "").strip()
    fb_url = (cfg.get("facebookWebhookUrl") or "").strip()
    secret = (cfg.get("webhookSecret") or "").strip()
    payload_fmt = (cfg.get("payloadFormat") or "multipart").strip().lower()
    public_base = (cfg.get("publicBaseUrl") or "").strip().rstrip("/")
    provider_name = (cfg.get("provider") or "make").upper()

    platforms = post.get("piattaforme")
    if not isinstance(platforms, list) or len(platforms) == 0:
        raw_p = post.get("piattaforma") or "Instagram, Facebook"
        platforms = [p.strip() for p in raw_p.split(",") if p.strip()]

    wants_ig = any("instagram" in p.lower() for p in platforms)
    wants_fb = any("facebook" in p.lower() for p in platforms)

    # Costruisci mappa URL target -> piattaforme servite da quell'URL
    url_targets = {}
    for p in platforms:
        p_low = p.lower()
        target_u = main_url
        if "instagram" in p_low and ig_url:
            target_u = ig_url
        elif "facebook" in p_low and fb_url:
            target_u = fb_url
        if target_u:
            url_targets.setdefault(target_u, []).append(p)

    # Se è un test o nessuna piattaforma ha matchato ma main_url/ig_url/fb_url esiste
    if not url_targets:
        fallback_u = main_url or ig_url or fb_url
        if fallback_u:
            url_targets[fallback_u] = platforms

    if not url_targets:
        return {
            "success": False,
            "code": "MISSING_WEBHOOK",
            "error": "Accessi Social non configurati: manca l'URL del Webhook (Make.com / Zapier / n8n) per Instagram e Facebook."
        }

    titolo = (post.get("titolo") or "Post Liuteria De Lorenzi").strip()
    note = (post.get("note") or "").strip()
    hashtag = (post.get("hashtag") or "").strip()
    formato_post = (post.get("formatoPost") or "Post Foto / Carosello HD").strip()
    data_prog = post.get("dataProgrammata") or time.strftime("%Y-%m-%dT%H:%M")

    caption_parts = [p for p in [titolo, note, hashtag] if p]
    caption_full = "\n\n".join(caption_parts)

    media_list = post.get("mediaAttachments") if isinstance(post.get("mediaAttachments"), list) else []
    resolved_files = []
    media_meta_list = []

    for idx, m in enumerate(media_list):
        f_bytes, f_name, f_mime, rel_url = resolve_social_media_file(m)
        full_media_url = f"{public_base}{rel_url}" if (public_base and rel_url) else rel_url
        is_vid = (m.get("kind") == "video") or (f_mime and f_mime.startswith("video/"))
        m_entry = {
            "index": idx + 1,
            "id": m.get("id", f"media-{idx+1}"),
            "name": f_name or m.get("name", f"file_{idx+1}"),
            "kind": "video" if is_vid else "image",
            "mimeType": f_mime or "image/jpeg",
            "sizeBytes": len(f_bytes) if f_bytes else m.get("sizeBytes", 0),
            "dimensions": m.get("dimensions", ""),
            "url": full_media_url
        }
        if f_bytes:
            field_key = "file" if idx == 0 else f"file_{idx+1}"
            resolved_files.append((field_key, m_entry["name"], m_entry["mimeType"], f_bytes))
            # Se formato JSON e file immagine <= 12MB, includi base64 per cloud webhook
            if payload_fmt == "json" and len(f_bytes) <= 12 * 1024 * 1024:
                m_entry["base64"] = base64.b64encode(f_bytes).decode("ascii")
        media_meta_list.append(m_entry)

    # Se non c'è nessun file allegato ma è un test, allega l'immagine di default del violino se presente
    if is_test and not resolved_files:
        sample_path = os.path.join(DIRECTORY, "assets", "violin-1.jpg")
        if os.path.isfile(sample_path):
            try:
                with open(sample_path, "rb") as f:
                    s_bytes = f.read()
                resolved_files.append(("file", "violin-1.jpg", "image/jpeg", s_bytes))
                media_meta_list.append({
                    "index": 1,
                    "id": "test-media-1",
                    "name": "violin-1.jpg",
                    "kind": "image",
                    "mimeType": "image/jpeg",
                    "sizeBytes": len(s_bytes),
                    "url": f"{public_base}/assets/violin-1.jpg" if public_base else "/assets/violin-1.jpg"
                })
            except Exception:
                pass

    primary_media = media_meta_list[0] if media_meta_list else {}
    now_iso = datetime.now().isoformat()
    now_hm = time.strftime("%H:%M")

    esito_list = []
    errors = []
    last_http_status = 0
    last_resp_preview = ""

    for target_url, target_plats in url_targets.items():
        t_wants_ig = any("instagram" in p.lower() for p in target_plats)
        t_wants_fb = any("facebook" in p.lower() for p in target_plats)

        common_fields = {
            "event": "test_webhook" if is_test else "publish_social_post",
            "is_test": "true" if is_test else "false",
            "atelier": "Liuteria De Lorenzi - Cremona",
            "post_id": post.get("id") or "soc-test",
            "title": titolo,
            "caption": note or titolo,
            "hashtags": hashtag,
            "caption_full": caption_full,
            "formato_post": formato_post,
            "platforms": json.dumps(target_plats, ensure_ascii=False),
            "platforms_csv": ", ".join(target_plats),
            "publish_instagram": "true" if t_wants_ig else "false",
            "publish_facebook": "true" if t_wants_fb else "false",
            "instagram_account": cfg.get("instagramAccountLabel") or "@liuteriadelorenzi",
            "facebook_page": cfg.get("facebookPageLabel") or "Liuteria De Lorenzi",
            "media_count": str(len(media_meta_list)),
            "media_type": "VIDEO" if primary_media.get("kind") == "video" else "IMAGE",
            "media_filename": primary_media.get("name", ""),
            "media_mime": primary_media.get("mimeType", ""),
            "media_url": primary_media.get("url", ""),
            "scheduled_at": data_prog,
            "published_at": now_iso
        }

        try:
            if payload_fmt == "multipart" and len(resolved_files) > 0:
                body_bytes, content_type = build_multipart_request(common_fields, resolved_files)
            else:
                json_payload = dict(common_fields)
                json_payload["publish_instagram"] = t_wants_ig
                json_payload["publish_facebook"] = t_wants_fb
                json_payload["platforms"] = target_plats
                json_payload["media_files"] = media_meta_list
                body_bytes = json.dumps(json_payload, ensure_ascii=False).encode("utf-8")
                content_type = "application/json; charset=utf-8"

            req = urllib.request.Request(target_url, data=body_bytes, method="POST")
            req.add_header("Content-Type", content_type)
            req.add_header("User-Agent", "AtelierLiuteria-SocialPublisher/2.0")
            if secret:
                req.add_header("X-Webhook-Secret", secret)
                req.add_header("Authorization", f"Bearer {secret}")

            with urllib.request.urlopen(req, timeout=45) as resp:
                last_http_status = resp.getcode()
                resp_body = resp.read().decode("utf-8", errors="ignore").strip()
                last_resp_preview = resp_body[:160]

                for p_name in target_plats:
                    esito_list.append({
                        "piattaforma": p_name,
                        "stato": f"Pubblicato via {provider_name} (HTTP {last_http_status})",
                        "timestamp": now_hm
                    })
        except urllib.error.HTTPError as he:
            err_body = ""
            try:
                err_body = he.read().decode("utf-8", errors="ignore").strip()[:160]
            except Exception:
                pass
            errors.append(f"HTTP {he.code} su {', '.join(target_plats)}: {err_body or he.reason}")
        except Exception as ex:
            errors.append(f"Errore connessione Webhook ({', '.join(target_plats)}): {str(ex)}")

    success = (len(errors) == 0 and len(esito_list) > 0)

    log_entry = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "postId": post.get("id", "test"),
        "titolo": titolo,
        "platforms": platforms,
        "isTest": is_test,
        "success": success,
        "status": f"HTTP {last_http_status}" if success else "; ".join(errors)
    }
    with social_lock:
        social_state.setdefault("history", []).insert(0, log_entry)
        social_state["history"] = social_state["history"][:30]

    if success:
        return {
            "success": True,
            "httpStatus": last_http_status,
            "responsePreview": last_resp_preview or "Accepted",
            "esito": esito_list,
            "publishedAt": now_iso
        }
    else:
        return {
            "success": False,
            "code": "WEBHOOK_ERROR",
            "error": " | ".join(errors)
        }

class SocialSchedulerThread(threading.Thread):
    """
    Controlla in background 24/7 i post con stato 'Programmato' e autoPublish attivo.
    Quando scatta la data/ora stabilita, invia automaticamente il post a Instagram e Facebook via Webhook.
    """
    def __init__(self, interval=15):
        super().__init__(daemon=True)
        self.interval = interval
        self.running = True

    def run(self):
        print("[SocialScheduler] Motore pubblicazione automatica Social (IG/FB) attivo 24/7...")
        while self.running:
            try:
                self.check_and_publish_due_posts()
            except Exception as e:
                print(f"[SocialScheduler] Errore nel ciclo di controllo: {e}")
            time.sleep(self.interval)

    def check_and_publish_due_posts(self):
        now_dt = datetime.now()
        state_changed = False

        posts_snapshot = list(social_state.get("posts", []))
        for post in posts_snapshot:
            if not isinstance(post, dict):
                continue
            if post.get("stato") != "Programmato":
                continue
            if post.get("autoPublish") is False:
                continue

            raw_date = (post.get("dataProgrammata") or "").strip()
            if not raw_date:
                continue

            norm_date = raw_date.replace(" ", "T")
            target_dt = None
            for fmt in ("%Y-%m-%dT%H:%M", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"):
                try:
                    target_dt = datetime.strptime(norm_date[:19], fmt)
                    break
                except ValueError:
                    continue

            if not target_dt or target_dt > now_dt:
                continue

            # Data/ora programmata raggiunta!
            print(f"[SocialScheduler] Scattata pubblicazione automatica per '{post.get('titolo')}' ({raw_date})...")
            res = dispatch_social_webhook(post, is_test=False)
            if res.get("success"):
                post["stato"] = "Pubblicato"
                post["dataPubblicazioneEffettiva"] = res.get("publishedAt", now_dt.isoformat())
                post["esitoPubblicazione"] = res.get("esito", [])
                post["errorePubblicazione"] = ""
                post["updatedAt"] = now_dt.isoformat()
                print(f"[SocialScheduler] PUBBLICATO CON SUCCESSO: '{post.get('titolo')}'")
            else:
                err_msg = res.get("error", "Errore sconosciuto durante l'invio al Webhook")
                post["stato"] = "Errore Accessi" if res.get("code") == "MISSING_WEBHOOK" else "Errore Invio"
                post["errorePubblicazione"] = err_msg
                post["updatedAt"] = now_dt.isoformat()
                print(f"[SocialScheduler] BLOCCO PUBBLICAZIONE '{post.get('titolo')}': {err_msg}")

            state_changed = True

        if state_changed:
            save_social_state()


# ==============================================================================
# SENDINBLUE (BREVO) EMAIL REMINDER SERVICE PER APP CALENDARIO
# ==============================================================================
SENDINBLUE_STATE_FILE = os.path.join(DIRECTORY, "sendinblue_state.json")
sendinblue_lock = threading.Lock()

sendinblue_state = {
    "config": {
        "enabled": False,
        "apiKey": os.environ.get("SENDINBLUE_API_KEY", ""),
        "senderName": "Liuteria De Lorenzi - Cremona",
        "senderEmail": "fabio.delorenzi@gmail.com",
        "replyToEmail": "fabio.delorenzi@gmail.com",
        "atelierAddress": "Bottega Liuteria De Lorenzi — Cremona",
        "atelierPhone": "+39 0372 000000",
        "lastTestStatus": "unconfigured",
        "lastTestTime": "",
        "lastTestMessage": ""
    },
    "history": []
}

def load_sendinblue_state():
    global sendinblue_state
    with sendinblue_lock:
        if os.path.exists(SENDINBLUE_STATE_FILE):
            try:
                with open(SENDINBLUE_STATE_FILE, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    if isinstance(loaded, dict):
                        if "config" in loaded and isinstance(loaded["config"], dict):
                            sendinblue_state["config"].update(loaded["config"])
                        if "history" in loaded and isinstance(loaded["history"], list):
                            sendinblue_state["history"] = loaded["history"][:40]
            except Exception as e:
                print(f"[Sendinblue] Errore caricamento sendinblue_state.json: {e}")

def save_sendinblue_state():
    with sendinblue_lock:
        try:
            with open(SENDINBLUE_STATE_FILE, "w", encoding="utf-8") as f:
                json.dump(sendinblue_state, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[Sendinblue] Errore salvataggio sendinblue_state.json: {e}")

load_sendinblue_state()

def dispatch_sendinblue_reminder(req_payload, config_override=None):
    """
    Invia un'email transazionale di promemoria tramite Sendinblue (Brevo) API v3
    Endpoint: https://api.brevo.com/v3/smtp/email (compatibile con chiavi xkeysib-...)
    """
    cfg = dict(sendinblue_state.get("config", {}))
    if isinstance(config_override, dict):
        cfg.update(config_override)

    api_key = (cfg.get("apiKey") or os.environ.get("SENDINBLUE_API_KEY") or "").strip()
    if not api_key:
        return {
            "success": False,
            "code": "MISSING_API_KEY",
            "error": "Chiave API Sendinblue non configurata. Clicca su 'Configura Sendinblue' e inserisci la tua API Key v3 (xkeysib-...)."
        }

    sender_name = (cfg.get("senderName") or "Liuteria De Lorenzi - Cremona").strip()
    sender_email = (cfg.get("senderEmail") or "fabio.delorenzi@gmail.com").strip()
    reply_to = (cfg.get("replyToEmail") or sender_email).strip()

    to_email = (req_payload.get("toEmail") or "").strip()
    to_name = (req_payload.get("toName") or "Gentile Cliente").strip()
    subject = (req_payload.get("subject") or "Promemoria Appuntamento — Liuteria De Lorenzi").strip()
    html_content = (req_payload.get("htmlContent") or "").strip()
    text_content = (req_payload.get("textContent") or "").strip()

    if not to_email or "@" not in to_email:
        return {
            "success": False,
            "code": "INVALID_EMAIL",
            "error": "Inserisci un indirizzo email destinatario valido per inviare il promemoria con Sendinblue."
        }

    if not html_content:
        escaped_txt = text_content.replace("\n", "<br>")
        html_content = f"<html><body><p>{escaped_txt}</p></body></html>"

    sib_body = {
        "sender": {
            "name": sender_name,
            "email": sender_email
        },
        "to": [
            {
                "email": to_email,
                "name": to_name
            }
        ],
        "replyTo": {
            "email": reply_to,
            "name": sender_name
        },
        "subject": subject,
        "htmlContent": html_content
    }
    if text_content:
        sib_body["textContent"] = text_content

    body_bytes = json.dumps(sib_body, ensure_ascii=False).encode("utf-8")
    endpoints = [
        "https://api.brevo.com/v3/smtp/email",
        "https://api.sendinblue.com/v3/smtp/email"
    ]

    last_err = ""
    for ep_url in endpoints:
        try:
            req = urllib.request.Request(ep_url, data=body_bytes, method="POST")
            req.add_header("Accept", "application/json")
            req.add_header("Content-Type", "application/json; charset=utf-8")
            req.add_header("api-key", api_key)
            req.add_header("User-Agent", "AtelierLiuteria-SendinblueClient/1.0")

            with urllib.request.urlopen(req, timeout=20) as resp:
                status_code = resp.getcode()
                resp_raw = resp.read().decode("utf-8", errors="ignore").strip()
                resp_json = {}
                try:
                    resp_json = json.loads(resp_raw) if resp_raw else {}
                except Exception:
                    pass

                msg_id = resp_json.get("messageId") or f"sib-{int(time.time())}"
                now_str = time.strftime("%d/%m/%Y %H:%M")

                with sendinblue_lock:
                    sendinblue_state.setdefault("history", []).insert(0, {
                        "timestamp": now_str,
                        "toEmail": to_email,
                        "toName": to_name,
                        "subject": subject,
                        "messageId": msg_id,
                        "status": f"Inviato (HTTP {status_code})"
                    })
                    sendinblue_state["history"] = sendinblue_state["history"][:40]
                save_sendinblue_state()

                print(f"[Sendinblue] Promemoria inviato con successo a {to_email} (MessageId: {msg_id})", flush=True)
                return {
                    "success": True,
                    "httpStatus": status_code,
                    "messageId": msg_id,
                    "sentAt": now_str,
                    "toEmail": to_email
                }
        except urllib.error.HTTPError as he:
            err_body = ""
            try:
                err_body = he.read().decode("utf-8", errors="ignore").strip()
                err_json = json.loads(err_body)
                err_detail = err_json.get("message") or err_json.get("code") or err_body[:180]
            except Exception:
                err_detail = err_body[:180] or he.reason
            last_err = f"Sendinblue API HTTP {he.code}: {err_detail}"
            break
        except Exception as ex:
            last_err = f"Errore connessione Sendinblue: {str(ex)}"

    return {
        "success": False,
        "code": "SENDINBLUE_API_ERROR",
        "error": last_err or "Impossibile inviare il promemoria tramite Sendinblue."
    }


# ==============================================================================
# AUTO-UPDATER DA GITHUB (BRANCH 'main') & OTA HTTP INSTANT UPDATE (ZERO SSH)
# ==============================================================================
GITHUB_REPO = os.environ.get("GITHUB_REPO", "Delaoren/Gestionale-Liuteria")
GITHUB_BRANCH = os.environ.get("GITHUB_BRANCH", "main")
AUTO_UPDATE_INTERVAL = int(os.environ.get("AUTO_UPDATE_INTERVAL", 120))
LAST_COMMIT_FILE = os.path.join(DIRECTORY, ".last_github_commit")

PROTECTED_REL_PATHS = {
    "auth_state.json",
    "social_state.json",
    "biblioteca_state.json",
    "sendinblue_state.json",
    "mail_state.json",
    ".last_github_commit",
    ".env"
}

# ==============================================================================
# MAIL CLIENT ENGINE (IMAP4 SSL & SMTP SSL per liuteriadelorenzi@gmail.com e info@liuteriadelorenzi.it)
# ==============================================================================
MAIL_STATE_FILE = os.path.join(DIRECTORY, "mail_state.json")
mail_lock = threading.Lock()

DEFAULT_MAIL_MESSAGES = []

mail_state = {
    "accounts": {
        "gmail": {
            "id": "gmail",
            "email": "liuteriadelorenzi@gmail.com",
            "label": "Gmail Bottega",
            "provider": "gmail",
            "enabled": bool(os.environ.get("MAIL_GMAIL_PASSWORD", "")),
            "imapHost": "imap.gmail.com",
            "imapPort": 993,
            "imapSsl": True,
            "smtpHost": "smtp.gmail.com",
            "smtpPort": 465,
            "smtpSsl": True,
            "username": "liuteriadelorenzi@gmail.com",
            "password": os.environ.get("MAIL_GMAIL_PASSWORD", ""),
            "detectForwardedDomain": True,
            "status": "unconfigured",
            "lastSync": "",
            "lastError": ""
        },
        "domain": {
            "id": "domain",
            "email": "info@liuteriadelorenzi.it",
            "label": "Dominio Ufficiale (.it)",
            "provider": "custom_imap",
            "enabled": bool(os.environ.get("MAIL_DOMAIN_PASSWORD", "")),
            "imapHost": os.environ.get("MAIL_DOMAIN_IMAP_HOST", "mail.liuteriadelorenzi.it"),
            "imapPort": int(os.environ.get("MAIL_DOMAIN_IMAP_PORT", "993")),
            "imapSsl": True,
            "smtpHost": os.environ.get("MAIL_DOMAIN_SMTP_HOST", "mail.liuteriadelorenzi.it"),
            "smtpPort": int(os.environ.get("MAIL_DOMAIN_SMTP_PORT", "465")),
            "smtpSsl": True,
            "username": "info@liuteriadelorenzi.it",
            "password": os.environ.get("MAIL_DOMAIN_PASSWORD", ""),
            "forwardedToGmail": False,
            "status": "unconfigured",
            "lastSync": "",
            "lastError": ""
        }
    },
    "messages": [],
    "lastGlobalSync": ""
}

def load_mail_state():
    global mail_state
    with mail_lock:
        if os.path.exists(MAIL_STATE_FILE):
            try:
                with open(MAIL_STATE_FILE, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                if isinstance(loaded, dict):
                    if isinstance(loaded.get("accounts"), dict):
                        for acc_key in ("gmail", "domain"):
                            if isinstance(loaded["accounts"].get(acc_key), dict):
                                mail_state["accounts"][acc_key].update(loaded["accounts"][acc_key])
                    if isinstance(loaded.get("messages"), list):
                        cleaned_msgs = [
                            m for m in loaded["messages"]
                            if isinstance(m, dict) and not str(m.get("id", "")).startswith("mail-init-")
                        ]
                        mail_state["messages"] = cleaned_msgs[:250]
                    if loaded.get("lastGlobalSync"):
                        mail_state["lastGlobalSync"] = loaded["lastGlobalSync"]
            except Exception as e:
                print(f"[MailEngine] Errore caricamento mail_state.json: {e}")

def save_mail_state():
    with mail_lock:
        try:
            with open(MAIL_STATE_FILE, "w", encoding="utf-8") as f:
                json.dump(mail_state, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[MailEngine] Errore salvataggio mail_state.json: {e}")

load_mail_state()

def _decode_mime_words(raw_str):
    if not raw_str:
        return ""
    if isinstance(raw_str, bytes):
        raw_str = raw_str.decode("utf-8", errors="replace")
    try:
        parts = email.header.decode_header(str(raw_str))
        decoded = []
        for content, enc in parts:
            if isinstance(content, bytes):
                charset = enc or "utf-8"
                if charset.lower() in ("unknown-8bit", "x-unknown"):
                    charset = "latin-1"
                try:
                    decoded.append(content.decode(charset, errors="replace"))
                except LookupError:
                    decoded.append(content.decode("utf-8", errors="replace"))
            else:
                decoded.append(str(content))
        return "".join(decoded).strip()
    except Exception:
        return str(raw_str).strip()

def _format_size(num_bytes):
    try:
        n = int(num_bytes)
        if n >= 1024 * 1024:
            return f"{n / (1024 * 1024):.1f} MB"
        if n >= 1024:
            return f"{max(1, round(n / 1024))} KB"
        return f"{n} B"
    except Exception:
        return "0 KB"

def _strip_html_to_text(html_str):
    if not html_str:
        return ""
    txt = re.sub(r"(?is)<(script|style).*?>.*?</\1>", " ", html_str)
    txt = re.sub(r"(?i)<br\s*/?>", "\n", txt)
    txt = re.sub(r"(?i)</p\s*>", "\n\n", txt)
    txt = re.sub(r"<[^>]+>", " ", txt)
    txt = txt.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')
    txt = re.sub(r"[ \t]+", " ", txt)
    txt = re.sub(r"\n{3,}", "\n\n", txt)
    return txt.strip()

def _connect_imap_account(acc_cfg):
    host = (acc_cfg.get("imapHost") or "").strip()
    port = int(acc_cfg.get("imapPort") or 993)
    use_ssl = bool(acc_cfg.get("imapSsl", True))
    username = (acc_cfg.get("username") or acc_cfg.get("email") or "").strip()
    password = (acc_cfg.get("password") or "").replace(" ", "") if acc_cfg.get("provider") == "gmail" else (acc_cfg.get("password") or "").strip()

    if not host or not username or not password:
        raise ValueError("Host IMAP, nome utente o password mancanti.")

    # Se è l'account info@liuteriadelorenzi.it e l'host è dietro proxy Cloudflare, prova in cascata gli host IMAP più comuni
    candidate_hosts = [host]
    if acc_cfg.get("id") == "domain":
        for fallback_h in ("imaps.aruba.it", "mail.liuteriadelorenzi.it", "imap.liuteriadelorenzi.it", "imap.register.it", "ssl0.ovh.net"):
            if fallback_h not in candidate_hosts:
                candidate_hosts.append(fallback_h)

    ctx = ssl.create_default_context()
    last_err = None
    for h in candidate_hosts:
        try:
            if use_ssl or port == 993:
                conn = imaplib.IMAP4_SSL(h, port, ssl_context=ctx, timeout=12)
            else:
                conn = imaplib.IMAP4(h, port, timeout=12)
                try:
                    conn.starttls(ssl_context=ctx)
                except Exception:
                    pass
            conn.login(username, password)
            if h != host:
                acc_cfg["imapHost"] = h
            return conn
        except imaplib.IMAP4.error as auth_err:
            # Se il server ha risposto ma le credenziali sono errate, fermati subito e segnala l'errore di autenticazione
            err_txt = str(auth_err)
            if "AUTHENTICATIONFAILED" in err_txt.upper() or "APPLICATION-SPECIFIC" in err_txt.upper() or "INVALID CREDENTIALS" in err_txt.upper():
                if acc_cfg.get("provider") == "gmail":
                    raise RuntimeError("Autenticazione Gmail rifiutata: per leggere Gmail via IMAP è necessaria una 'Password per le App' di Google (16 caratteri) generata su myaccount.google.com/apppasswords.")
                raise RuntimeError(f"Credenziali rifiutate dal server {h}: verifica la password di {username} ({err_txt}).")
            last_err = auth_err
        except Exception as e:
            last_err = e

    raise RuntimeError(f"Impossibile connettersi al server IMAP ({host}:{port}): {last_err}")

def sync_imap_account(acc_id, limit=30):
    acc_cfg = mail_state["accounts"].get(acc_id)
    if not acc_cfg:
        return {"success": False, "error": f"Account '{acc_id}' non trovato."}

    if acc_id == "domain" and acc_cfg.get("forwardedToGmail"):
        # Se info@liuteriadelorenzi.it è inoltrato su liuteriadelorenzi@gmail.com, sincronizza Gmail
        return sync_imap_account("gmail", limit=limit)

    password = (acc_cfg.get("password") or "").strip()
    if not password:
        return {
            "success": False,
            "code": "MISSING_CREDENTIALS",
            "error": f"Password IMAP non ancora inserita per {acc_cfg.get('email')}. Clicca su 'Configura Account' per inserire la password."
        }

    try:
        conn = _connect_imap_account(acc_cfg)
        status, _ = conn.select("INBOX", readonly=True)
        if status != "OK":
            conn.logout()
            raise RuntimeError("Impossibile selezionare la cartella INBOX.")

        typ, data = conn.uid("search", None, "ALL")
        if typ != "OK" or not data or not data[0]:
            uids = []
        else:
            uids = data[0].split()

        recent_uids = uids[-limit:] if len(uids) > limit else uids
        recent_uids = list(reversed(recent_uids))

        fetched_messages = []
        for uid_bytes in recent_uids:
            uid_str = uid_bytes.decode("ascii", errors="ignore")
            typ, msg_data = conn.uid("fetch", uid_bytes, "(BODY.PEEK[] FLAGS)")
            if typ != "OK" or not msg_data:
                continue

            raw_email = None
            flags_str = ""
            for item in msg_data:
                if isinstance(item, tuple) and len(item) >= 2:
                    header_info = item[0].decode("ascii", errors="ignore") if isinstance(item[0], bytes) else str(item[0])
                    flags_str = header_info
                    raw_email = item[1]
                    break

            if not raw_email:
                continue

            msg = email.message_from_bytes(raw_email)
            subject = _decode_mime_words(msg.get("Subject")) or "(Nessun oggetto)"
            from_raw = _decode_mime_words(msg.get("From"))
            to_raw = _decode_mime_words(msg.get("To"))
            cc_raw = _decode_mime_words(msg.get("Cc"))
            delivered_to = _decode_mime_words(msg.get("Delivered-To")) + " " + _decode_mime_words(msg.get("X-Original-To"))

            from_name, from_addr = email.utils.parseaddr(from_raw)
            from_name = _decode_mime_words(from_name) or from_addr or "Mittente"
            from_addr = from_addr or from_raw

            date_hdr = msg.get("Date")
            date_iso = time.strftime("%Y-%m-%dT%H:%M:%S")
            date_fmt = time.strftime("%d/%m/%Y %H:%M")
            if date_hdr:
                try:
                    dt = email.utils.parsedate_to_datetime(date_hdr)
                    if dt:
                        date_iso = dt.strftime("%Y-%m-%dT%H:%M:%S")
                        date_fmt = dt.strftime("%d/%m/%Y %H:%M")
                except Exception:
                    pass

            body_text = ""
            body_html = ""
            attachments = []

            if msg.is_multipart():
                for part in msg.walk():
                    ctype = part.get_content_type()
                    cdisp = str(part.get("Content-Disposition") or "")
                    filename = part.get_filename()
                    if filename:
                        filename = _decode_mime_words(filename)

                    if filename or "attachment" in cdisp.lower():
                        payload_bytes = part.get_payload(decode=True) or b""
                        att_obj = {
                            "filename": filename or "allegato.bin",
                            "contentType": ctype or "application/octet-stream",
                            "sizeBytes": len(payload_bytes),
                            "sizeFormatted": _format_size(len(payload_bytes))
                        }
                        if 0 < len(payload_bytes) <= 2 * 1024 * 1024:
                            att_obj["dataBase64"] = base64.b64encode(payload_bytes).decode("ascii")
                        attachments.append(att_obj)
                    elif ctype == "text/plain" and not body_text:
                        payload_bytes = part.get_payload(decode=True) or b""
                        charset = part.get_content_charset() or "utf-8"
                        try:
                            body_text = payload_bytes.decode(charset, errors="replace")
                        except LookupError:
                            body_text = payload_bytes.decode("utf-8", errors="replace")
                    elif ctype == "text/html" and not body_html:
                        payload_bytes = part.get_payload(decode=True) or b""
                        charset = part.get_content_charset() or "utf-8"
                        try:
                            body_html = payload_bytes.decode(charset, errors="replace")
                        except LookupError:
                            body_html = payload_bytes.decode("utf-8", errors="replace")
            else:
                ctype = msg.get_content_type()
                payload_bytes = msg.get_payload(decode=True) or b""
                charset = msg.get_content_charset() or "utf-8"
                try:
                    decoded_payload = payload_bytes.decode(charset, errors="replace")
                except LookupError:
                    decoded_payload = payload_bytes.decode("utf-8", errors="replace")
                if ctype == "text/html":
                    body_html = decoded_payload
                else:
                    body_text = decoded_payload

            if not body_text and body_html:
                body_text = _strip_html_to_text(body_html)

            snippet = re.sub(r"\s+", " ", (body_text or "")).strip()[:165]
            is_read = ("\\Seen" in flags_str)
            is_starred = ("\\Flagged" in flags_str)

            # Rileva automaticamente se un'email scaricata da Gmail era indirizzata a info@liuteriadelorenzi.it
            target_acc_id = acc_id
            target_acc_email = acc_cfg.get("email")
            combined_rcpt = f"{to_raw} {cc_raw} {delivered_to}".lower()
            if acc_id == "gmail" and acc_cfg.get("detectForwardedDomain", True) and "info@liuteriadelorenzi.it" in combined_rcpt:
                target_acc_id = "domain"
                target_acc_email = "info@liuteriadelorenzi.it"

            msg_id = f"imap-{acc_id}-{uid_str}"
            fetched_messages.append({
                "id": msg_id,
                "uid": uid_str,
                "accountId": target_acc_id,
                "accountEmail": target_acc_email,
                "folder": "INBOX",
                "fromName": from_name,
                "fromEmail": from_addr,
                "toEmail": to_raw or target_acc_email,
                "subject": subject,
                "dateIso": date_iso,
                "dateFormatted": date_fmt,
                "snippet": snippet,
                "bodyText": body_text,
                "bodyHtml": body_html,
                "read": is_read,
                "starred": is_starred,
                "attachments": attachments
            })

        try:
            conn.logout()
        except Exception:
            pass

        now_fmt = time.strftime("%d/%m/%Y %H:%M:%S")
        with mail_lock:
            acc_cfg["status"] = "connected"
            acc_cfg["enabled"] = True
            acc_cfg["lastSync"] = now_fmt
            acc_cfg["lastError"] = ""
            if acc_id == "gmail" and mail_state["accounts"]["domain"].get("forwardedToGmail"):
                mail_state["accounts"]["domain"]["status"] = "connected"
                mail_state["accounts"]["domain"]["lastSync"] = f"{now_fmt} (via inoltro Gmail)"
                mail_state["accounts"]["domain"]["lastError"] = ""

            existing_by_id = {
                m.get("id"): m
                for m in mail_state.get("messages", [])
                if isinstance(m, dict) and not str(m.get("id", "")).startswith("mail-init-")
            }
            for fm in fetched_messages:
                old_m = existing_by_id.get(fm["id"])
                if old_m:
                    fm["read"] = old_m.get("read", fm["read"])
                    fm["starred"] = old_m.get("starred", fm["starred"])
                    fm["folder"] = old_m.get("folder", fm["folder"])
                existing_by_id[fm["id"]] = fm

            merged_list = list(existing_by_id.values())
            merged_list.sort(key=lambda x: x.get("dateIso") or "", reverse=True)
            mail_state["messages"] = merged_list[:250]
            mail_state["lastGlobalSync"] = now_fmt

        save_mail_state()
        return {
            "success": True,
            "accountId": acc_id,
            "fetchedCount": len(fetched_messages),
            "lastSync": now_fmt
        }
    except Exception as e:
        err_msg = str(e)
        with mail_lock:
            acc_cfg["status"] = "error"
            acc_cfg["lastError"] = err_msg
        save_mail_state()
        return {
            "success": False,
            "accountId": acc_id,
            "error": err_msg
        }

def send_mail_from_account(req_payload):
    acc_id = (req_payload.get("accountId") or "gmail").strip()
    if acc_id not in mail_state["accounts"]:
        acc_id = "gmail"
    acc_cfg = mail_state["accounts"][acc_id]
    from_email = acc_cfg.get("email")
    from_name = f"Liuteria De Lorenzi ({from_email})"

    to_email = (req_payload.get("toEmail") or "").strip()
    subject = (req_payload.get("subject") or "").strip() or "(Nessun oggetto)"
    body_text = (req_payload.get("bodyText") or "").strip()

    if not to_email or "@" not in to_email:
        return {"success": False, "error": "Inserisci un indirizzo email destinatario valido."}

    # Se l'account domain usa l'inoltro su Gmail e non ha password propria, invia tramite SMTP di Gmail con Reply-To info@liuteriadelorenzi.it
    smtp_cfg = acc_cfg
    if acc_id == "domain" and not (acc_cfg.get("password") or "").strip() and (mail_state["accounts"]["gmail"].get("password") or "").strip():
        smtp_cfg = mail_state["accounts"]["gmail"]

    smtp_host = (smtp_cfg.get("smtpHost") or "").strip()
    smtp_port = int(smtp_cfg.get("smtpPort") or 465)
    smtp_user = (smtp_cfg.get("username") or smtp_cfg.get("email") or "").strip()
    smtp_pass = (smtp_cfg.get("password") or "").replace(" ", "") if smtp_cfg.get("provider") == "gmail" else (smtp_cfg.get("password") or "").strip()

    sent_method = None
    last_err = None

    # 1. Prova invio diretto tramite SMTP dell'account configurato
    if smtp_host and smtp_user and smtp_pass:
        try:
            mime_msg = MIMEMultipart("alternative")
            mime_msg["From"] = f"{from_name} <{from_email}>"
            mime_msg["To"] = to_email
            mime_msg["Reply-To"] = from_email
            mime_msg["Subject"] = subject
            mime_msg["Date"] = email.utils.formatdate(localtime=True)
            mime_msg.attach(MIMEText(body_text, "plain", "utf-8"))
            html_ver = f"<div style='font-family:Georgia,serif;color:#1f2937;line-height:1.6;'>{body_text.replace(chr(10), '<br>')}</div>"
            mime_msg.attach(MIMEText(html_ver, "html", "utf-8"))

            ctx = ssl.create_default_context()
            if smtp_port == 465 or smtp_cfg.get("smtpSsl", True):
                with smtplib.SMTP_SSL(smtp_host, smtp_port, context=ctx, timeout=15) as server:
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [to_email], mime_msg.as_string())
            else:
                with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
                    server.starttls(context=ctx)
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [to_email], mime_msg.as_string())
            sent_method = f"SMTP ({smtp_host})"
        except Exception as e:
            last_err = str(e)

    # 2. Fallback automatico tramite Sendinblue/Brevo se configurato nel Gestionale
    if not sent_method and (sendinblue_state.get("config", {}).get("apiKey") or "").strip():
        sib_res = dispatch_sendinblue_reminder({
            "toEmail": to_email,
            "toName": to_email.split("@")[0],
            "subject": subject,
            "textContent": body_text
        }, config_override={
            "senderName": f"Liuteria De Lorenzi ({from_email})",
            "replyToEmail": from_email
        })
        if sib_res.get("success"):
            sent_method = "Sendinblue/Brevo Transactional"
        else:
            last_err = sib_res.get("error")

    now_iso = time.strftime("%Y-%m-%dT%H:%M:%S")
    now_fmt = time.strftime("%d/%m/%Y %H:%M")
    sent_msg = {
        "id": f"sent-{int(time.time() * 1000)}",
        "uid": f"sent-{int(time.time())}",
        "accountId": acc_id,
        "accountEmail": from_email,
        "folder": "SENT",
        "fromName": "Liuteria De Lorenzi",
        "fromEmail": from_email,
        "toEmail": to_email,
        "subject": subject,
        "dateIso": now_iso,
        "dateFormatted": now_fmt,
        "snippet": body_text[:160].replace("\n", " "),
        "bodyText": body_text,
        "bodyHtml": "",
        "read": True,
        "starred": False,
        "attachments": [],
        "deliveryMethod": sent_method or "Salellato in Posta Inviata (Locale)"
    }

    with mail_lock:
        mail_state.setdefault("messages", []).insert(0, sent_msg)
    save_mail_state()

    if sent_method:
        return {
            "success": True,
            "method": sent_method,
            "message": sent_msg
        }
    else:
        return {
            "success": True,
            "localOnly": True,
            "warning": last_err or "Credenziali SMTP non ancora configurate: l'email è stata registrata in 'Posta Inviata'. Configura la password dell'account per l'invio SMTP reale.",
            "message": sent_msg
        }

def get_sanitized_mail_accounts():
    out = {}
    for k, acc in mail_state.get("accounts", {}).items():
        c = dict(acc)
        has_pw = bool((c.get("password") or "").strip())
        c["hasPassword"] = has_pw
        c["password"] = ""  # Non esporre in chiaro la password via GET
        out[k] = c
    return out
PROTECTED_DIRS = {
    "social_uploads",
    "biblioteca_uploads",
    "media_uploads",
    "certificati_uploads",
    ".venv",
    "venv",
    "env",
    ".git",
    "__pycache__"
}

httpd_server_instance = None
update_lock = threading.Lock()

def _read_current_local_commit():
    # 1. Prova da git rev-parse HEAD
    git_dir = os.path.join(DIRECTORY, ".git")
    if os.path.isdir(git_dir):
        try:
            res = subprocess.run(
                ["git", "-C", DIRECTORY, "rev-parse", "HEAD"],
                capture_output=True, text=True, timeout=5
            )
            if res.returncode == 0 and res.stdout.strip():
                sha = res.stdout.strip()
                try:
                    with open(LAST_COMMIT_FILE, "w", encoding="utf-8") as f:
                        f.write(sha)
                except Exception:
                    pass
                return sha
        except Exception:
            pass

    # 2. Fallback da file .last_github_commit
    if os.path.isfile(LAST_COMMIT_FILE):
        try:
            with open(LAST_COMMIT_FILE, "r", encoding="utf-8") as f:
                return f.read().strip()
        except Exception:
            pass
    return ""

update_state = {
    "repo": GITHUB_REPO,
    "branch": GITHUB_BRANCH,
    "autoUpdateEnabled": True,
    "intervalSeconds": AUTO_UPDATE_INTERVAL,
    "currentCommit": _read_current_local_commit(),
    "lastCheckTime": "",
    "lastUpdateTime": "",
    "status": "ready",
    "lastMessage": f"Auto-update attivo su branch '{GITHUB_BRANCH}' (controllo ogni {AUTO_UPDATE_INTERVAL}s) + OTA HTTP attivo",
    "history": []
}

def _file_sha256(filepath):
    if not os.path.isfile(filepath):
        return ""
    h = hashlib.sha256()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                h.update(chunk)
        return h.hexdigest()
    except Exception:
        return ""

def schedule_server_restart(reason="Aggiornamento server.py"):
    """Riavvia automaticamente il processo Python dopo aver completato la risposta HTTP"""
    def _restart_worker():
        print(f"[AutoUpdater] Riavvio automatico del server tra 1.2s ({reason})...", flush=True)
        time.sleep(1.2)
        global httpd_server_instance
        if httpd_server_instance:
            try:
                httpd_server_instance.server_close()
            except Exception:
                pass
        try:
            os.execv(sys.executable, [sys.executable] + sys.argv)
        except Exception as e:
            print(f"[AutoUpdater] Fallback exit per riavvio systemd: {e}", flush=True)
            os._exit(0)

    t = threading.Thread(target=_restart_worker, daemon=True)
    t.start()

def check_and_apply_github_update(force=False):
    """
    Controlla il branch 'main' su GitHub (Delaoren/Gestionale-Liuteria).
    Funziona sia tramite 'git fetch/reset' (se .git è presente), sia tramite
    GitHub REST API + Tarball download (se installato senza .git).
    """
    with update_lock:
        now_str = time.strftime("%Y-%m-%d %H:%M:%S")
        update_state["lastCheckTime"] = now_str
        server_py_path = os.path.join(DIRECTORY, "server.py")
        old_server_hash = _file_sha256(server_py_path)

        # 1. Tenta prima via Git CLI se .git esiste
        git_dir = os.path.join(DIRECTORY, ".git")
        if os.path.isdir(git_dir):
            try:
                fetch_res = subprocess.run(
                    ["git", "-C", DIRECTORY, "fetch", "origin", GITHUB_BRANCH, "--quiet"],
                    capture_output=True, text=True, timeout=20
                )
                if fetch_res.returncode == 0:
                    local_res = subprocess.run(
                        ["git", "-C", DIRECTORY, "rev-parse", "HEAD"],
                        capture_output=True, text=True, timeout=5
                    )
                    remote_res = subprocess.run(
                        ["git", "-C", DIRECTORY, "rev-parse", f"origin/{GITHUB_BRANCH}"],
                        capture_output=True, text=True, timeout=5
                    )
                    local_sha = local_res.stdout.strip()
                    remote_sha = remote_res.stdout.strip()

                    if remote_sha and (local_sha != remote_sha or force):
                        diff_res = subprocess.run(
                            ["git", "-C", DIRECTORY, "diff", "--name-only", "HEAD", f"origin/{GITHUB_BRANCH}"],
                            capture_output=True, text=True, timeout=10
                        )
                        changed_files = [line.strip() for line in diff_res.stdout.splitlines() if line.strip()]

                        reset_res = subprocess.run(
                            ["git", "-C", DIRECTORY, "reset", "--hard", f"origin/{GITHUB_BRANCH}"],
                            capture_output=True, text=True, timeout=15
                        )
                        if reset_res.returncode == 0:
                            update_state["currentCommit"] = remote_sha
                            update_state["lastUpdateTime"] = now_str
                            update_state["status"] = "updated"
                            msg = f"Aggiornato da GitHub ({GITHUB_BRANCH} @ {remote_sha[:7]}) - {len(changed_files)} file aggiornati"
                            update_state["lastMessage"] = msg
                            try:
                                with open(LAST_COMMIT_FILE, "w", encoding="utf-8") as f:
                                    f.write(remote_sha)
                            except Exception:
                                pass

                            new_server_hash = _file_sha256(server_py_path)
                            restarting = (old_server_hash != new_server_hash)
                            update_state.setdefault("history", []).insert(0, {
                                "timestamp": now_str,
                                "source": f"GitHub ({GITHUB_BRANCH})",
                                "commit": remote_sha[:7],
                                "filesCount": len(changed_files),
                                "restarted": restarting
                            })
                            update_state["history"] = update_state["history"][:25]
                            print(f"[AutoUpdater] {msg}", flush=True)
                            if restarting:
                                schedule_server_restart(f"GitHub commit {remote_sha[:7]}")
                            return {
                                "success": True,
                                "updated": True,
                                "commit": remote_sha,
                                "changedFiles": changed_files,
                                "restarting": restarting,
                                "message": msg
                            }
                    else:
                        update_state["currentCommit"] = local_sha or remote_sha
                        update_state["status"] = "up_to_date"
                        update_state["lastMessage"] = f"Server allineato a GitHub ({GITHUB_BRANCH} @ {(local_sha or '')[:7]})"
                        return {
                            "success": True,
                            "updated": False,
                            "commit": local_sha,
                            "message": update_state["lastMessage"]
                        }
            except Exception as git_err:
                print(f"[AutoUpdater] Git CLI fallback su HTTPS API ({git_err})", flush=True)

        # 2. Modalità GitHub API + Tarball HTTPS (funziona anche senza .git installato!)
        try:
            api_url = f"https://api.github.com/repos/{GITHUB_REPO}/commits/{GITHUB_BRANCH}"
            req = urllib.request.Request(api_url)
            req.add_header("User-Agent", "AtelierLiuteria-AutoUpdater/2.0")
            req.add_header("Accept", "application/vnd.github.v3+json")

            with urllib.request.urlopen(req, timeout=15) as resp:
                commit_info = json.loads(resp.read().decode("utf-8"))
                remote_sha = (commit_info.get("sha") or "").strip()
                commit_msg = ((commit_info.get("commit") or {}).get("message") or "").splitlines()[0]

            local_sha = update_state.get("currentCommit") or _read_current_local_commit()
            if not remote_sha:
                return {"success": False, "error": "Impossibile leggere lo SHA dal branch main di GitHub"}

            if remote_sha == local_sha and not force:
                update_state["status"] = "up_to_date"
                update_state["lastMessage"] = f"Server allineato a GitHub ({GITHUB_BRANCH} @ {remote_sha[:7]})"
                return {
                    "success": True,
                    "updated": False,
                    "commit": remote_sha,
                    "message": update_state["lastMessage"]
                }

            # Scarica ed estrai il tarball del branch 'main'
            tar_url = f"https://codeload.github.com/{GITHUB_REPO}/tar.gz/refs/heads/{GITHUB_BRANCH}"
            t_req = urllib.request.Request(tar_url)
            t_req.add_header("User-Agent", "AtelierLiuteria-AutoUpdater/2.0")

            with urllib.request.urlopen(t_req, timeout=30) as t_resp:
                tar_bytes = t_resp.read()

            updated_files = []
            with tarfile.open(fileobj=io.BytesIO(tar_bytes), mode="r:gz") as tar:
                for member in tar.getmembers():
                    if not member.isfile():
                        continue
                    # Rimuovi la cartella radice del tarball (es. Gestionale-Liuteria-main/...)
                    parts = member.name.split("/", 1)
                    if len(parts) < 2 or not parts[1]:
                        continue
                    rel_path = parts[1].strip("/")
                    top_dir = rel_path.split("/")[0]

                    if rel_path in PROTECTED_REL_PATHS or top_dir in PROTECTED_DIRS or ".." in rel_path:
                        continue

                    dest_path = os.path.join(DIRECTORY, rel_path.replace("/", os.sep))
                    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                    extracted_f = tar.extractfile(member)
                    if extracted_f is None:
                        continue
                    new_bytes = extracted_f.read()
                    new_hash = hashlib.sha256(new_bytes).hexdigest()
                    old_hash = _file_sha256(dest_path)

                    if new_hash != old_hash:
                        with open(dest_path, "wb") as out_f:
                            out_f.write(new_bytes)
                        updated_files.append(rel_path)

            try:
                with open(LAST_COMMIT_FILE, "w", encoding="utf-8") as f:
                    f.write(remote_sha)
            except Exception:
                pass

            update_state["currentCommit"] = remote_sha
            update_state["lastUpdateTime"] = now_str
            update_state["status"] = "updated"
            msg = f"Aggiornato da GitHub ({GITHUB_BRANCH} @ {remote_sha[:7]}: '{commit_msg[:45]}') - {len(updated_files)} file modificati"
            update_state["lastMessage"] = msg

            new_server_hash = _file_sha256(server_py_path)
            restarting = (old_server_hash != new_server_hash)
            update_state.setdefault("history", []).insert(0, {
                "timestamp": now_str,
                "source": f"GitHub Tarball ({GITHUB_BRANCH})",
                "commit": remote_sha[:7],
                "filesCount": len(updated_files),
                "restarted": restarting
            })
            update_state["history"] = update_state["history"][:25]
            print(f"[AutoUpdater] {msg}", flush=True)

            if restarting:
                schedule_server_restart(f"GitHub tarball {remote_sha[:7]}")

            return {
                "success": True,
                "updated": len(updated_files) > 0,
                "commit": remote_sha,
                "changedFiles": updated_files,
                "restarting": restarting,
                "message": msg
            }
        except Exception as e:
            err_msg = f"Errore controllo GitHub ({GITHUB_BRANCH}): {str(e)}"
            update_state["status"] = "error"
            update_state["lastMessage"] = err_msg
            return {"success": False, "error": err_msg}

def apply_ota_http_update(files_payload, commit_sha="", source_label="OTA HTTP (PC Windows)"):
    """
    Applica un aggiornamento diretto via HTTP (senza SSH e senza password).
    Scrive solo i file effettivamente modificati e riavvia server.py se necessario.
    """
    with update_lock:
        if not isinstance(files_payload, list):
            return {"success": False, "error": "Formato files non valido"}

        now_str = time.strftime("%Y-%m-%d %H:%M:%S")
        server_py_path = os.path.join(DIRECTORY, "server.py")
        old_server_hash = _file_sha256(server_py_path)
        updated_files = []

        for item in files_payload:
            if not isinstance(item, dict):
                continue
            rel_path = (item.get("path") or "").replace("\\", "/").lstrip("./").lstrip("/")
            if not rel_path or ".." in rel_path:
                continue
            top_dir = rel_path.split("/")[0]
            if rel_path in PROTECTED_REL_PATHS or top_dir in PROTECTED_DIRS:
                continue

            b64_data = item.get("contentBase64")
            raw_text = item.get("content")
            if b64_data is not None:
                try:
                    file_bytes = base64.b64decode(b64_data)
                except Exception:
                    continue
            elif raw_text is not None:
                file_bytes = raw_text.encode("utf-8")
            else:
                continue

            dest_path = os.path.join(DIRECTORY, rel_path.replace("/", os.sep))
            new_hash = hashlib.sha256(file_bytes).hexdigest()
            old_hash = _file_sha256(dest_path)

            if new_hash != old_hash:
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with open(dest_path, "wb") as f:
                    f.write(file_bytes)
                updated_files.append(rel_path)

        if commit_sha:
            update_state["currentCommit"] = commit_sha
            try:
                with open(LAST_COMMIT_FILE, "w", encoding="utf-8") as f:
                    f.write(commit_sha)
            except Exception:
                pass

        new_server_hash = _file_sha256(server_py_path)
        restarting = (old_server_hash != new_server_hash)

        update_state["lastCheckTime"] = now_str
        if updated_files:
            update_state["lastUpdateTime"] = now_str
            update_state["status"] = "updated"
            update_state["lastMessage"] = f"Aggiornamento OTA applicato ({len(updated_files)} file modificati da {source_label})"
            update_state.setdefault("history", []).insert(0, {
                "timestamp": now_str,
                "source": source_label,
                "commit": (commit_sha or update_state.get("currentCommit") or "locale")[:7],
                "filesCount": len(updated_files),
                "restarted": restarting
            })
            update_state["history"] = update_state["history"][:25]
            print(f"[OTA Update] Aggiornati {len(updated_files)} file: {', '.join(updated_files)}", flush=True)

        if restarting:
            schedule_server_restart("OTA HTTP update di server.py")

        return {
            "success": True,
            "updated": len(updated_files) > 0,
            "updatedFiles": updated_files,
            "restarting": restarting,
            "message": f"{len(updated_files)} file aggiornati sul server" if updated_files else "Tutti i file sul server sono già identici (nessuna modifica necessaria)"
        }

class GitHubAutoUpdaterThread(threading.Thread):
    """Controlla automaticamente il branch 'main' su GitHub ogni AUTO_UPDATE_INTERVAL secondi"""
    def __init__(self, interval=AUTO_UPDATE_INTERVAL):
        super().__init__(daemon=True)
        self.interval = max(30, interval)
        self.running = True

    def run(self):
        print(f"[AutoUpdater] Monitoraggio automatico GitHub ({GITHUB_REPO} @ branch '{GITHUB_BRANCH}') ogni {self.interval}s...", flush=True)
        # Primo controllo dopo 10 secondi dall'avvio
        time.sleep(10)
        while self.running:
            try:
                if update_state.get("autoUpdateEnabled", True):
                    check_and_apply_github_update(force=False)
            except Exception as e:
                print(f"[AutoUpdater] Eccezione controllo GitHub: {e}", flush=True)
            time.sleep(self.interval)

class LutherieHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def _is_origin_allowed(self, origin):
        if not origin:
            return False
        try:
            parsed = urllib.parse.urlparse(origin)
            host = (parsed.hostname or "").lower()
            if host in ("gestionale.liuteriadelorenzi.it", "liuteriadelorenzi.it", "www.liuteriadelorenzi.it", "localhost", "127.0.0.1"):
                return True
            if host.startswith(("192.168.", "10.", "100.")) or host.endswith((".ts.net", ".local")):
                return True
        except Exception:
            pass
        return False

    def _is_local_lan_client(self):
        ip = (self.client_address[0] if self.client_address else "") or ""
        return ip in ("127.0.0.1", "::1") or ip.startswith(("192.168.", "10.", "100.", "172."))

    def _extract_session_token(self):
        auth_hdr = self.headers.get("Authorization", "")
        if auth_hdr.startswith("Bearer "):
            return auth_hdr[7:].strip()
        cookie_hdr = self.headers.get("Cookie", "")
        if cookie_hdr:
            c = http.cookies.SimpleCookie()
            try:
                c.load(cookie_hdr)
                if "atelier_session" in c:
                    return c["atelier_session"].value
            except Exception:
                pass
        return ""

    def _is_request_authenticated(self):
        tok = self._extract_session_token()
        return _verify_session_token(tok) is not None

    def _send_unauthorized(self):
        self.send_response(401)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"success": False, "error": "Autenticazione richiesta"}).encode('utf-8'))

    def end_headers(self):
        origin = self.headers.get('Origin', '')
        if self._is_origin_allowed(origin):
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.send_header('Vary', 'Origin')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Media-Id, X-Media-Name, X-Media-Mime, X-Book-Id, X-Book-Name, X-Book-Mime')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_DELETE(self):
        if not self._is_request_authenticated():
            self._send_unauthorized()
            return
        clean_path = self.path.split('?')[0]
        if clean_path.startswith('/api/db/'):
            parts = [p for p in clean_path[len('/api/db/'):].split('/') if p]
            if len(parts) == 2:
                collection, item_id = urllib.parse.unquote(parts[0]), urllib.parse.unquote(parts[1])
                ok = mongo_delete_item(collection, item_id)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "mongo": ok}).encode('utf-8'))
                return
        self.send_response(404)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/api/auth/session'):
            self.handle_auth_session()
            return
        if self.path.startswith('/api/') and not self.path.startswith('/api/telemetry') and not (self.path.startswith('/api/system/') and self._is_local_lan_client()):
            if not self._is_request_authenticated():
                self._send_unauthorized()
                return
        if self.path.startswith('/api/telemetry'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(telemetry_data).encode('utf-8'))
        elif self.path.startswith('/api/mqtt/topics'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "broker": telemetry_data["broker"],
                "status": telemetry_data["status"],
                "topics": telemetry_data["recent_topics"],
                "custom_topic": telemetry_data["custom_topic"]
            }).encode('utf-8'))
        elif self.path.startswith('/api/social/status'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "config": social_state.get("config", {}),
                "posts": social_state.get("posts", []),
                "history": social_state.get("history", [])[:20],
                "serverTime": time.strftime("%Y-%m-%dT%H:%M:%S")
            }, ensure_ascii=False).encode('utf-8'))
        elif self.path.startswith('/api/system/update-status'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "update": update_state
            }, ensure_ascii=False).encode('utf-8'))
        elif self.path.startswith('/api/sendinblue/status'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "config": sendinblue_state.get("config", {}),
                "history": sendinblue_state.get("history", [])[:20]
            }, ensure_ascii=False).encode('utf-8'))
        elif self.path.startswith('/api/db/status'):
            self.handle_db_status()
        elif self.path.startswith('/api/db/all'):
            self.handle_db_all()
        elif self.path.startswith('/api/biblioteca/state'):
            self.handle_biblioteca_get_state()
        elif self.path.startswith('/api/biblioteca/file/'):
            self.handle_storage_get_file('/api/biblioteca/file/', 'biblioteca', BIBLIOTECA_UPLOADS_DIR)
        elif self.path.startswith('/api/media/file/'):
            self.handle_storage_get_file('/api/media/file/', 'media', MEDIA_UPLOADS_DIR)
        elif self.path.startswith('/api/social/file/'):
            self.handle_storage_get_file('/api/social/file/', 'social', SOCIAL_UPLOADS_DIR)
        elif self.path.startswith('/api/certificati/file/'):
            self.handle_storage_get_file('/api/certificati/file/', 'certificati', CERTIFICATI_UPLOADS_DIR)
        elif self.path.startswith('/api/mail/status'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "accounts": get_sanitized_mail_accounts(),
                "messages": mail_state.get("messages", []),
                "lastGlobalSync": mail_state.get("lastGlobalSync", "")
            }, ensure_ascii=False).encode('utf-8'))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/auth/login'):
            self.handle_auth_login()
            return
        if self.path.startswith('/api/auth/logout'):
            self.handle_auth_logout()
            return
        if self.path.startswith('/api/') and not (self.path.startswith('/api/system/') and self._is_local_lan_client()):
            if not self._is_request_authenticated():
                self._send_unauthorized()
                return
        if self.path.startswith('/api/auth/change-password'):
            self.handle_auth_change_password()
            return
        if self.path.startswith('/api/ha-proxy'):
            self.handle_ha_proxy()
        elif self.path.startswith('/api/mqtt/test-publish'):
            self.handle_mqtt_test_publish()
        elif self.path.startswith('/api/mqtt/config'):
            self.handle_mqtt_config()
        elif self.path.startswith('/api/social/config'):
            self.handle_social_config()
        elif self.path.startswith('/api/social/sync-posts'):
            self.handle_social_sync_posts()
        elif self.path.startswith('/api/social/upload-media'):
            self.handle_social_upload_media()
        elif self.path.startswith('/api/social/publish'):
            self.handle_social_publish()
        elif self.path.startswith('/api/db/'):
            self.handle_db_post()
        elif self.path.startswith('/api/biblioteca/upload-file'):
            self.handle_biblioteca_upload_file()
        elif self.path.startswith('/api/biblioteca/sync'):
            self.handle_biblioteca_sync()
        elif self.path.startswith('/api/media/upload-file'):
            self.handle_media_upload_file()
        elif self.path.startswith('/api/certificati/upload-file'):
            self.handle_certificati_upload_file()
        elif self.path.startswith('/api/sendinblue/config'):
            self.handle_sendinblue_config()
        elif self.path.startswith('/api/sendinblue/send-reminder'):
            self.handle_sendinblue_send_reminder()
        elif self.path.startswith('/api/mail/config'):
            self.handle_mail_config()
        elif self.path.startswith('/api/mail/sync'):
            self.handle_mail_sync()
        elif self.path.startswith('/api/mail/send'):
            self.handle_mail_send()
        elif self.path.startswith('/api/mail/action'):
            self.handle_mail_action()
        elif self.path.startswith('/api/system/check-update'):
            self.handle_system_check_update()
        elif self.path.startswith('/api/system/ota-update'):
            self.handle_system_ota_update()
        else:
            self.send_error(404, "Endpoint non trovato")

    def handle_mail_config(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            test_acc = req_data.get("testAccount")
            accounts_in = req_data.get("accounts") if isinstance(req_data.get("accounts"), dict) else {}

            with mail_lock:
                for acc_id in ("gmail", "domain"):
                    if isinstance(accounts_in.get(acc_id), dict):
                        incoming = dict(accounts_in[acc_id])
                        # Non sovrascrivere la password salvata se il campo arriva vuoto (e non è un reset esplicito)
                        if not incoming.get("password") and not incoming.get("clearPassword"):
                            incoming.pop("password", None)
                        incoming.pop("clearPassword", None)
                        incoming.pop("hasPassword", None)
                        mail_state["accounts"][acc_id].update(incoming)
                        mail_state["accounts"][acc_id]["enabled"] = bool(
                            (mail_state["accounts"][acc_id].get("password") or "").strip() or
                            mail_state["accounts"][acc_id].get("forwardedToGmail")
                        )
            save_mail_state()

            sync_res = None
            if test_acc in ("gmail", "domain"):
                sync_res = sync_imap_account(test_acc, limit=25)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True if not sync_res else sync_res.get("success", False),
                "syncResult": sync_res,
                "accounts": get_sanitized_mail_accounts(),
                "messages": mail_state.get("messages", []),
                "lastGlobalSync": mail_state.get("lastGlobalSync", "")
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_mail_sync(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8')) if post_data else {}
            target_acc = req_data.get("accountId", "all")
            limit = int(req_data.get("limit", 30))

            results = {}
            if target_acc in ("gmail", "domain"):
                results[target_acc] = sync_imap_account(target_acc, limit=limit)
            else:
                for acc_id in ("gmail", "domain"):
                    acc_cfg = mail_state["accounts"].get(acc_id, {})
                    if (acc_cfg.get("password") or "").strip() or (acc_id == "domain" and acc_cfg.get("forwardedToGmail")):
                        results[acc_id] = sync_imap_account(acc_id, limit=limit)
                    else:
                        results[acc_id] = {
                            "success": False,
                            "code": "MISSING_CREDENTIALS",
                            "error": f"Password IMAP non configurata per {acc_cfg.get('email')}"
                        }

            any_ok = any(r.get("success") for r in results.values())
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": any_ok,
                "results": results,
                "accounts": get_sanitized_mail_accounts(),
                "messages": mail_state.get("messages", []),
                "lastGlobalSync": mail_state.get("lastGlobalSync", "")
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_mail_send(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            res = send_mail_from_account(req_data)
            res["messages"] = mail_state.get("messages", [])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_mail_action(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            msg_id = req_data.get("messageId")
            action = req_data.get("action")
            with mail_lock:
                msgs = mail_state.get("messages", [])
                if action == "delete_permanent":
                    mail_state["messages"] = [m for m in msgs if m.get("id") != msg_id]
                else:
                    for m in msgs:
                        if m.get("id") == msg_id:
                            if action == "mark_read":
                                m["read"] = True
                            elif action == "mark_unread":
                                m["read"] = False
                            elif action == "toggle_star":
                                m["starred"] = not bool(m.get("starred"))
                            elif action == "trash":
                                m["folder"] = "TRASH"
                            elif action == "restore":
                                m["folder"] = "INBOX"
                            break
            save_mail_state()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "messages": mail_state.get("messages", [])
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_sendinblue_config(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            if isinstance(req_data, dict):
                sendinblue_state["config"].update(req_data)
                sendinblue_state["config"]["enabled"] = bool((sendinblue_state["config"].get("apiKey") or "").strip())
                save_sendinblue_state()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "config": sendinblue_state["config"]
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_sendinblue_send_reminder(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            config_override = req_data.get("config") if isinstance(req_data.get("config"), dict) else None
            if config_override:
                sendinblue_state["config"].update(config_override)
                sendinblue_state["config"]["enabled"] = bool((sendinblue_state["config"].get("apiKey") or "").strip())

            res = dispatch_sendinblue_reminder(req_data, config_override=config_override)
            if req_data.get("isTest"):
                sendinblue_state["config"]["lastTestStatus"] = "connected" if res.get("success") else "error"
                sendinblue_state["config"]["lastTestTime"] = time.strftime("%d/%m/%Y %H:%M")
                sendinblue_state["config"]["lastTestMessage"] = (
                    f"Email inviata con successo a {req_data.get('toEmail')}"
                    if res.get("success")
                    else res.get("error", "Errore invio")
                )
            save_sendinblue_state()
            res["config"] = sendinblue_state["config"]

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_auth_session(self):
        sess = _verify_session_token(self._extract_session_token())
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "success": True,
            "authenticated": sess is not None,
            "email": sess.get("email") if sess else ""
        }).encode('utf-8'))

    def handle_auth_login(self):
        content_length = int(self.headers.get('Content-Length', 0))
        try:
            raw = self.rfile.read(content_length) if content_length > 0 else b'{}'
            payload = json.loads(raw.decode('utf-8'))
            email_in = str(payload.get("email", "")).strip().lower()
            pwd_in = str(payload.get("password", ""))
            remember = bool(payload.get("remember", True))

            if email_in != AUTHORIZED_EMAIL or not _verify_password_pbkdf2(pwd_in, auth_state["passwordHash"]):
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Credenziali non valide"}).encode('utf-8'))
                return

            ttl = AUTH_SESSION_TTL if remember else 86400
            token = _sign_session_token(AUTHORIZED_EMAIL, ttl)
            max_age_part = f"; Max-Age={ttl}" if remember else ""
            is_https = self.headers.get("X-Forwarded-Proto", "").lower() == "https"
            secure_part = "; Secure" if is_https else ""

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Set-Cookie', f"atelier_session={token}; Path=/; HttpOnly; SameSite=Lax{max_age_part}{secure_part}")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "email": AUTHORIZED_EMAIL,
                "name": "Fabio De Lorenzi",
                "role": "Maestro Liutaio"
            }).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_auth_logout(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Set-Cookie', "atelier_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax")
        self.end_headers()
        self.wfile.write(json.dumps({"success": True}).encode('utf-8'))

    def handle_auth_change_password(self):
        content_length = int(self.headers.get('Content-Length', 0))
        try:
            raw = self.rfile.read(content_length) if content_length > 0 else b'{}'
            payload = json.loads(raw.decode('utf-8'))
            cur_pwd = str(payload.get("currentPassword", ""))
            new_pwd = str(payload.get("newPassword", ""))
            if len(new_pwd) < 8:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "La nuova password deve avere almeno 8 caratteri"}).encode('utf-8'))
                return
            if not _verify_password_pbkdf2(cur_pwd, auth_state["passwordHash"]):
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Password attuale errata"}).encode('utf-8'))
                return
            with auth_lock:
                auth_state["passwordHash"] = _hash_password_pbkdf2(new_pwd)
                with open(AUTH_STATE_FILE, "w", encoding="utf-8") as f:
                    json.dump(auth_state, f, indent=2)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_db_status(self):
        cols = {}
        if mongo_db is not None:
            for c in sorted(DB_ALL_COLLECTIONS):
                try:
                    cols[c] = mongo_db[c].count_documents({})
                except Exception:
                    cols[c] = 0
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "success": True,
            "mongo": {
                "installed": HAS_PYMONGO,
                "connected": mongo_db is not None,
                "database": MONGO_DB_NAME if mongo_db is not None else "",
                "collections": cols
            },
            "minio": {
                "installed": HAS_MINIO,
                "connected": minio_client is not None,
                "endpoint": MINIO_ENDPOINT if minio_client is not None else "",
                "bucket": MINIO_BUCKET if minio_client is not None else ""
            }
        }, ensure_ascii=False).encode('utf-8'))

    def handle_db_all(self):
        data = mongo_get_all_data()
        if data is not None:
            # Integra sempre eventuali file orfani recuperati in Biblioteca
            bib_items = get_biblioteca_items_with_orphan_recovery()
            if bib_items:
                data["biblioteca"] = bib_items
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "success": data is not None,
            "mongo": mongo_db is not None,
            "data": data or {}
        }, ensure_ascii=False).encode('utf-8'))

    def handle_db_post(self):
        clean_path = self.path.split('?')[0]
        parts = [p for p in clean_path[len('/api/db/'):].split('/') if p]
        content_length = int(self.headers.get('Content-Length', 0))
        try:
            raw_body = self.rfile.read(content_length) if content_length > 0 else b'{}'
            payload = json.loads(raw_body.decode('utf-8'))
            if len(parts) < 2:
                self.send_response(400)
                self.end_headers()
                return
            collection = urllib.parse.unquote(parts[0])
            action = urllib.parse.unquote(parts[1])
            ok = False
            if action == "sync":
                ok = mongo_sync_collection(collection, payload.get("items") if "items" in payload else payload.get("data"))
            elif action == "upsert":
                ok = mongo_upsert_item(collection, payload.get("item"))
            elif action == "delete":
                ok = mongo_delete_item(collection, payload.get("id"))
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "mongo": ok}, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_biblioteca_get_state(self):
        items = get_biblioteca_items_with_orphan_recovery()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            "success": True,
            "items": items,
            "updatedAt": biblioteca_state.get("updatedAt", "")
        }, ensure_ascii=False).encode('utf-8'))

    def handle_storage_get_file(self, url_prefix, minio_prefix, local_dir):
        req_path = urllib.parse.unquote(self.path.split('?')[0])
        filename = req_path[len(url_prefix):].strip('/')
        safe_fname = os.path.basename(filename)
        if not safe_fname or '..' in filename or '/' in filename or '\\' in filename:
            self.send_response(400)
            self.end_headers()
            return
        try:
            data, mime_type = storage_get_object(minio_prefix, safe_fname, local_dir)
            if data is None:
                self.send_response(404)
                self.end_headers()
                return
            self.send_response(200)
            self.send_header('Content-Type', mime_type or "application/octet-stream")
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'public, max-age=86400')
            self.end_headers()
            self.wfile.write(data)
        except Exception:
            self.send_response(500)
            self.end_headers()

    def handle_biblioteca_sync(self):
        content_length = int(self.headers.get('Content-Length', 0))
        try:
            raw_body = self.rfile.read(content_length) if content_length > 0 else b'{}'
            payload = json.loads(raw_body.decode('utf-8'))
            items = payload.get("items")
            if isinstance(items, list):
                with biblioteca_lock:
                    biblioteca_state["items"] = items
                save_biblioteca_state()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "count": len(biblioteca_state.get("items", [])),
                "updatedAt": biblioteca_state.get("updatedAt", "")
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_biblioteca_upload_file(self):
        content_length = int(self.headers.get('Content-Length', 0))
        book_id = (self.headers.get('X-Book-Id') or f"ebk-{int(time.time()*1000)}").strip()
        raw_name = urllib.parse.unquote(self.headers.get('X-Book-Name') or "volume_liuteria.pdf")
        mime_type = (self.headers.get('X-Book-Mime') or mimetypes.guess_type(raw_name)[0] or "application/pdf").strip()

        safe_name = re.sub(r'[^a-zA-Z0-9._-]', '_', raw_name)
        stored_filename = f"{book_id}_{safe_name}"
        disk_path = os.path.join(BIBLIOTECA_UPLOADS_DIR, stored_filename)
        rel_path = f"biblioteca_uploads/{stored_filename}"
        api_url = f"/api/biblioteca/file/{stored_filename}"

        try:
            file_bytes = self.rfile.read(content_length) if content_length > 0 else b''
            stored_minio = storage_put_object("biblioteca", stored_filename, file_bytes, mime_type, BIBLIOTECA_UPLOADS_DIR)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "fileId": book_id,
                "url": api_url,
                "relUrl": "/" + rel_path,
                "minio": stored_minio,
                "sizeBytes": len(file_bytes)
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_media_upload_file(self):
        content_length = int(self.headers.get('Content-Length', 0))
        media_id = (self.headers.get('X-Media-Id') or f"medf-{int(time.time()*1000)}").strip()
        raw_name = urllib.parse.unquote(self.headers.get('X-Media-Name') or "file_media.bin")
        mime_type = (self.headers.get('X-Media-Mime') or mimetypes.guess_type(raw_name)[0] or "application/octet-stream").strip()

        safe_name = re.sub(r'[^a-zA-Z0-9._-]', '_', raw_name)
        stored_filename = f"{media_id}_{safe_name}"
        disk_path = os.path.join(MEDIA_UPLOADS_DIR, stored_filename)
        rel_path = f"media_uploads/{stored_filename}"

        try:
            file_bytes = self.rfile.read(content_length) if content_length > 0 else b''
            stored_minio = storage_put_object("media", stored_filename, file_bytes, mime_type, MEDIA_UPLOADS_DIR)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "fileId": media_id,
                "url": f"/api/media/file/{stored_filename}",
                "relUrl": "/" + rel_path,
                "minio": stored_minio,
                "mimeType": mime_type,
                "sizeBytes": len(file_bytes)
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_certificati_upload_file(self):
        content_length = int(self.headers.get('Content-Length', 0))
        cert_img_id = (self.headers.get('X-Media-Id') or f"certimg-{int(time.time()*1000)}").strip()
        raw_name = urllib.parse.unquote(self.headers.get('X-Media-Name') or "certificato_foto.jpg")
        mime_type = (self.headers.get('X-Media-Mime') or mimetypes.guess_type(raw_name)[0] or "image/jpeg").strip()

        safe_name = re.sub(r'[^a-zA-Z0-9._-]', '_', raw_name)
        stored_filename = f"{cert_img_id}_{safe_name}"
        rel_path = f"certificati_uploads/{stored_filename}"

        try:
            file_bytes = self.rfile.read(content_length) if content_length > 0 else b''
            stored_minio = storage_put_object("certificati", stored_filename, file_bytes, mime_type, CERTIFICATI_UPLOADS_DIR)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "fileId": cert_img_id,
                "url": f"/api/certificati/file/{stored_filename}",
                "relUrl": "/" + rel_path,
                "minio": stored_minio,
                "sizeBytes": len(file_bytes)
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_system_check_update(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8')) if post_data else {}
            force = bool(req_data.get("force", False))
            res = check_and_apply_github_update(force=force)
            res["update"] = update_state
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_system_ota_update(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            files_list = req_data.get("files", [])
            commit_sha = req_data.get("commit", "")
            source_label = req_data.get("source", "OTA HTTP (PC Windows)")
            res = apply_ota_http_update(files_list, commit_sha=commit_sha, source_label=source_label)
            res["update"] = update_state
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_social_config(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            if isinstance(req_data, dict):
                social_state["config"].update(req_data)
                has_any_url = bool(
                    (social_state["config"].get("webhookUrl") or "").strip() or
                    (social_state["config"].get("instagramWebhookUrl") or "").strip() or
                    (social_state["config"].get("facebookWebhookUrl") or "").strip()
                )
                social_state["config"]["enabled"] = has_any_url
                save_social_state()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "config": social_state["config"]
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_social_sync_posts(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            client_posts = req_data.get("posts", []) if isinstance(req_data, dict) else []
            client_config = req_data.get("config") if isinstance(req_data, dict) else None

            if isinstance(client_config, dict) and (client_config.get("webhookUrl") or client_config.get("instagramWebhookUrl") or client_config.get("facebookWebhookUrl")):
                social_state["config"].update(client_config)

            # Merge server posts and client posts so server-side auto-publications are preserved
            server_map = {p.get("id"): p for p in social_state.get("posts", []) if isinstance(p, dict) and p.get("id")}
            merged = []
            for cp in client_posts:
                if not isinstance(cp, dict) or not cp.get("id"):
                    continue
                pid = cp["id"]
                sp = server_map.get(pid)
                if sp:
                    # If server published or flagged error while client still had "Programmato", keep server result unless client explicitly rescheduled
                    sp_time = sp.get("updatedAt") or ""
                    cp_time = cp.get("updatedAt") or ""
                    if sp.get("stato") in ("Pubblicato", "Errore Accessi", "Errore Invio") and cp.get("stato") == "Programmato" and sp_time >= cp_time:
                        merged.append(sp)
                    else:
                        merged.append(cp)
                else:
                    merged.append(cp)

            social_state["posts"] = merged
            save_social_state()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "posts": social_state["posts"],
                "config": social_state["config"]
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_social_upload_media(self):
        content_length = int(self.headers.get('Content-Length', 0))
        media_id = (self.headers.get('X-Media-Id') or f"smed-{int(time.time()*1000)}").strip()
        raw_name = urllib.parse.unquote(self.headers.get('X-Media-Name') or "media_atelier.jpg")
        mime_type = (self.headers.get('X-Media-Mime') or mimetypes.guess_type(raw_name)[0] or "image/jpeg").strip()

        safe_name = re.sub(r'[^a-zA-Z0-9._-]', '_', raw_name)
        stored_filename = f"{media_id}_{safe_name}"
        disk_path = os.path.join(SOCIAL_UPLOADS_DIR, stored_filename)
        rel_path = f"social_uploads/{stored_filename}"

        try:
            file_bytes = self.rfile.read(content_length) if content_length > 0 else b''
            stored_minio = storage_put_object("social", stored_filename, file_bytes, mime_type, SOCIAL_UPLOADS_DIR)

            social_state.setdefault("mediaFiles", {})[media_id] = {
                "id": media_id,
                "name": raw_name,
                "mimeType": mime_type,
                "sizeBytes": len(file_bytes),
                "relPath": rel_path,
                "minioKey": f"social/{stored_filename}" if stored_minio else "",
                "uploadedAt": datetime.now().isoformat()
            }
            save_social_state()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "mediaId": media_id,
                "url": f"/api/social/file/{stored_filename}",
                "relUrl": "/" + rel_path,
                "minio": stored_minio,
                "sizeBytes": len(file_bytes)
            }, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_social_publish(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            is_test = bool(req_data.get("test", False))
            config_override = req_data.get("config") if isinstance(req_data.get("config"), dict) else None

            if config_override:
                social_state["config"].update(config_override)
                has_any_url = bool(
                    (social_state["config"].get("webhookUrl") or "").strip() or
                    (social_state["config"].get("instagramWebhookUrl") or "").strip() or
                    (social_state["config"].get("facebookWebhookUrl") or "").strip()
                )
                social_state["config"]["enabled"] = has_any_url

            post_obj = req_data.get("post")
            post_id = req_data.get("postId")

            if not isinstance(post_obj, dict) and post_id:
                for p in social_state.get("posts", []):
                    if isinstance(p, dict) and p.get("id") == post_id:
                        post_obj = p
                        break

            if not isinstance(post_obj, dict):
                post_obj = {
                    "id": "soc-test-webhook",
                    "titolo": "Test Connessione Automatica Instagram & Facebook — Liuteria De Lorenzi",
                    "note": "Verifica collegamento Webhook dal Gestionale Bottega Liuteria De Lorenzi (Cremona). Pronto per la pubblicazione automatica di Foto High-Res e Video 4K.",
                    "hashtag": "#liuteriadelorenzi #cremona #violinmaker #lutherie #stradivari",
                    "piattaforme": ["Instagram", "Facebook"],
                    "formatoPost": "Post Foto / Carosello HD",
                    "dataProgrammata": time.strftime("%Y-%m-%dT%H:%M"),
                    "mediaAttachments": []
                }

            result = dispatch_social_webhook(post_obj, config_override=config_override, is_test=is_test)

            if is_test:
                social_state["config"]["lastTestStatus"] = "connected" if result.get("success") else "error"
                social_state["config"]["lastTestTime"] = time.strftime("%d/%m/%Y %H:%M:%S")
                social_state["config"]["lastTestMessage"] = (
                    f"Connessione riuscita (HTTP {result.get('httpStatus', 200)})"
                    if result.get("success")
                    else result.get("error", "Errore test")
                )
            elif post_obj.get("id"):
                # Update post in server state
                target_id = post_obj.get("id")
                found_in_state = False
                for idx, sp in enumerate(social_state.get("posts", [])):
                    if isinstance(sp, dict) and sp.get("id") == target_id:
                        if result.get("success"):
                            sp["stato"] = "Pubblicato"
                            sp["dataPubblicazioneEffettiva"] = result.get("publishedAt")
                            sp["esitoPubblicazione"] = result.get("esito", [])
                            sp["errorePubblicazione"] = ""
                        else:
                            sp["stato"] = "Errore Accessi" if result.get("code") == "MISSING_WEBHOOK" else "Errore Invio"
                            sp["errorePubblicazione"] = result.get("error", "")
                        sp["updatedAt"] = datetime.now().isoformat()
                        post_obj = sp
                        found_in_state = True
                        break
                if not found_in_state:
                    if result.get("success"):
                        post_obj["stato"] = "Pubblicato"
                        post_obj["dataPubblicazioneEffettiva"] = result.get("publishedAt")
                        post_obj["esitoPubblicazione"] = result.get("esito", [])
                        post_obj["errorePubblicazione"] = ""
                    else:
                        post_obj["stato"] = "Errore Accessi" if result.get("code") == "MISSING_WEBHOOK" else "Errore Invio"
                        post_obj["errorePubblicazione"] = result.get("error", "")
                    post_obj["updatedAt"] = datetime.now().isoformat()
                    social_state.setdefault("posts", []).insert(0, post_obj)

            save_social_state()

            result["post"] = post_obj
            result["config"] = social_state["config"]

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def handle_mqtt_test_publish(self):
        global mqtt_bridge_instance
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            req_data = json.loads(post_data.decode('utf-8')) if post_data else {}
            topic = req_data.get('topic') or "atelier/sensore_laboratorio"
            temp = float(req_data.get('temp', 22.0))
            hum = float(req_data.get('humidity', 48.0))

            success = False
            if mqtt_bridge_instance:
                success = mqtt_bridge_instance.publish_test(topic, temp, hum)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": success,
                "message": f"Messaggio MQTT inviato su topic '{topic}'" if success else "Broker non connesso",
                "temp": temp,
                "humidity": hum
            }).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def handle_mqtt_config(self):
        global mqtt_bridge_instance
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            broker = req_data.get('broker', DEFAULT_MQTT_BROKER).strip()
            port = int(req_data.get('port', DEFAULT_MQTT_PORT))
            custom_topic = req_data.get('topic', '').strip()

            telemetry_data['custom_topic'] = custom_topic
            telemetry_data['broker'] = f"{broker}:{port}"

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "broker": f"{broker}:{port}",
                "custom_topic": custom_topic
            }).encode('utf-8'))
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def handle_ha_proxy(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        try:
            req_data = json.loads(post_data.decode('utf-8'))
            target_url = req_data.get('url')
            token = req_data.get('token', '')

            if not target_url:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error":"Target URL mancante"}')
                return

            req = urllib.request.Request(target_url)
            req.add_header('Content-Type', 'application/json')
            req.add_header('User-Agent', 'Atelier-Liuteria-Master/1.0')
            if token:
                req.add_header('Authorization', f'Bearer {token}')

            with urllib.request.urlopen(req, timeout=10) as response:
                status_code = response.getcode()
                body = response.read()

                self.send_response(status_code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(body)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(e.read())
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

def run_server():
    global mqtt_bridge_instance, httpd_server_instance
    mqtt_bridge_instance = MqttBridge()
    mqtt_bridge_instance.start()

    esphome_poller = EsphomePoller()
    esphome_poller.start()

    social_scheduler = SocialSchedulerThread(interval=15)
    social_scheduler.start()

    github_updater = GitHubAutoUpdaterThread(interval=AUTO_UPDATE_INTERVAL)
    github_updater.start()

    no_browser = ("--no-browser" in sys.argv) or (os.environ.get("NO_BROWSER", "").lower() in ("1", "true", "yes"))

    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.daemon_threads = True
    with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), LutherieHandler) as httpd:
        httpd_server_instance = httpd
        url = f"http://localhost:{PORT}/index.html"
        print("==================================================================", flush=True)
        print("  ATELIER LIUTERIA MASTER - SUITE GESTIONALE", flush=True)
        print("==================================================================", flush=True)
        print(f"  Server Web in ascolto: 0.0.0.0:{PORT} ({url})", flush=True)
        print(f"  Sensore M5Stack:       http://{DEFAULT_ESPHOME_HOST}/ (ESPHome Live)", flush=True)
        print(f"  Bridge MQTT attivo:    Broker {DEFAULT_MQTT_BROKER}:{DEFAULT_MQTT_PORT}", flush=True)
        print("  Proxy Home Assistant:  /api/ha-proxy (Zero problemi CORS)", flush=True)
        print("  Social Scheduler 24/7: /api/social/* (Webhook IG & FB Attivo)", flush=True)
        print(f"  Auto-Update GitHub:    {GITHUB_REPO} (branch '{GITHUB_BRANCH}') + OTA HTTP", flush=True)
        print("==================================================================", flush=True)
        if not no_browser:
            print("  Apertura del browser in corso...", flush=True)
            try:
                webbrowser.open(url)
            except Exception:
                pass
        print("  Servizio avviato. Premi CTRL+C per arrestare il server.", flush=True)
        print("==================================================================", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nArresto del server.", flush=True)

if __name__ == '__main__':
    run_server()
