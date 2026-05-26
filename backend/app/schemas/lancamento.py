from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class LancamentoCreate(BaseModel):
    """Dados para criar um lançamento"""
    tipo: str                          # RECEITA ou DESPESA
    categoria: str                     # SALARIO, ALUGUEL, ALIMENTACAO, etc
    descricao: str
    valor: float
    data: date
    recorrente: Optional[str] = "NAO"  # NAO, MENSAL, ANUAL
    status: Optional[str] = "PAGO"    # PAGO, PENDENTE, CANCELADO
    declarar_ir: Optional[str] = "NAO"
    fonte_pagadora: Optional[str] = None
    cnpj_fonte: Optional[str] = None
    observacoes: Optional[str] = None

class LancamentoUpdate(BaseModel):
    """Dados para atualizar um lançamento"""
    tipo: Optional[str] = None
    categoria: Optional[str] = None
    descricao: Optional[str] = None
    valor: Optional[float] = None
    data: Optional[date] = None
    recorrente: Optional[str] = None
    status: Optional[str] = None
    declarar_ir: Optional[str] = None
    fonte_pagadora: Optional[str] = None
    cnpj_fonte: Optional[str] = None
    observacoes: Optional[str] = None

class LancamentoResponse(BaseModel):
    """Dados que voltam quando consulta um lançamento"""
    id: int
    usuario_id: int
    tipo: str
    categoria: str
    descricao: str
    valor: float
    data: date
    recorrente: str
    status: str
    declarar_ir: str
    fonte_pagadora: Optional[str]
    cnpj_fonte: Optional[str]
    observacoes: Optional[str]
    criado_em: datetime

    class Config:
        from_attributes = True

class ResumoFinanceiro(BaseModel):
    """Resumo financeiro do período"""
    total_receitas: float
    total_despesas: float
    saldo: float
    total_salarios: float
    total_a_declarar_ir: float