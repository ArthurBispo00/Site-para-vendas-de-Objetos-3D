
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import verificar_senha, criar_token_acesso
from app.database import get_db
from app.models import Administrador
from app.schemas.auth import TokenResponse

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Autenticar administrador",
    description="""
Valida as credenciais do administrador e retorna um token JWT.

### Como utilizar

1. Informe o usuário e a senha nos campos abaixo.
2. Execute a requisição.
3. Copie o `access_token` retornado ou utilize o botão **Authorize**
   do Swagger para autenticar as operações administrativas.

O token possui validade de 60 minutos.
""",
    responses={
        200: {"description": "Autenticação realizada com sucesso."},
        401: {"description": "Usuário ou senha inválidos."},
        422: {"description": "Dados de autenticação ausentes ou inválidos."},
    },
)
def login(
    formulario: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    consulta = select(Administrador).where(
        Administrador.usuario == formulario.username
    )
    administrador = db.scalars(consulta).first()

    if (
        administrador is None
        or not verificar_senha(
            formulario.password,
            administrador.senha_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha inválidos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = criar_token_acesso(administrador.usuario)

    return {
        "access_token": token,
        "token_type": "bearer",
    }
