"""
Atelier Liuteria - Server Locale con Bridge MQTT & Proxy Home Assistant
Permette di eseguire il gestionale su http://localhost:8080 con:
1. Connessione MQTT diretta al broker locale (192.168.68.108:1883) per misurazioni T e H
2. Rilevamento automatico dei payload temperatura e umidità dai sensori (Zigbee2MQTT, Tasmota, ESPHome, ecc.)
3. Proxy per Home Assistant REST API (elimina ogni problema di CORS del browser)
"""

import http.server
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

PORT = int(os.environ.get("PORT", 8080))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MQTT_BROKER = os.environ.get("MQTT_BROKER", "192.168.68.108")
DEFAULT_MQTT_PORT = int(os.environ.get("MQTT_PORT", 1883))
DEFAULT_ESPHOME_HOST = os.environ.get("ESPHOME_HOST", "192.168.68.101")

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
SOCIAL_STATE_FILE = os.path.join(DIRECTORY, "social_state.json")
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
    "social_state.json",
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

DEFAULT_MAIL_MESSAGES = [
    {
        "id": "mail-init-1",
        "uid": "init-1",
        "accountId": "domain",
        "accountEmail": "info@liuteriadelorenzi.it",
        "folder": "INBOX",
        "fromName": "Maestro Marco Rossi (Teatro alla Scala)",
        "fromEmail": "m.rossi.violin@orchestra.it",
        "toEmail": "info@liuteriadelorenzi.it",
        "subject": "Richiesta prova acustica Violino Modello Guarneri 'Il Cannone' 1743",
        "dateIso": time.strftime("%Y-%m-%dT09:42:00"),
        "dateFormatted": time.strftime("%d/%m/%Y 09:42"),
        "snippet": "Buongiorno Maestro De Lorenzi, le scrivo per confermare la mia visita in bottega a Cremona per la prova acustica del nuovo violino...",
        "bodyText": "Buongiorno Maestro De Lorenzi,\n\nLe scrivo per confermare la mia visita in bottega a Cremona per la prova acustica del nuovo Violino ispirato al Guarneri del Gesù 'Il Cannone' 1743.\n\nSarei disponibile giovedì mattina alle ore 10:30. Porterò con me il mio archetto Sartory per testare la proiezione sulle quarte corde e la risposta nel registro acuto.\n\nResto in attesa di un Suo gentile riscontro.\n\nCordiali saluti,\nMaestro Marco Rossi\nPrimo Violino",
        "bodyHtml": "",
        "read": False,
        "starred": True,
        "attachments": [
            {
                "filename": "Scheda_Preferenze_Acustiche_Rossi.pdf",
                "contentType": "application/pdf",
                "sizeFormatted": "245 KB"
            }
        ]
    },
    {
        "id": "mail-init-2",
        "uid": "init-2",
        "accountId": "gmail",
        "accountEmail": "liuteriadelorenzi@gmail.com",
        "folder": "INBOX",
        "fromName": "Segheria Legnami di Risonanza Val di Fiemme",
        "fromEmail": "ordini@abetepanaveggio.it",
        "toEmail": "liuteriadelorenzi@gmail.com",
        "subject": "Disponibilità tavole Abete Rosso stagionatura 2014 (Scelta Master Quarter-Sawn)",
        "dateIso": time.strftime("%Y-%m-%dT08:15:00"),
        "dateFormatted": time.strftime("%d/%m/%Y 08:15"),
        "snippet": "Gentile Liuteria De Lorenzi, abbiamo selezionato 6 cunei di Abete Rosso di Paneveggio a spacco naturale con velocità del suono > 5750 m/s...",
        "bodyText": "Gentile Maestro De Lorenzi,\n\nCome da accordi telefonici, abbiamo messo da parte per il Suo atelier 6 tavole per violino e 2 per violoncello in Abete Rosso di Paneveggio (taglio a quarto radiale perfetto, abbattimento luna calante novembre 2014).\n\nCaratteristiche fisiche rilevate in laboratorio:\n- Densità media: 395 kg/m³\n- Velocità longitudinale ultrasuoni: 5.780 m/s\n- Anelli di accrescimento regolari (1.1 mm al centro, 1.6 mm ai bordi)\n\nIn allegato trova il bollettino tecnico del lotto.\n\nUn cordiale saluto,\nDott. For. Luca Varesco — Val di Fiemme Tonewoods",
        "bodyHtml": "",
        "read": False,
        "starred": True,
        "attachments": [
            {
                "filename": "Lotto_Abete_Paneveggio_2014_Certificato.pdf",
                "contentType": "application/pdf",
                "sizeFormatted": "412 KB"
            }
        ]
    },
    {
        "id": "mail-init-3",
        "uid": "init-3",
        "accountId": "domain",
        "accountEmail": "info@liuteriadelorenzi.it",
        "folder": "INBOX",
        "fromName": "Prof.ssa Clara Weiss — Universität Mozarteum Salzburg",
        "fromEmail": "c.weiss@mozarteum.at",
        "toEmail": "info@liuteriadelorenzi.it",
        "subject": "Commissione Viola 41.2 cm Modello Stradivari — Preventivo e tempi di consegna",
        "dateIso": "2026-11-14T17:20:00",
        "dateFormatted": "14/11/2026 17:20",
        "snippet": "Gentile Maestro De Lorenzi, ho avuto modo di ascoltare una Sua Viola durante il festival di Salisburgo e desidero richiedere informazioni per una commissione...",
        "bodyText": "Gentile Maestro De Lorenzi,\n\nHo avuto il piacere di ascoltare e provare una Sua Viola 41.2 cm appartenente a un collega durante il recente concerto da camera a Salisburgo. Sono rimasta profondamente colpita dalla prontezza del Do grave e dal timbro caldo e avvolgente sul La.\n\nVorrei chiederLe la disponibilità per la commissione di una Viola su misura con fondo unico in acero marezzato balcanico e conoscere i tempi attuali di lavorazione e le modalità di acconto.\n\nCon viva stima,\nProf.ssa Clara Weiss\nUniversität Mozarteum Salzburg",
        "bodyHtml": "",
        "read": False,
        "starred": False,
        "attachments": []
    },
    {
        "id": "mail-init-4",
        "uid": "init-4",
        "accountId": "gmail",
        "accountEmail": "liuteriadelorenzi@gmail.com",
        "folder": "INBOX",
        "fromName": "Kremer Pigmente GmbH & Co. KG",
        "fromEmail": "info@kremer-pigmente.de",
        "toEmail": "liuteriadelorenzi@gmail.com",
        "subject": "Conferma spedizione #KP-88412: Lacca di Robbia, Sangue di Drago e Colofonia",
        "dateIso": "2026-11-13T14:05:00",
        "dateFormatted": "13/11/2026 14:05",
        "snippet": "Il Suo ordine #KP-88412 contenente resine naturali e pigmenti per vernice ad olio cremonese è stato affidato al corriere...",
        "bodyText": "Gentile Cliente Liuteria De Lorenzi,\n\nConfermiamo la spedizione dell'ordine #KP-88412 indirizzato al vostro laboratorio di Cremona:\n- 1x Alizarina / Lacca di Robbia pura in radice (250g)\n- 1x Resina Sangue di Drago Sumatra extra (100g)\n- 1x Mastice di Chios in lacrime (250g)\n- 1x Olio di Lino spremuto a freddo purificato (1000ml)\n\nConsegna prevista entro 48 ore lavorative.\n\nCordiali saluti,\nTeam Kremer Pigmente",
        "bodyHtml": "",
        "read": True,
        "starred": False,
        "attachments": []
    },
    {
        "id": "mail-init-5",
        "uid": "init-5",
        "accountId": "domain",
        "accountEmail": "info@liuteriadelorenzi.it",
        "folder": "INBOX",
        "fromName": "Fondazione Museo del Violino Cremona",
        "fromEmail": "segreteria@museodelviolino.org",
        "toEmail": "info@liuteriadelorenzi.it",
        "subject": "Invito Rassegna Acustica & Mostra Liuteria Contemporanea Cremonese",
        "dateIso": "2026-11-12T11:30:00",
        "dateFormatted": "12/11/2026 11:30",
        "snippet": "Gentile Maestro, siamo lieti di invitarLa alla sessione di audizione comparativa nell'Auditorium Giovanni Arvedi...",
        "bodyText": "Gentile Maestro De Lorenzi,\n\nSiamo lieti di invitarLa alla prossima sessione di audizione acustica comparativa dedicata agli strumenti ad arco contemporanei presso l'Auditorium Giovanni Arvedi.\n\nPer confermare la partecipazione con un violino o violoncello del Suo atelier, La preghiamo di rispondere a questa comunicazione indicando il modello presentato.\n\nCordiali saluti,\nSegreteria Scientifica — Cremona",
        "bodyHtml": "",
        "read": True,
        "starred": True,
        "attachments": []
    }
]

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
    "messages": list(DEFAULT_MAIL_MESSAGES),
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
                    if isinstance(loaded.get("messages"), list) and len(loaded["messages"]) > 0:
                        mail_state["messages"] = loaded["messages"][:250]
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

            existing_by_id = {m.get("id"): m for m in mail_state.get("messages", []) if isinstance(m, dict)}
            for fm in fetched_messages:
                old_m = existing_by_id.get(fm["id"])
                if old_m:
                    fm["read"] = old_m.get("read", fm["read"])
                    fm["starred"] = old_m.get("starred", fm["starred"])
                    fm["folder"] = old_m.get("folder", fm["folder"])
                existing_by_id[fm["id"]] = fm

            # Se abbiamo scaricato email reali via IMAP per questo account, rimuovi i messaggi demo iniziali di quell'account
            if len(fetched_messages) > 0:
                synced_acc_ids = {acc_id}
                if acc_id == "gmail" and acc_cfg.get("detectForwardedDomain", True):
                    synced_acc_ids.add("domain")
                existing_by_id = {
                    k: v for k, v in existing_by_id.items()
                    if not (str(k).startswith("mail-init-") and v.get("accountId") in synced_acc_ids)
                }

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

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Media-Id, X-Media-Name, X-Media-Mime, X-Book-Id, X-Book-Name, X-Book-Mime')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
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
        elif self.path.startswith('/api/biblioteca/upload-file'):
            self.handle_biblioteca_upload_file()
        elif self.path.startswith('/api/media/upload-file'):
            self.handle_media_upload_file()
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

    def handle_biblioteca_upload_file(self):
        content_length = int(self.headers.get('Content-Length', 0))
        book_id = (self.headers.get('X-Book-Id') or f"ebk-{int(time.time()*1000)}").strip()
        raw_name = urllib.parse.unquote(self.headers.get('X-Book-Name') or "volume_liuteria.pdf")
        mime_type = (self.headers.get('X-Book-Mime') or mimetypes.guess_type(raw_name)[0] or "application/pdf").strip()

        safe_name = re.sub(r'[^a-zA-Z0-9._-]', '_', raw_name)
        stored_filename = f"{book_id}_{safe_name}"
        disk_path = os.path.join(BIBLIOTECA_UPLOADS_DIR, stored_filename)
        rel_path = f"biblioteca_uploads/{stored_filename}"

        try:
            file_bytes = self.rfile.read(content_length) if content_length > 0 else b''
            with open(disk_path, "wb") as f:
                f.write(file_bytes)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "fileId": book_id,
                "url": "/" + rel_path,
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
            with open(disk_path, "wb") as f:
                f.write(file_bytes)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "fileId": media_id,
                "url": "/" + rel_path,
                "mimeType": mime_type,
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
            with open(disk_path, "wb") as f:
                f.write(file_bytes)

            social_state.setdefault("mediaFiles", {})[media_id] = {
                "id": media_id,
                "name": raw_name,
                "mimeType": mime_type,
                "sizeBytes": len(file_bytes),
                "relPath": rel_path,
                "uploadedAt": datetime.now().isoformat()
            }
            save_social_state()

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "mediaId": media_id,
                "url": "/" + rel_path,
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
