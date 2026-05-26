from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioLogin, TokenResponse, UsuarioResponse
from app.services import auth_service
from app.utils.dependencias import get_usuario_atual

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/register", response_model=UsuarioResponse)
def registrar(dados: UsuarioCreate, db: Session = Depends(get_db)):
    """Cadastra um novo usuário"""
    return auth_service.registrar_usuario(db, dados.nome, dados.email, dados.senha)

@router.post("/login", response_model=TokenResponse)
def login(dados: UsuarioLogin, db: Session = Depends(get_db)):
    """Faz login e retorna o token JWT"""
    return auth_service.login_usuario(db, dados.email, dados.senha)

@router.get("/me", response_model=UsuarioResponse)
def meu_perfil(usuario_atual=Depends(get_usuario_atual)):
    """Retorna os dados do usuário logado"""
    return usuario_atual