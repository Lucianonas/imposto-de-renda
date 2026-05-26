from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.lancamento import (
    LancamentoCreate, LancamentoUpdate,
    LancamentoResponse, ResumoFinanceiro
)
from app.services import lancamento_service
from app.utils.dependencias import get_usuario_atual

router = APIRouter(prefix="/lancamentos", tags=["Lançamentos Financeiros"])

@router.post("/", response_model=LancamentoResponse)
def criar(
    dados: LancamentoCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Cria um novo lançamento financeiro"""
    return lancamento_service.criar_lancamento(db, usuario.id, dados)

@router.get("/", response_model=List[LancamentoResponse])
def listar(
    tipo: Optional[str] = Query(None, description="RECEITA ou DESPESA"),
    categoria: Optional[str] = Query(None),
    mes: Optional[int] = Query(None, description="1 a 12"),
    ano: Optional[int] = Query(None, description="ex: 2024"),
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Lista todos os lançamentos com filtros opcionais"""
    return lancamento_service.listar_lancamentos(
        db, usuario.id, tipo, categoria, mes, ano
    )

@router.get("/resumo", response_model=ResumoFinanceiro)
def resumo(
    mes: int = Query(..., description="Mês 1 a 12"),
    ano: int = Query(..., description="ex: 2024"),
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Retorna resumo financeiro do período"""
    return lancamento_service.resumo_financeiro(db, usuario.id, mes, ano)

@router.get("/{lancamento_id}", response_model=LancamentoResponse)
def buscar(
    lancamento_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Busca um lançamento pelo ID"""
    return lancamento_service.buscar_lancamento(db, lancamento_id, usuario.id)

@router.put("/{lancamento_id}", response_model=LancamentoResponse)
def atualizar(
    lancamento_id: int,
    dados: LancamentoUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Atualiza um lançamento"""
    return lancamento_service.atualizar_lancamento(db, lancamento_id, usuario.id, dados)

@router.delete("/{lancamento_id}")
def deletar(
    lancamento_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Deleta um lançamento"""
    return lancamento_service.deletar_lancamento(db, lancamento_id, usuario.id)