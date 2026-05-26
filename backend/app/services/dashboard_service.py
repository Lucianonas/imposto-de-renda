from sqlalchemy.orm import Session
from datetime import datetime, date
from app.repositories import lancamento_repository, operacao_repository
from app.calculations.preco_medio import calcular_preco_medio

def get_resumo_dashboard(db: Session, usuario_id: int):
    """Monta o resumo completo do dashboard"""
    hoje = datetime.now()
    mes_atual = hoje.month
    ano_atual = hoje.year

    # Resumo financeiro do mês atual
    resumo_mes = lancamento_repository.resumo_por_periodo(
        db, usuario_id, mes_atual, ano_atual
    )

    # Todas as operações de investimentos
    todas_operacoes = operacao_repository.listar(db, usuario_id, limit=9999)

    # Calcula lucro e prejuízo total de investimentos
    lucro_total = sum(
        op.lucro_prejuizo for op in todas_operacoes
        if op.lucro_prejuizo and op.lucro_prejuizo > 0
    )
    prejuizo_total = sum(
        op.lucro_prejuizo for op in todas_operacoes
        if op.lucro_prejuizo and op.lucro_prejuizo < 0
    )
    imposto_mes = sum(
        op.imposto_devido for op in todas_operacoes
        if op.imposto_devido and
        op.data.month == mes_atual and
        op.data.year == ano_atual
    )

    # Calcula patrimônio total em investimentos
    tickers = operacao_repository.listar_tickers_unicos(db, usuario_id)
    posicoes = []
    patrimonio_investimentos = 0.0

    for ticker, categoria in tickers:
        ops = operacao_repository.listar_por_ticker(db, usuario_id, ticker)
        calculo = calcular_preco_medio(ops)
        if calculo["quantidade_atual"] > 0:
            patrimonio_investimentos += calculo["total_investido"]
            posicoes.append({
                "ticker": ticker,
                "categoria": categoria,
                "quantidade_atual": calculo["quantidade_atual"],
                "preco_medio": calculo["preco_medio"],
                "total_investido": calculo["total_investido"]
            })

    # Patrimônio total = saldo financeiro + investimentos
    patrimonio_total = resumo_mes["saldo"] + patrimonio_investimentos

    # Evolução mensal dos últimos 6 meses
    evolucao = []
    for i in range(5, -1, -1):
        mes = mes_atual - i
        ano = ano_atual
        if mes <= 0:
            mes += 12
            ano -= 1

        resumo = lancamento_repository.resumo_por_periodo(db, usuario_id, mes, ano)
        evolucao.append({
            "mes": f"{mes:02d}/{ano}",
            "receitas": resumo["total_receitas"],
            "despesas": resumo["total_despesas"],
            "saldo": resumo["saldo"],
            "patrimonio": resumo["saldo"] + patrimonio_investimentos
        })

    # Últimas operações e lançamentos
    ultimas_operacoes = [
        {
            "id": op.id,
            "ticker": op.ticker,
            "tipo": op.tipo,
            "quantidade": op.quantidade,
            "preco_unitario": op.preco_unitario,
            "total": op.total,
            "data": str(op.data)
        }
        for op in todas_operacoes[:5]
    ]

    ultimos_lancamentos = operacao_repository.listar(db, usuario_id, limit=5)
    lancamentos_lista = lancamento_repository.listar(db, usuario_id, limit=5)
    ultimos_lancamentos_fmt = [
        {
            "id": l.id,
            "descricao": l.descricao,
            "tipo": l.tipo,
            "valor": l.valor,
            "data": str(l.data),
            "categoria": l.categoria
        }
        for l in lancamentos_lista
    ]

    return {
        "patrimonio_total": round(patrimonio_total, 2),
        "saldo_mes_atual": round(resumo_mes["saldo"], 2),
        "total_receitas_mes": round(resumo_mes["total_receitas"], 2),
        "total_despesas_mes": round(resumo_mes["total_despesas"], 2),
        "lucro_investimentos": round(lucro_total, 2),
        "prejuizo_investimentos": round(prejuizo_total, 2),
        "imposto_devido_mes": round(imposto_mes, 2),
        "total_a_declarar_ir": round(resumo_mes["total_a_declarar_ir"], 2),
        "evolucao_mensal": evolucao,
        "posicoes": posicoes,
        "ultimas_operacoes": ultimas_operacoes,
        "ultimos_lancamentos": ultimos_lancamentos_fmt
    }

def get_relatorio_mensal(db: Session, usuario_id: int, mes: int, ano: int):
    """Gera relatório mensal completo"""
    resumo = lancamento_repository.resumo_por_periodo(db, usuario_id, mes, ano)

    operacoes_mes = operacao_repository.listar(db, usuario_id, mes=mes, ano=ano, limit=9999)

    lucro = sum(
        op.lucro_prejuizo for op in operacoes_mes
        if op.lucro_prejuizo and op.lucro_prejuizo > 0
    )
    prejuizo = sum(
        op.lucro_prejuizo for op in operacoes_mes
        if op.lucro_prejuizo and op.lucro_prejuizo < 0
    )
    imposto = sum(
        op.imposto_devido for op in operacoes_mes
        if op.imposto_devido
    )
    total_investido = sum(
        op.total for op in operacoes_mes
        if op.tipo == "COMPRA"
    )

    return {
        "mes": mes,
        "ano": ano,
        "total_receitas": resumo["total_receitas"],
        "total_despesas": resumo["total_despesas"],
        "saldo": resumo["saldo"],
        "total_salarios": resumo["total_salarios"],
        "total_investido": total_investido,
        "lucro_realizado": lucro,
        "prejuizo_realizado": prejuizo,
        "imposto_devido": imposto,
        "a_declarar_ir": resumo["total_a_declarar_ir"]
    }

def gerar_darf(db: Session, usuario_id: int, mes: int, ano: int):
    """Gera os dados da DARF do mês"""
    from calendar import monthrange

    operacoes_mes = operacao_repository.listar(
        db, usuario_id, mes=mes, ano=ano, limit=9999
    )

    imposto_total = sum(
        op.imposto_devido for op in operacoes_mes
        if op.imposto_devido and op.imposto_devido > 0
    )

    prejuizo_compensado = sum(
        abs(op.lucro_prejuizo) for op in operacoes_mes
        if op.lucro_prejuizo and op.lucro_prejuizo < 0
    )

    # Vencimento é sempre último dia útil do mês seguinte
    ultimo_dia = monthrange(ano, mes % 12 + 1)[1]
    mes_venc = mes % 12 + 1
    ano_venc = ano if mes < 12 else ano + 1

    return {
        "mes_referencia": f"{mes:02d}/{ano}",
        "codigo_receita": "6015",
        "imposto_devido": round(imposto_total, 2),
        "prejuizo_compensado": round(prejuizo_compensado, 2),
        "vencimento": f"{ultimo_dia:02d}/{mes_venc:02d}/{ano_venc}",
        "status": "PENDENTE" if imposto_total > 0 else "SEM_IMPOSTO"
    }