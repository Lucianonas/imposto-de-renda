from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.operacao import OperacaoCreate, OperacaoUpdate, OperacaoResponse
from app.services import operacao_service
from app.utils.dependencias import get_usuario_atual

router = APIRouter(prefix="/operacoes", tags=["Operações de Investimentos"])

@router.post("/", response_model=OperacaoResponse)
def criar(
    dados: OperacaoCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Cria uma nova operação de investimento"""
    return operacao_service.criar_operacao(db, usuario.id, dados)

@router.get("/", response_model=List[OperacaoResponse])
def listar(
    ticker: Optional[str] = Query(None),
    categoria: Optional[str] = Query(None),
    tipo: Optional[str] = Query(None),
    mes: Optional[int] = Query(None),
    ano: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Lista todas as operações com filtros opcionais"""
    return operacao_service.listar_operacoes(
        db, usuario.id, ticker, categoria, tipo, mes, ano
    )

@router.get("/resumo")
def resumo(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Retorna resumo de posição por ticker"""
    return operacao_service.resumo_por_ticker(db, usuario.id)

@router.get("/{operacao_id}", response_model=OperacaoResponse)
def buscar(
    operacao_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Busca uma operação pelo ID"""
    return operacao_service.buscar_operacao(db, operacao_id, usuario.id)

@router.put("/{operacao_id}", response_model=OperacaoResponse)
def atualizar(
    operacao_id: int,
    dados: OperacaoUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Atualiza uma operação"""
    return operacao_service.atualizar_operacao(db, operacao_id, usuario.id, dados)

@router.delete("/{operacao_id}")
def deletar(
    operacao_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Deleta uma operação"""
    return operacao_service.deletar_operacao(db, operacao_id, usuario.id)