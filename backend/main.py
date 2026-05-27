from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Importa os models
from app.models import usuario, operacao, lancamento, darf

# Importa as rotas
from app.routes import auth, lancamentos, operacoes, dashboard

# Cria as tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Financeiro App",
    description="Sistema completo de gestão financeira e IR",
    version="1.0.0"
)



#Conectando banco de dados local com o online





# Pega a variável de ambiente ALLOWED_ORIGINS
# Se não tiver definida, usa o localhost como padrão
# Em produção o Render vai fornecer a URL da Vercel
origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,https://imposto-de-renda-wheat.vercel.app"
).split(",")

# CORS — permite que o frontend acesse o backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registra as rotas
app.include_router(auth.router)
app.include_router(lancamentos.router)
app.include_router(operacoes.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"status": "ok", "mensagem": "Backend funcionando!"}