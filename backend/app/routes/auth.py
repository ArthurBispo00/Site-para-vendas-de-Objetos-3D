
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import verificar_senha, criar_token_acesso
from app.database import get_db
from app.models import Administrador
from app.schemas.auth import TokenResponse

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login", response_model=TokenResponse)
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
