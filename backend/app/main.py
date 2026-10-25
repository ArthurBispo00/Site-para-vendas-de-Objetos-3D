from fastapi import FastAPI

from app.routes.produtos import router as produtos_router

from app.routes.auth import router as auth_router

from contextlib import asynccontextmanager

from app.initial_data import criar_administrador_inicial

@asynccontextmanager
async def lifespan(app: FastAPI):
    criar_administrador_inicial()
    yield

app = FastAPI(
    title="Jaca 3D API",
    description="API do catálogo virtual de produtos impressos em 3D.",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/health", tags=["Monitoramento"])
def health_check():
    return {
        "status": "ok",
        "message": "API Jaca 3D funcionando",
    }


app.include_router(produtos_router)
app.include_router(auth_router)
