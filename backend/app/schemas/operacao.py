from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class OperacaoCreate(BaseModel):
    """Dados para criar uma operação"""
    tipo: str                            # COMPRA ou VENDA
    categoria: str                       # ACAO, FII, ETF, CRIPTO, BDR, RENDA_FIXA
    ticker: str
    quantidade: float
    preco_unitario: float
    taxas: Optional[float] = 0.0
    data: date
    corretora: Optional[str] = None
    observacoes: Optional[str] = None

class OperacaoUpdate(BaseModel):
    """Dados para atualizar uma operação"""
    tipo: Optional[str] = None
    categoria: Optional[str] = None
    ticker: Optional[str] = None
    quantidade: Optional[float] = None
    preco_unitario: Optional[float] = None
    taxas: Optional[float] = None
    data: Optional[date] = None
    corretora: Optional[str] = None
    observacoes: Optional[str] = None

class OperacaoResponse(BaseModel):
    """Dados que voltam quando consulta uma operação"""
    id: int
    usuario_id: int
    tipo: str
    categoria: str
    ticker: str
    quantidade: float
    preco_unitario: float
    taxas: float
    total: float
    data: date
    corretora: Optional[str]
    observacoes: Optional[str]
    preco_medio: Optional[float]
    lucro_prejuizo: Optional[float]
    imposto_devido: Optional[float]
    criado_em: datetime

    class Config:
        from_attributes = True

class ResumoPorTicker(BaseModel):
    """Resumo de posição por ticker"""
    ticker: str
    categoria: str
    quantidade_atual: float
    preco_medio: float
    total_investido: float
    lucro_prejuizo_realizado: float
    imposto_devido: float