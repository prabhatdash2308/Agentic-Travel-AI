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

    # Application
    APP_NAME: str = "Eagle Agentic AI"
    APP_VERSION: str = "1.0.0"
    APP_ENV: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = Field(default=True)

    # Logging
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    # Groq LLM (primary — Llama 3.3 70B)
    GROQ_API_KEY: str = Field(default="", description="Groq API key")
    GROQ_MODEL: str = Field(default="llama-3.3-70b-versatile", description="Groq model identifier")
    LLM_TEMPERATURE: float = Field(default=0.3, ge=0.0, le=2.0)

    # Database
    # Default: SQLite (dev). Override with postgres+asyncpg:// for prod.
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./eagle_ai.db",
        description="Async SQLAlchemy database URL",
    )

    # CORS — allow both CRA (3000) and Vite (5173) dev servers
    ALLOWED_ORIGINS: list[str] = ["https://agentic-travel-ai.vercel.app",]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def llm_configured(self) -> bool:
        return bool(self.GROQ_API_KEY.strip())

    @property
    def sync_database_url(self) -> str:
        """
        Synchronous DB URL for Alembic (which doesn't support async drivers).
        Replaces asyncpg → psycopg2 and aiosqlite → (plain sqlite3).
        """
        url = self.DATABASE_URL
        return (
            url.replace("postgresql+asyncpg", "postgresql+psycopg2")
               .replace("sqlite+aiosqlite", "sqlite")
        )


settings = Settings()
