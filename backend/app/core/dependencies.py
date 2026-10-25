
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decodificar_token
from app.database import get_db
from app.models import Administrador

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def obter_administrador_atual(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Administrador:
    erro_autenticacao = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decodificar_token(token)
        usuario = payload.get("sub")

        if not usuario:
            raise erro_autenticacao

    except (InvalidTokenError, ValueError, TypeError):
        raise erro_autenticacao

    consulta = select(Administrador).where(
        Administrador.usuario == usuario
    )
    administrador = db.scalars(consulta).first()

    if administrador is None:
        raise erro_autenticacao

    return administrador
