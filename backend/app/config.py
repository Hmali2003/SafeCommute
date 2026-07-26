from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_JWT_SECRET: str

    # External APIs
    OPENWEATHER_API_KEY: str
    # Gmail SMTP
    GMAIL_SMTP_EMAIL: str
    GMAIL_SMTP_APP_PASSWORD: str

    # App
    FRONTEND_URL: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance - loaded once, reused everywhere."""
    return Settings()


settings = get_settings()