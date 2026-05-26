from typing import List

def calcular_preco_medio(operacoes: List) -> dict:
    """
    Calcula o preço médio de um ativo baseado nas operações de compra.
    Retorna quantidade atual, preço médio e total investido.
    """
    quantidade_atual = 0.0
    total_investido = 0.0

    for op in sorted(operacoes, key=lambda x: x.data):
        if op.tipo == "COMPRA":
            total_investido += (op.quantidade * op.preco_unitario) + op.taxas
            quantidade_atual += op.quantidade
        elif op.tipo == "VENDA":
            if quantidade_atual > 0:
                # Preço médio atual antes da venda
                preco_medio_atual = total_investido / quantidade_atual
                # Reduz o total investido proporcionalmente
                total_investido -= preco_medio_atual * op.quantidade
                quantidade_atual -= op.quantidade

    preco_medio = total_investido / quantidade_atual if quantidade_atual > 0 else 0.0

    return {
        "quantidade_atual": round(quantidade_atual, 8),
        "preco_medio": round(preco_medio, 6),
        "total_investido": round(total_investido, 2)
    }