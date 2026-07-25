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
    APP_NAME: str = "Agentic Travel AI"
    APP_VERSION: str = "0.1.0"
    APP_ENV: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = Field(default=True)

    # Logging
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    # Google Generative AI
    GOOGLE_API_KEY: str = Field(default="", description="Google Generative AI API key")
    GEMINI_MODEL: str = Field(default="gemini-2.0-flash", description="Gemini model identifier")
    LLM_TEMPERATURE: float = Field(default=0.7, ge=0.0, le=2.0)

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def llm_configured(self) -> bool:
        return bool(self.GOOGLE_API_KEY.strip())


settings = Settings()
