import httpx
import pytest
from unittest.mock import patch, MagicMock
from app.services.weather_service import get_weather


def make_mock_response(status_code=200, json_data=None):
    mock = MagicMock()
    mock.status_code = status_code
    mock.json.return_value = json_data or {}
    if status_code != 200:
        mock.raise_for_status.side_effect = httpx.HTTPStatusError("error", request=MagicMock(), response=mock)
    return mock


class TestGetWeather:
    @patch("app.services.weather_service.httpx.get")
    def test_successful_response_parses_correctly(self, mock_get):
        mock_get.return_value = make_mock_response(200, {
            "main": {"temp": 25.3, "feels_like": 26.0, "humidity": 60},
            "weather": [{"main": "Clouds", "description": "scattered clouds"}],
            "wind": {"speed": 3.2},
            "rain": {"1h": 0.5},
            "visibility": 9000,
        })

        result = get_weather(19.99, 73.79)

        assert result["temperature_celsius"] == 25.3
        assert result["condition"] == "Clouds"
        assert result["rainfall_mm_last_1h"] == 0.5
        assert "error" not in result

    @patch("app.services.weather_service.httpx.get")
    def test_no_rain_key_defaults_to_zero(self, mock_get):
        mock_get.return_value = make_mock_response(200, {
            "main": {"temp": 30, "feels_like": 31, "humidity": 20},
            "weather": [{"main": "Clear", "description": "clear sky"}],
            "wind": {"speed": 1.0},
            "visibility": 10000,
        })

        result = get_weather(19.99, 73.79)
        assert result["rainfall_mm_last_1h"] == 0

    @patch("app.services.weather_service.httpx.get")
    def test_http_error_returns_error_dict_not_exception(self, mock_get):
        mock_get.return_value = make_mock_response(401)

        result = get_weather(19.99, 73.79)
        assert "error" in result

    @patch("app.services.weather_service.httpx.get")
    def test_network_failure_returns_error_dict_not_exception(self, mock_get):
        mock_get.side_effect = httpx.RequestError("connection failed")

        result = get_weather(19.99, 73.79)
        assert "error" in result
        assert result["error"] == "Could not reach weather service"