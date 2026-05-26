from sqlalchemy.orm import Session
from sqlalchemy import extract
from typing import Optional
from app.models.lancamento import Lancamento

def criar(db: Session, usuario_id: int, dados: dict):
    """Cria um novo lançamento"""
    lancamento = Lancamento(usuario_id=usuario_id, **dados)
    db.add(lancamento)
    db.commit()
    db.refresh(lancamento)
    return lancamento

def listar(
    db: Session,
    usuario_id: int,
    tipo: Optional[str] = None,
    categoria: Optional[str] = None,
    mes: Optional[int] = None,
    ano: Optional[int] = None,
    skip: int = 0,
    limit: int = 100
):
    """Lista lançamentos com filtros"""
    query = db.query(Lancamento).filter(Lancamento.usuario_id == usuario_id)

    if tipo:
        query = query.filter(Lancamento.tipo == tipo)
    if categoria:
        query = query.filter(Lancamento.categoria == categoria)
    if mes:
        query = query.filter(extract('month', Lancamento.data) == mes)
    if ano:
        query = query.filter(extract('year', Lancamento.data) == ano)

    return query.order_by(Lancamento.data.desc()).offset(skip).limit(limit).all()

def buscar_por_id(db: Session, lancamento_id: int, usuario_id: int):
    """Busca um lançamento pelo ID"""
    return db.query(Lancamento).filter(
        Lancamento.id == lancamento_id,
        Lancamento.usuario_id == usuario_id
    ).first()

def atualizar(db: Session, lancamento: Lancamento, dados: dict):
    """Atualiza um lançamento"""
    for campo, valor in dados.items():
        if valor is not None:
            setattr(lancamento, campo, valor)
    db.commit()
    db.refresh(lancamento)
    return lancamento

def deletar(db: Session, lancamento: Lancamento):
    """Deleta um lançamento"""
    db.delete(lancamento)
    db.commit()

def resumo_por_periodo(db: Session, usuario_id: int, mes: int, ano: int):
    """Calcula resumo financeiro do período"""
    lancamentos = listar(db, usuario_id, mes=mes, ano=ano, limit=9999)

    total_receitas = sum(l.valor for l in lancamentos if l.tipo == "RECEITA")
    total_despesas = sum(l.valor for l in lancamentos if l.tipo == "DESPESA")
    total_salarios = sum(
        l.valor for l in lancamentos
        if l.tipo == "RECEITA" and l.categoria == "SALARIO"
    )
    total_a_declarar_ir = sum(
        l.valor for l in lancamentos
        if l.declarar_ir == "SIM"
    )

    return {
        "total_receitas": total_receitas,
        "total_despesas": total_despesas,
        "saldo": total_receitas - total_despesas,
        "total_salarios": total_salarios,
        "total_a_declarar_ir": total_a_declarar_ir
    }