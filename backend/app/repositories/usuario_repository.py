from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.utils.seguranca import criar_hash_senha

def buscar_por_email(db: Session, email: str):
    """Busca um usuário pelo email"""
    return db.query(Usuario).filter(Usuario.email == email).first()

def buscar_por_id(db: Session, usuario_id: int):
    """Busca um usuário pelo ID"""
    return db.query(Usuario).filter(Usuario.id == usuario_id).first()

def criar_usuario(db: Session, nome: str, email: str, senha: str):
    """Cria um novo usuário no banco"""
    senha_hash = criar_hash_senha(senha)
    usuario = Usuario(
        nome=nome,
        email=email,
        senha_hash=senha_hash
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario