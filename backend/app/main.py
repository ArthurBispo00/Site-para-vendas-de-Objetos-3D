from fastapi import FastAPI

from app.routes.produtos import router as produtos_router

app = FastAPI(
    title="Jaca 3D API",
    description="API do catálogo virtual de produtos impressos em 3D.",
    version="1.0.0",
)


@app.get("/health", tags=["Monitoramento"])
def health_check():
    return {
        "status": "ok",
        "message": "API Jaca 3D funcionando",
    }


app.include_router(produtos_router)
