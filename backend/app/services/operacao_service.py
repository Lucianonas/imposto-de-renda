from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories import operacao_repository
from app.schemas.operacao import OperacaoCreate, OperacaoUpdate
from app.calculations.preco_medio import calcular_preco_medio
from app.calculations.imposto import calcular_lucro_venda, calcular_imposto_por_categoria

def criar_operacao(db: Session, usuario_id: int, dados: OperacaoCreate):
    """Cria uma nova operação com cálculos automáticos"""

    # Valida tipo
    if dados.tipo not in ["COMPRA", "VENDA"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo deve ser COMPRA ou VENDA"
        )

    # Calcula o total
    total = (dados.quantidade * dados.preco_unitario) + (dados.taxas or 0)

    # Busca operações anteriores do ticker para calcular preço médio
    operacoes_anteriores = operacao_repository.listar_por_ticker(
        db, usuario_id, dados.ticker
    )

    # Calcula preço médio atual
    calculo = calcular_preco_medio(operacoes_anteriores)
    preco_medio = calculo["preco_medio"]

    # Calcula lucro/prejuízo e imposto se for venda
    lucro_prejuizo = None
    imposto_devido = None

    if dados.tipo == "VENDA" and preco_medio > 0:
        lucro_prejuizo = calcular_lucro_venda(
            dados.preco_unitario,
            dados.quantidade,
            preco_medio,
            dados.taxas or 0
        )

        # Calcula total de vendas do mês para verificar isenção
        from sqlalchemy import extract
        vendas_mes = [
            op for op in operacoes_anteriores
            if op.tipo == "VENDA"
            and op.data.month == dados.data.month
            and op.data.year == dados.data.year
        ]
        total_vendas_mes = sum(op.total for op in vendas_mes) + total

        imposto_devido = calcular_imposto_por_categoria(
            dados.categoria,
            lucro_prejuizo,
            total_vendas_mes
        )

    # Monta os dados para salvar
    dados_dict = dados.model_dump()
    dados_dict["ticker"] = dados.ticker.upper()
    dados_dict["total"] = total
    dados_dict["preco_medio"] = preco_medio
    dados_dict["lucro_prejuizo"] = lucro_prejuizo
    dados_dict["imposto_devido"] = imposto_devido

    return operacao_repository.criar(db, usuario_id, dados_dict)

def listar_operacoes(
    db: Session,
    usuario_id: int,
    ticker: str = None,
    categoria: str = None,
    tipo: str = None,
    mes: int = None,
    ano: int = None
):
    """Lista operações com filtros"""
    return operacao_repository.listar(
        db, usuario_id, ticker, categoria, tipo, mes, ano
    )

def buscar_operacao(db: Session, operacao_id: int, usuario_id: int):
    """Busca uma operação pelo ID"""
    operacao = operacao_repository.buscar_por_id(db, operacao_id, usuario_id)
    if not operacao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operação não encontrada"
        )
    return operacao

def atualizar_operacao(
    db: Session,
    operacao_id: int,
    usuario_id: int,
    dados: OperacaoUpdate
):
    """Atualiza uma operação"""
    operacao = buscar_operacao(db, operacao_id, usuario_id)
    dados_dict = {k: v for k, v in dados.model_dump().items() if v is not None}
    return operacao_repository.atualizar(db, operacao, dados_dict)

def deletar_operacao(db: Session, operacao_id: int, usuario_id: int):
    """Deleta uma operação"""
    operacao = buscar_operacao(db, operacao_id, usuario_id)
    operacao_repository.deletar(db, operacao)
    return {"mensagem": "Operação deletada com sucesso"}

def resumo_por_ticker(db: Session, usuario_id: int):
    """Retorna resumo de posição por ticker"""
    tickers = operacao_repository.listar_tickers_unicos(db, usuario_id)
    resumo = []

    for ticker, categoria in tickers:
        operacoes = operacao_repository.listar_por_ticker(db, usuario_id, ticker)
        calculo = calcular_preco_medio(operacoes)

        lucro_realizado = sum(
            op.lucro_prejuizo for op in operacoes
            if op.lucro_prejuizo is not None
        )
        imposto_total = sum(
            op.imposto_devido for op in operacoes
            if op.imposto_devido is not None
        )

        resumo.append({
            "ticker": ticker,
            "categoria": categoria,
            "quantidade_atual": calculo["quantidade_atual"],
            "preco_medio": calculo["preco_medio"],
            "total_investido": calculo["total_investido"],
            "lucro_prejuizo_realizado": lucro_realizado,
            "imposto_devido": imposto_total
        })

    return resumo