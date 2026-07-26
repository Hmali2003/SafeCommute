import pytest
from unittest.mock import patch


@pytest.fixture
def sample_weather_clear():
    return {
        "temperature_celsius": 28,
        "feels_like_celsius": 29,
        "condition": "Clear",
        "description": "clear sky",
        "rainfall_mm_last_1h": 0,
        "humidity_percent": 40,
        "wind_speed_ms": 2.1,
        "visibility_meters": 10000,
    }


@pytest.fixture
def sample_weather_heavy_rain():
    return {
        "temperature_celsius": 22,
        "feels_like_celsius": 22,
        "condition": "Rain",
        "description": "heavy intensity rain",
        "rainfall_mm_last_1h": 18.5,
        "humidity_percent": 92,
        "wind_speed_ms": 13.4,
        "visibility_meters": 700,
    }


@pytest.fixture
def sample_weather_error():
    return {"error": "OpenWeatherMap returned 401"}


@pytest.fixture
def sample_traffic_unavailable():
    return {"status": "unavailable", "congestion_level": None, "note": "Live traffic integration not yet connected. Neutral score applied."}