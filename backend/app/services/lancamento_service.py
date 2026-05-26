from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories import lancamento_repository
from app.schemas.lancamento import LancamentoCreate, LancamentoUpdate

# Categorias válidas
CATEGORIAS_RECEITA = [
    "SALARIO", "FREELANCE", "ALUGUEL_RECEBIDO", "DIVIDENDOS",
    "RENDIMENTOS", "PENSAO", "OUTROS_RECEITA"
]

CATEGORIAS_DESPESA = [
    "ALUGUEL", "ALIMENTACAO", "TRANSPORTE", "SAUDE",
    "EDUCACAO", "LAZER", "VESTUARIO", "CONTAS",
    "CARTAO_CREDITO", "EMPRESTIMO", "OUTROS_DESPESA"
]

def criar_lancamento(db: Session, usuario_id: int, dados: LancamentoCreate):
    """Cria um novo lançamento com validações"""

    # Valida o tipo
    if dados.tipo not in ["RECEITA", "DESPESA"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo deve ser RECEITA ou DESPESA"
        )

    # Valida o valor
    if dados.valor <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valor deve ser maior que zero"
        )

    return lancamento_repository.criar(db, usuario_id, dados.model_dump())

def listar_lancamentos(
    db: Session,
    usuario_id: int,
    tipo: str = None,
    categoria: str = None,
    mes: int = None,
    ano: int = None
):
    """Lista lançamentos com filtros"""
    return lancamento_repository.listar(db, usuario_id, tipo, categoria, mes, ano)

def buscar_lancamento(db: Session, lancamento_id: int, usuario_id: int):
    """Busca um lançamento pelo ID"""
    lancamento = lancamento_repository.buscar_por_id(db, lancamento_id, usuario_id)
    if not lancamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lançamento não encontrado"
        )
    return lancamento

def atualizar_lancamento(
    db: Session,
    lancamento_id: int,
    usuario_id: int,
    dados: LancamentoUpdate
):
    """Atualiza um lançamento"""
    lancamento = buscar_lancamento(db, lancamento_id, usuario_id)
    dados_dict = {k: v for k, v in dados.model_dump().items() if v is not None}
    return lancamento_repository.atualizar(db, lancamento, dados_dict)

def deletar_lancamento(db: Session, lancamento_id: int, usuario_id: int):
    """Deleta um lançamento"""
    lancamento = buscar_lancamento(db, lancamento_id, usuario_id)
    lancamento_repository.deletar(db, lancamento)
    return {"mensagem": "Lançamento deletado com sucesso"}

def resumo_financeiro(db: Session, usuario_id: int, mes: int, ano: int):
    """Retorna resumo financeiro do período"""
    return lancamento_repository.resumo_por_periodo(db, usuario_id, mes, ano)