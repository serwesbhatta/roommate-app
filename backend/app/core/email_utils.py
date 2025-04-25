import smtplib
from email.message import EmailMessage
from app.core.config import Settings

settings = Settings()        # ⇐ your existing Pydantic settings class

def send_welcome_email(to_email: str, raw_password: str) -> None:
    """
    Sends a blocking welcome e-mail that includes the user’s credentials.
    Raises RuntimeError on any failure.
    """
    msg             = EmailMessage()
    msg["Subject"]  = "Welcome to the MSU Roommate App"
    msg["From"]     = settings.MAIL_FROM           # e.g. "no-reply@mysite.com"
    msg["To"]       = to_email

    msg.set_content(
        f"""Hi,

Your admin account has been created.

Login e-mail : {to_email}
Temporary pwd : {raw_password}

Please log in and change the password right away.

Thanks,
MSU Housing & Residence Life
"""
    )

    try:
        with smtplib.SMTP_SSL(settings.MAIL_SERVER, settings.MAIL_PORT) as smtp:
            smtp.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            smtp.send_message(msg)
    except Exception as exc:            # ⇐ bubble up a clean error
        raise RuntimeError(f"SMTP error: {exc}") from exc
