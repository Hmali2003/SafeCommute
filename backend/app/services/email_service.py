import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleAuthRequest
from googleapiclient.discovery import build

from app.config import settings

STATUS_CONTENT = {
    "approved": {
        "subject": "Your WFH request has been approved",
        "heading": "Request Approved ✅",
        "message": "Your Work From Home request has been approved. Stay safe today.",
    },
    "rejected": {
        "subject": "Your WFH request has been rejected",
        "heading": "Request Rejected",
        "message": "Your Work From Home request has been reviewed and was not approved.",
    },
    "more_info_requested": {
        "subject": "More information needed for your WFH request",
        "heading": "More Information Needed",
        "message": "Your manager needs more information before making a decision on your request.",
    },
}


def _build_html(employee_name: str, content: dict, comment: Optional[str]) -> str:
    comment_html = f'<p style="color:#475569;"><em>Manager\'s note: "{comment}"</em></p>' if comment else ""
    return f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #1d4ed8;">SafeCommute</h2>
      <h3 style="color: #0f172a;">{content['heading']}</h3>
      <p style="color: #334155;">Hi {employee_name},</p>
      <p style="color: #334155;">{content['message']}</p>
      {comment_html}
      <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This is an automated message from SafeCommute.</p>
    </div>
    """


def _get_gmail_service():
    """
    Builds an authenticated Gmail API client using a long-lived refresh token,
    so the app never needs a browser login step in production - the refresh
    token was generated once, locally, via scripts/generate_gmail_token.py.
    """
    creds = Credentials(
        token=None,
        refresh_token=settings.GMAIL_REFRESH_TOKEN,
        client_id=settings.GMAIL_CLIENT_ID,
        client_secret=settings.GMAIL_CLIENT_SECRET,
        token_uri="https://oauth2.googleapis.com/token",
        scopes=["https://www.googleapis.com/auth/gmail.send"],
    )
    creds.refresh(GoogleAuthRequest())  # exchanges refresh token for a short-lived access token
    return build("gmail", "v1", credentials=creds)


def send_decision_email(
    to_email: str,
    employee_name: str,
    status: str,
    comment: Optional[str] = None,
):
    """
    Sends a real email from your Gmail account via the Gmail API (HTTPS),
    instead of raw SMTP - this works on Render's free tier since it isn't
    subject to the SMTP port block (25/465/587), only ordinary HTTPS traffic.

    Signature is unchanged so manager_router.py needs no edits. Failures are
    caught and logged, never raised - email delivery must never block or
    roll back a manager's decision, which has already been committed to the
    database by the time this is called.
    """
    content = STATUS_CONTENT.get(status)
    if not content:
        print(f"[EMAIL] Unknown status '{status}', skipping email")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = content["subject"]
    msg["From"] = f"SafeCommute <{settings.GMAIL_SENDER_EMAIL}>"
    msg["To"] = to_email
    msg.attach(MIMEText(_build_html(employee_name, content, comment), "html"))

    raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode()

    try:
        service = _get_gmail_service()
        service.users().messages().send(
            userId="me", body={"raw": raw_message}
        ).execute()
        print(f"[EMAIL] Sent '{content['subject']}' to {to_email}")
    except Exception as e:
        # Covers HttpError from the Gmail API, refresh-token expiry, network issues, etc.
        print(f"[EMAIL] Gmail API send failed: {e}")