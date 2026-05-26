from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Operacao(Base):
    __tablename__ = "operacoes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    # Dados da operação
    tipo = Column(String, nullable=False)        # COMPRA ou VENDA
    categoria = Column(String, nullable=False)   # ACAO, FII, ETF, CRIPTO, BDR, RENDA_FIXA
    ticker = Column(String, nullable=False)      # ex: PETR4, MXRF11
    quantidade = Column(Float, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    taxas = Column(Float, default=0.0)
    total = Column(Float, nullable=False)        # quantidade * preco + taxas
    data = Column(Date, nullable=False)
    corretora = Column(String, nullable=True)
    observacoes = Column(String, nullable=True)

    # Resultados calculados
    preco_medio = Column(Float, nullable=True)
    lucro_prejuizo = Column(Float, nullable=True)
    imposto_devido = Column(Float, nullable=True)

    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento
    usuario = relationship("Usuario", back_populates="operacoes")