from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Darf(Base):
    __tablename__ = "darfs"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    mes_referencia = Column(String, nullable=False)   # ex: 2024-01
    codigo_receita = Column(String, nullable=False)   # ex: 6015 para renda variável
    imposto_devido = Column(Float, nullable=False)
    prejuizo_compensado = Column(Float, default=0.0)
    vencimento = Column(Date, nullable=False)
    status = Column(String, default="PENDENTE")       # PENDENTE, PAGO, VENCIDO

    criado_em = Column(DateTime, default=datetime.utcnow)

    # Relacionamento
    usuario = relationship("Usuario", back_populates="darfs")