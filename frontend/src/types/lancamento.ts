export interface Lancamento {
  id: number
  tipo: string
  categoria: string
  descricao: string
  valor: number
  data: string
  recorrente: string
  status: string
  declarar_ir: string
  fonte_pagadora?: string
  cnpj_fonte?: string
  observacoes?: string
}