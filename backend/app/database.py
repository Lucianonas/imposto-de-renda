import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

# Pega a URL do banco das variáveis de ambiente
# Em produção usa o PostgreSQL do Render
# Em desenvolvimento usa o PostgreSQL do Render também
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./financeiro.db"
)

# O Render fornece a URL com "postgres://"
# mas o SQLAlchemy precisa de "postgresql://"
# Esse trecho corrige isso automaticamente
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace(
        "postgres://", "postgresql://", 1
    )

# Se for SQLite usa configuração especial
# Se for PostgreSQL usa configuração padrão
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Função que abre e fecha a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()