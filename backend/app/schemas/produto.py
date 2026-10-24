from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProdutoBase(BaseModel):
    nome: str = Field(min_length=1, max_length=150)
    descricao: str = Field(min_length=1)
    categoria: str = Field(min_length=1, max_length=100)
    gramatura: str = Field(min_length=1, max_length=50)
    preco: float = Field(gt=0)
    imagem_url: str | None = Field(default=None, max_length=500)


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoResponse(ProdutoBase):
    id: int
    ativo: bool
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)
