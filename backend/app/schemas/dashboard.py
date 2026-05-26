from pydantic import BaseModel
from typing import List, Optional

class CardFinanceiro(BaseModel):
    """Card com informação financeira"""
    titulo: str
    valor: float
    variacao: Optional[float] = None

class GraficoPonto(BaseModel):
    """Ponto de um gráfico"""
    mes: str
    receitas: float
    despesas: float
    saldo: float
    patrimonio: float

class ResumoDashboard(BaseModel):
    """Resumo completo do dashboard"""
    # Cards principais
    patrimonio_total: float
    saldo_mes_atual: float
    total_receitas_mes: float
    total_despesas_mes: float
    lucro_investimentos: float
    prejuizo_investimentos: float
    imposto_devido_mes: float
    total_a_declarar_ir: float

    # Listas
    evolucao_mensal: List[GraficoPonto]
    posicoes: List[dict]
    ultimas_operacoes: List[dict]
    ultimos_lancamentos: List[dict]

class RelatorioMensal(BaseModel):
    """Relatório mensal completo"""
    mes: int
    ano: int
    total_receitas: float
    total_despesas: float
    saldo: float
    total_salarios: float
    total_investido: float
    lucro_realizado: float
    prejuizo_realizado: float
    imposto_devido: float
    a_declarar_ir: float

class RelatorioDarf(BaseModel):
    """Dados para geração de DARF"""
    mes_referencia: str
    codigo_receita: str
    imposto_devido: float
    prejuizo_compensado: float
    vencimento: str
    status: str