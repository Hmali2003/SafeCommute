import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.utils.dependencies import require_manager
from app.database import get_db


class FakeManager:
    id = "22222222-2222-2222-2222-222222222222"
    name = "Test Manager"
    email = "manager@test.com"
    role = "manager"


class FakeRequest:
    def __init__(self):
        self.id = "33333333-3333-3333-3333-333333333333"
        self.employee_id = "11111111-1111-1111-1111-111111111111"
        self.status = "pending"
        self.manager_comment = None


@pytest.fixture
def client_with_fake_manager():
    fake_db = MagicMock()

    def override_db():
        yield fake_db

    app.dependency_overrides[require_manager] = lambda: FakeManager()
    app.dependency_overrides[get_db] = override_db

    yield TestClient(app), fake_db

    app.dependency_overrides.clear()


class TestMakeDecision:
    @patch("app.routers.manager_router.send_decision_email")
    def test_approve_updates_status_and_triggers_email(self, mock_email, client_with_fake_manager):
        client, fake_db = client_with_fake_manager
        fake_req = FakeRequest()

        fake_db.query.return_value.filter.return_value.first.side_effect = [
            fake_req,                                          # WFHRequest lookup
            MagicMock(email="employee@test.com", name="Test Employee"),  # User lookup
        ]

        response = client.patch(
            f"/api/manager/requests/{fake_req.id}/decision",
            json={"status": "approved", "manager_comment": "Approved due to heavy rainfall."},
        )

        assert response.status_code == 200
        assert fake_req.status == "approved"
        assert fake_req.manager_comment == "Approved due to heavy rainfall."
        mock_email.assert_called_once()

    def test_invalid_status_returns_400(self, client_with_fake_manager):
        client, _ = client_with_fake_manager
        response = client.patch(
            "/api/manager/requests/some-id/decision",
            json={"status": "definitely_not_a_real_status"},
        )
        assert response.status_code == 400

    def test_nonexistent_request_returns_404(self, client_with_fake_manager):
        client, fake_db = client_with_fake_manager
        fake_db.query.return_value.filter.return_value.first.return_value = None

        response = client.patch(
            "/api/manager/requests/nonexistent-id/decision",
            json={"status": "approved"},
        )
        assert response.status_code == 404

    @patch("app.routers.manager_router.send_decision_email")
    def test_email_failure_does_not_block_decision(self, mock_email, client_with_fake_manager):
        """Confirms the graceful-failure requirement from the email integration phase."""
        client, fake_db = client_with_fake_manager
        fake_req = FakeRequest()
        mock_email.side_effect = Exception("SMTP connection failed")

        fake_db.query.return_value.filter.return_value.first.side_effect = [
            fake_req,
            MagicMock(email="employee@test.com", name="Test Employee"),
        ]

        response = client.patch(
            f"/api/manager/requests/{fake_req.id}/decision",
            json={"status": "rejected"},
        )

        # Decision must still succeed even though the email "provider" raised
        assert response.status_code == 200
        assert fake_req.status == "rejected"