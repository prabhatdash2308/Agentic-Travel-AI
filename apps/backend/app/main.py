from fastapi import FastAPI

app = FastAPI(title="Agentic Travel AI")


@app.get("/")
def root():
    return {
        "message": "Backend Running 🚀"
    }