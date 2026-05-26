from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Lancamento(Base):
    __tablename__ = "lancamentos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    # Dados do lançamento
    tipo = Column(String, nullable=False)        # RECEITA ou DESPESA
    categoria = Column(String, nullable=False)   # SALARIO, ALUGUEL, ALIMENTACAO, etc
    descricao = Column(String, nullable=False)
    valor = Column(Float, nullable=False)
    data = Column(Date, nullable=False)
    recorrente = Column(String, default="NAO")   # NAO, MENSAL, ANUAL
    status = Column(String, default="PAGO")      # PAGO, PENDENTE, CANCELADO

    # Para declaração de IR
    declarar_ir = Column(String, default="NAO")  # SIM ou NAO
    fonte_pagadora = Column(String, nullable=True)  # ex: Nome da empresa
    cnpj_fonte = Column(String, nullable=True)      # CNPJ da empresa

    observacoes = Column(String, nullable=True)
    criado_em = Column(DateTime, default=datetime.utcnow)

    # Relacionamento
    usuario = relationship("Usuario", back_populates="lancamentos")