from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.utils.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Configuração do hash de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_senha(senha_plain: str, senha_hash: str) -> bool:
    """Verifica se a senha digitada bate com o hash salvo"""
    return pwd_context.verify(senha_plain, senha_hash)

def criar_hash_senha(senha: str) -> str:
    """Transforma a senha em hash para salvar no banco"""
    return pwd_context.hash(senha)

def criar_token_acesso(dados: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Cria o token JWT"""
    to_encode = dados.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token: str) -> Optional[str]:
    """Verifica se o token é válido e retorna o email do usuário"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None