from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UsuarioCreate(BaseModel):
    """Dados para criar um usuário novo"""
    nome: str
    email: EmailStr
    senha: str

class UsuarioLogin(BaseModel):
    """Dados para fazer login"""
    email: EmailStr
    senha: str

class UsuarioResponse(BaseModel):
    """Dados que voltam quando consulta um usuário"""
    id: int
    nome: str
    email: str
    ativo: bool
    criado_em: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Resposta do login com o token"""
    access_token: str
    token_type: str
    usuario: UsuarioResponse