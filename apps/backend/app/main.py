from fastapi import FastAPI
from app.api.router import router

app = FastAPI(title="Agentic Travel AI")

app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Backend Running 🚀"
    }