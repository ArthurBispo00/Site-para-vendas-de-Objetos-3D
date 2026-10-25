import os

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.initial_data import criar_administrador_inicial
from app.routes.auth import router as auth_router
from app.routes.produtos import router as produtos_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("APP_ENV") != "test":
        criar_administrador_inicial()
    yield


app = FastAPI(
    title="Jaca 3D API",
    summary="API para gerenciamento do catálogo de produtos impressos em 3D.",
    description="""
## Sobre a API

A API Jaca 3D fornece acesso ao catálogo de produtos impressos em 3D.

### Funcionalidades

- Consulta pública de produtos ativos.
- Cadastro, edição e desativação de produtos.
- Autenticação de administrador por JWT.
- Documentação interativa para testes das operações.

### Autenticação

As operações administrativas exigem um token JWT obtido pelo endpoint
`POST /auth/login`. Utilize o botão **Authorize** para autenticar no Swagger.
""",
    version="1.0.0",
    contact={
        "name": "Equipe Jaca 3D",
    },
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/health",
    tags=["Monitoramento"],
    summary="Verificar disponibilidade da API",
    description="Verifica se a aplicação está respondendo às requisições.",
    response_description="Estado atual da aplicação",
)
def health_check():
    return {
        "status": "ok",
        "message": "API Jaca 3D funcionando",
    }


app.include_router(produtos_router)
app.include_router(auth_router)
