from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)


def get_public_ip():
    response = requests.get(
        "https://api.ipify.org",
        timeout=10
    )
    response.raise_for_status()
    return response.text


def geolocate_ip(ip):
    response = requests.get(
        f"https://ipwho.is/{ip}",
        timeout=10
    )
    response.raise_for_status()

    data = response.json()

    if not data.get("success"):
        raise Exception("Could not determine location")

    return {
        "city": data.get("city") or "",
        "region": data.get("region") or "",
        "country": data.get("country") or "",
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude")
    }


def get_weather(latitude, longitude):

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,

        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "apparent_temperature,"
            "weather_code,"
            "wind_speed_10m"
        ),

        "daily": (
            "weather_code,"
            "temperature_2m_max,"
            "temperature_2m_min"
        ),

        "timezone": "auto",
        "forecast_days": 5
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    return response.json()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/weather")
def weather():

    try:
        ip = get_public_ip()

        location = geolocate_ip(ip)

        weather_data = get_weather(
            location["latitude"],
            location["longitude"]
        )

        return jsonify({
            "ip": ip,
            "location": location,
            "weather": weather_data
        })

    except requests.RequestException as error:

        return jsonify({
            "error": str(error)
        }), 500

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)