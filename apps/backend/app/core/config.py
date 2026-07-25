"""
app/core/config.py
------------------
Application settings loaded from environment variables / .env file.
Access anywhere with: from app.core.config import settings
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Literal


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────────────────
    APP_NAME: str = "Agentic Travel AI"
    APP_VERSION: str = "0.1.0"
    APP_ENV: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = Field(default=True)

    # ── Logging ───────────────────────────────────────────────────────────────
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    # ── LLM (placeholder — not used until LLM integration) ────────────────────
    GOOGLE_API_KEY: str = Field(default="", description="Google Generative AI API key")

    # ── CORS ──────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


# Singleton — import this instance everywhere
settings = Settings()
