
from sqlalchemy import select

from app.database import SessionLocal
from app.models import Administrador
from app.core.security import gerar_hash_senha


def criar_administrador_inicial():
    db = SessionLocal()

    try:
        consulta = select(Administrador).where(
            Administrador.usuario == "admin"
        )
        administrador = db.scalars(consulta).first()

        if administrador is None:
            administrador = Administrador(
                usuario="admin",
                senha_hash=gerar_hash_senha("admin"),
            )
            db.add(administrador)
            db.commit()
            print("Administrador inicial criado.")
        else:
            print("Administrador inicial já existe.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()
