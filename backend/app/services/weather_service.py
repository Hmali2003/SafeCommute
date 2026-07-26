import httpx
from app.config import settings

OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_weather(latitude: float, longitude: float) -> dict:
    """
    Fetches current weather for a location from OpenWeatherMap.
    Returns a dict we store directly in wfh_requests.weather_data (JSON column).
    On any failure, returns a dict with an 'error' key rather than raising -
    a weather outage should never block someone from submitting a WFH request.
    """
    try:
        response = httpx.get(
            OPENWEATHER_URL,
            params={
                "lat": latitude,
                "lon": longitude,
                "appid": settings.OPENWEATHER_API_KEY,
                "units": "metric",
            },
            timeout=8.0,
        )
        response.raise_for_status()
        data = response.json()

        return {
            "temperature_celsius": data["main"]["temp"],
            "feels_like_celsius": data["main"]["feels_like"],
            "condition": data["weather"][0]["main"],          # e.g. "Rain"
            "description": data["weather"][0]["description"],  # e.g. "moderate rain"
            "rainfall_mm_last_1h": data.get("rain", {}).get("1h", 0),
            "humidity_percent": data["main"]["humidity"],
            "wind_speed_ms": data["wind"]["speed"],
            "visibility_meters": data.get("visibility"),
        }

    except httpx.HTTPStatusError as e:
        return {"error": f"OpenWeatherMap returned {e.response.status_code}"}
    except httpx.RequestError:
        return {"error": "Could not reach weather service"}
    except (KeyError, IndexError):
        return {"error": "Unexpected weather response format"}