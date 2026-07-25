from fastapi import FastAPI

app = FastAPI(title="DocuMind AI Service")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "documind-ai-service"}