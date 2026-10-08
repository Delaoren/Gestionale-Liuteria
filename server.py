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
import json
import os
import sys
import threading
import time
import webbrowser

try:
    import paho.mqtt.client as mqtt
    HAS_PAHO = True
except ImportError:
    HAS_PAHO = False

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MQTT_BROKER = "192.168.68.108"
DEFAULT_MQTT_PORT = 1883
DEFAULT_ESPHOME_HOST = "192.168.68.101"

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

class LutherieHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
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
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/ha-proxy'):
            self.handle_ha_proxy()
        elif self.path.startswith('/api/mqtt/test-publish'):
            self.handle_mqtt_test_publish()
        elif self.path.startswith('/api/mqtt/config'):
            self.handle_mqtt_config()
        else:
            self.send_error(404, "Endpoint non trovato")

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
    global mqtt_bridge_instance
    mqtt_bridge_instance = MqttBridge()
    mqtt_bridge_instance.start()

    esphome_poller = EsphomePoller()
    esphome_poller.start()

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), LutherieHandler) as httpd:
        url = f"http://localhost:{PORT}/index.html"
        print("==================================================================")
        print("  ATELIER LIUTERIA MASTER - SUITE GESTIONALE")
        print("==================================================================")
        print(f"  Server Web locale:    {url}")
        print(f"  Sensore M5Stack:      http://{DEFAULT_ESPHOME_HOST}/ (ESPHome Live)")
        print(f"  Bridge MQTT attivo:   Broker {DEFAULT_MQTT_BROKER}:{DEFAULT_MQTT_PORT}")
        print("  Proxy Home Assistant: /api/ha-proxy (Zero problemi CORS)")
        print("==================================================================")
        print("  Apertura del browser in corso...")
        print("  Premi CTRL+C per arrestare il server.")
        print("==================================================================")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nArresto del server.")

if __name__ == '__main__':
    run_server()
