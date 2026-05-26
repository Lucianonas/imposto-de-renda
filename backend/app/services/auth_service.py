from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories import usuario_repository
from app.utils.seguranca import verificar_senha, criar_token_acesso

def registrar_usuario(db: Session, nome: str, email: str, senha: str):
    """Registra um novo usuário"""
    # Verifica se email já existe
    usuario_existente = usuario_repository.buscar_por_email(db, email)
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )

    # Cria o usuário
    usuario = usuario_repository.criar_usuario(db, nome, email, senha)
    return usuario

def login_usuario(db: Session, email: str, senha: str):
    """Faz o login e retorna o token"""
    # Busca o usuário
    usuario = usuario_repository.buscar_por_email(db, email)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

    # Verifica a senha
    if not verificar_senha(senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

    # Verifica se está ativo
    if not usuario.ativo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário inativo"
        )

    # Cria o token
    token = criar_token_acesso({"sub": usuario.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": usuario
    }