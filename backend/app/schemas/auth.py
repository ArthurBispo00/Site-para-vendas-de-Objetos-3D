
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    usuario: str = Field(min_length=1, max_length=100)
    senha: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
