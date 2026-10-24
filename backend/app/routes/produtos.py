
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Produto
from app.schemas.produto import ProdutoCreate, ProdutoResponse

from fastapi import HTTPException

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.get("", response_model=list[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db)):
    consulta = select(Produto).where(Produto.ativo.is_(True))
    return db.scalars(consulta).all()


@router.post(
    "",
    response_model=ProdutoResponse,
    status_code=status.HTTP_201_CREATED,
)
def cadastrar_produto(
    dados: ProdutoCreate,
    db: Session = Depends(get_db),
):
    produto = Produto(**dados.model_dump())

    db.add(produto)
    db.commit()
    db.refresh(produto)

    return produto


@router.delete("/{produto_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_produto(
    produto_id: int,
    db: Session = Depends(get_db),
):
    produto = db.get(Produto, produto_id)

    if produto is None or not produto.ativo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado",
        )

    produto.ativo = False
    db.commit()

    return None


@router.put("/{produto_id}", response_model=ProdutoResponse)
def editar_produto(
    produto_id: int,
    dados: ProdutoCreate,
    db: Session = Depends(get_db),
):
    produto = db.get(Produto, produto_id)

    if produto is None or not produto.ativo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado",
        )

    for campo, valor in dados.model_dump().items():
        setattr(produto, campo, valor)

    db.commit()
    db.refresh(produto)

    return produto
