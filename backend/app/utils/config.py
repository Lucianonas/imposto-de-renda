import os
from datetime import timedelta

# Chave secreta para gerar os tokens JWT — obrigatória via variável de ambiente
SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("A variável de ambiente SECRET_KEY não está definida. Configure o arquivo .env.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas