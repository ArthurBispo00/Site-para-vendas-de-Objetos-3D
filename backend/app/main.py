from fastapi import FastAPI

app = FastAPI(
    title="Jaca 3D API",
    description="API do catálogo virtual de produtos impressos em 3D.",
    version="1.0.0",
)


@app.get("/health", tags=["Monitoramento"])
def health_check():
    return {
        "status": "ok",
        "message": "API Jaca 3D funcionando"
    }
