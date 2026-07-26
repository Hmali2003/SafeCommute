import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.utils.dependencies import get_current_user, require_employee
from app.database import get_db


class FakeUser:
    id = "11111111-1111-1111-1111-111111111111"
    name = "Test Employee"
    email = "employee@test.com"
    role = "employee"


@pytest.fixture
def client_with_fake_employee():
    fake_db = MagicMock()

    def override_db():
        yield fake_db

    app.dependency_overrides[require_employee] = lambda: FakeUser()
    app.dependency_overrides[get_db] = override_db

    yield TestClient(app), fake_db

    app.dependency_overrides.clear()


class TestCreateRequest:
    @patch("app.routers.employee_router.calculate_risk_score")
    @patch("app.routers.employee_router.get_traffic_data")
    @patch("app.routers.employee_router.get_weather")
    def test_submit_request_without_image_succeeds(
        self, mock_weather, mock_traffic, mock_risk, client_with_fake_employee
    ):
        client, fake_db = client_with_fake_employee
        mock_weather.return_value = {"condition": "Clear", "rainfall_mm_last_1h": 0}
        mock_traffic.return_value = {"status": "unavailable"}
        mock_risk.return_value = {"risk_score": 15, "recommendation": "Low travel risk. Normal commute appears safe."}

        response = client.post(
            "/api/employee/requests",
            data={"reason": "Heavy fog near my area", "latitude": "19.9975", "longitude": "73.7898"},
        )

        assert response.status_code == 200
        fake_db.add.assert_called_once()
        fake_db.commit.assert_called_once()

    def test_missing_required_fields_returns_422(self, client_with_fake_employee):
        client, _ = client_with_fake_employee
        response = client.post("/api/employee/requests", data={"reason": "Missing coordinates"})
        assert response.status_code == 422


class TestGetMyRequests:
    def test_returns_only_employee_own_requests(self, client_with_fake_employee):
        client, fake_db = client_with_fake_employee
        fake_db.query.return_value.filter.return_value.order_by.return_value.all.return_value = []

        response = client.get("/api/employee/requests")

        assert response.status_code == 200
        assert response.json() == []