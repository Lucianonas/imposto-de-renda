from typing import List
from datetime import date

# Alíquotas
ALIQUOTA_SWING_TRADE = 0.15      # 15%
ALIQUOTA_DAY_TRADE = 0.20        # 20%
ALIQUOTA_FII = 0.20              # 20%
ALIQUOTA_CRIPTO = 0.15           # 15%
ISENCAO_SWING_TRADE = 20000.00   # Isenção até R$ 20.000 por mês

def calcular_lucro_venda(
    preco_venda: float,
    quantidade: float,
    preco_medio: float,
    taxas: float
) -> float:
    """Calcula o lucro ou prejuízo de uma venda"""
    receita = preco_venda * quantidade
    custo = preco_medio * quantidade
    lucro = receita - custo - taxas
    return round(lucro, 2)

def calcular_imposto_swing_trade(
    lucro: float,
    total_vendas_mes: float,
    prejuizo_acumulado: float = 0.0
) -> float:
    """
    Calcula imposto para Swing Trade
    - Isento se vendas mensais <= R$ 20.000
    - 15% sobre o lucro após compensar prejuízos
    """
    # Verifica isenção
    if total_vendas_mes <= ISENCAO_SWING_TRADE:
        return 0.0

    # Compensa prejuízo acumulado
    lucro_liquido = lucro - prejuizo_acumulado
    if lucro_liquido <= 0:
        return 0.0

    return round(lucro_liquido * ALIQUOTA_SWING_TRADE, 2)

def calcular_imposto_day_trade(
    lucro: float,
    prejuizo_acumulado: float = 0.0
) -> float:
    """Calcula imposto para Day Trade — 20% sem isenção"""
    lucro_liquido = lucro - prejuizo_acumulado
    if lucro_liquido <= 0:
        return 0.0
    return round(lucro_liquido * ALIQUOTA_DAY_TRADE, 2)

def calcular_imposto_fii(
    lucro: float,
    prejuizo_acumulado: float = 0.0
) -> float:
    """Calcula imposto para FIIs — 20% sem isenção"""
    lucro_liquido = lucro - prejuizo_acumulado
    if lucro_liquido <= 0:
        return 0.0
    return round(lucro_liquido * ALIQUOTA_FII, 2)

def calcular_imposto_cripto(
    lucro: float,
    total_vendas_mes: float,
    prejuizo_acumulado: float = 0.0
) -> float:
    """Calcula imposto para Criptomoedas — 15% sem isenção"""
    lucro_liquido = lucro - prejuizo_acumulado
    if lucro_liquido <= 0:
        return 0.0
    return round(lucro_liquido * ALIQUOTA_CRIPTO, 2)

def calcular_imposto_por_categoria(
    categoria: str,
    lucro: float,
    total_vendas_mes: float,
    prejuizo_acumulado: float = 0.0
) -> float:
    """Calcula imposto baseado na categoria do ativo"""
    if categoria in ["ACAO", "ETF", "BDR"]:
        return calcular_imposto_swing_trade(lucro, total_vendas_mes, prejuizo_acumulado)
    elif categoria == "FII":
        return calcular_imposto_fii(lucro, prejuizo_acumulado)
    elif categoria == "CRIPTO":
        return calcular_imposto_cripto(lucro, total_vendas_mes, prejuizo_acumulado)
    else:
        return 0.0