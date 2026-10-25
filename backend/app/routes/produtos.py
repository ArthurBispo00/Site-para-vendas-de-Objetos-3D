
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import obter_administrador_atual
from app.database import get_db
from app.models import Administrador, Produto
from app.schemas.produto import ProdutoCreate, ProdutoResponse

router = APIRouter(
    prefix="/produtos",
    tags=["Produtos"],
)


@router.get(
    "",
    response_model=list[ProdutoResponse],
    summary="Listar produtos ativos",
    description=(
        "Retorna todos os produtos ativos do catálogo. "
        "Não exige autenticação."
    ),
    responses={
        200: {"description": "Lista de produtos retornada com sucesso."},
    },
)
def listar_produtos(db: Session = Depends(get_db)):
    consulta = select(Produto).where(Produto.ativo.is_(True))
    return db.scalars(consulta).all()


@router.post(
    "",
    response_model=ProdutoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar produto",
    description="Cadastra um produto no catálogo. Exige token JWT de administrador.",
    responses={
        201: {"description": "Produto cadastrado com sucesso."},
        401: {"description": "Autenticação ausente ou token inválido."},
        422: {"description": "Dados do produto inválidos."},
    },
)
def cadastrar_produto(
    dados: ProdutoCreate,
    db: Session = Depends(get_db),
    administrador: Administrador = Depends(obter_administrador_atual),
):
    produto = Produto(**dados.model_dump())

    db.add(produto)
    db.commit()
    db.refresh(produto)

    return produto


@router.put(
    "/{produto_id}",
    response_model=ProdutoResponse,
    summary="Editar produto",
    description=(
        "Atualiza os dados de um produto ativo. "
        "Exige token JWT de administrador."
    ),
    responses={
        200: {"description": "Produto atualizado com sucesso."},
        401: {"description": "Autenticação ausente ou token inválido."},
        404: {"description": "Produto não encontrado ou inativo."},
        422: {"description": "ID ou dados do produto inválidos."},
    },
)
def editar_produto(
    produto_id: int,
    dados: ProdutoCreate,
    db: Session = Depends(get_db),
    administrador: Administrador = Depends(obter_administrador_atual),
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


@router.delete(
    "/{produto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Desativar produto",
    description=(
        "Desativa um produto do catálogo sem removê-lo fisicamente "
        "do banco de dados. Exige token JWT de administrador."
    ),
    responses={
        204: {"description": "Produto desativado com sucesso."},
        401: {"description": "Autenticação ausente ou token inválido."},
        404: {"description": "Produto não encontrado ou já inativo."},
        422: {"description": "ID do produto inválido."},
    },
)
def excluir_produto(
    produto_id: int,
    db: Session = Depends(get_db),
    administrador: Administrador = Depends(obter_administrador_atual),
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
