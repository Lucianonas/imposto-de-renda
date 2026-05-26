from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import dashboard_service
from app.utils.dependencias import get_usuario_atual

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/resumo")
def resumo(
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Retorna resumo completo do dashboard"""
    return dashboard_service.get_resumo_dashboard(db, usuario.id)

@router.get("/relatorio/mensal")
def relatorio_mensal(
    mes: int = Query(..., description="Mês 1 a 12"),
    ano: int = Query(..., description="ex: 2026"),
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Retorna relatório mensal completo"""
    return dashboard_service.get_relatorio_mensal(db, usuario.id, mes, ano)

@router.get("/darf")
def darf(
    mes: int = Query(..., description="Mês 1 a 12"),
    ano: int = Query(..., description="ex: 2026"),
    db: Session = Depends(get_db),
    usuario=Depends(get_usuario_atual)
):
    """Gera dados da DARF do mês"""
    return dashboard_service.gerar_darf(db, usuario.id, mes, ano)