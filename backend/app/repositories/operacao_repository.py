from sqlalchemy.orm import Session
from sqlalchemy import extract
from typing import Optional
from app.models.operacao import Operacao

def criar(db: Session, usuario_id: int, dados: dict):
    """Cria uma nova operação"""
    operacao = Operacao(usuario_id=usuario_id, **dados)
    db.add(operacao)
    db.commit()
    db.refresh(operacao)
    return operacao

def listar(
    db: Session,
    usuario_id: int,
    ticker: Optional[str] = None,
    categoria: Optional[str] = None,
    tipo: Optional[str] = None,
    mes: Optional[int] = None,
    ano: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
):
    """Lista operações com filtros"""
    query = db.query(Operacao).filter(Operacao.usuario_id == usuario_id)

    if ticker:
        query = query.filter(Operacao.ticker == ticker.upper())
    if categoria:
        query = query.filter(Operacao.categoria == categoria)
    if tipo:
        query = query.filter(Operacao.tipo == tipo)
    if mes:
        query = query.filter(extract('month', Operacao.data) == mes)
    if ano:
        query = query.filter(extract('year', Operacao.data) == ano)

    return query.order_by(Operacao.data.desc()).offset(skip).limit(limit).all()

def listar_por_ticker(db: Session, usuario_id: int, ticker: str):
    """Lista todas as operações de um ticker específico"""
    return db.query(Operacao).filter(
        Operacao.usuario_id == usuario_id,
        Operacao.ticker == ticker.upper()
    ).order_by(Operacao.data.asc()).all()

def buscar_por_id(db: Session, operacao_id: int, usuario_id: int):
    """Busca uma operação pelo ID"""
    return db.query(Operacao).filter(
        Operacao.id == operacao_id,
        Operacao.usuario_id == usuario_id
    ).first()

def atualizar(db: Session, operacao: Operacao, dados: dict):
    """Atualiza uma operação"""
    for campo, valor in dados.items():
        if valor is not None:
            setattr(operacao, campo, valor)
    db.commit()
    db.refresh(operacao)
    return operacao

def deletar(db: Session, operacao: Operacao):
    """Deleta uma operação"""
    db.delete(operacao)
    db.commit()

def listar_tickers_unicos(db: Session, usuario_id: int):
    """Lista todos os tickers únicos do usuário"""
    resultado = db.query(Operacao.ticker, Operacao.categoria).filter(
        Operacao.usuario_id == usuario_id
    ).distinct().all()
    return resultado