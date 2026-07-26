import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from app.config import settings


SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465


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


def _build_html(
    employee_name: str,
    content: dict,
    comment: Optional[str]
) -> str:

    comment_html = (
        f"""
        <p style="color:#475569;">
            <em>Manager's note: "{comment}"</em>
        </p>
        """
        if comment
        else ""
    )

    return f"""
    <div style="
        font-family: Arial, sans-serif;
        max-width:480px;
        margin:auto;
        padding:24px;
    ">

        <h2 style="color:#1d4ed8;">
            SafeCommute
        </h2>

        <h3 style="color:#0f172a;">
            {content["heading"]}
        </h3>

        <p style="color:#334155;">
            Hi {employee_name},
        </p>

        <p style="color:#334155;">
            {content["message"]}
        </p>

        {comment_html}

        <p style="
            color:#94a3b8;
            font-size:12px;
            margin-top:32px;
        ">
            This is an automated message from SafeCommute.
        </p>

    </div>
    """


def send_decision_email(
    to_email: str,
    employee_name: str,
    status: str,
    comment: Optional[str] = None,
):

    content = STATUS_CONTENT.get(status)

    if not content:
        print(
            f"[EMAIL] Unknown status '{status}', skipping email"
        )
        return


    msg = MIMEMultipart("alternative")

    msg["Subject"] = content["subject"]

    msg["From"] = (
        f"SafeCommute <{settings.GMAIL_SMTP_EMAIL}>"
    )

    msg["To"] = to_email


    html_body = _build_html(
        employee_name,
        content,
        comment
    )

    msg.attach(
        MIMEText(html_body, "html")
    )


    try:

        print("[EMAIL] Connecting to Gmail SMTP...")


        # Gmail SSL connection
        with smtplib.SMTP_SSL(
            SMTP_HOST,
            SMTP_PORT,
            timeout=60
        ) as server:


            print("[EMAIL] Logging into Gmail...")


            server.login(
                settings.GMAIL_SMTP_EMAIL,
                settings.GMAIL_SMTP_APP_PASSWORD
            )


            print("[EMAIL] Sending email...")


            server.sendmail(
                settings.GMAIL_SMTP_EMAIL,
                [to_email],
                msg.as_string()
            )


        print(
            f"[EMAIL] Sent successfully to {to_email}"
        )


    except smtplib.SMTPAuthenticationError:

        print(
            "[EMAIL] Gmail authentication failed. "
            "Check GMAIL_SMTP_EMAIL and GMAIL_SMTP_APP_PASSWORD"
        )


    except smtplib.SMTPException as e:

        print(
            f"[EMAIL] SMTP error: {e}"
        )


    except Exception as e:

        print(
            f"[EMAIL] Email failed: {e}"
        )