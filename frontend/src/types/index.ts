export interface Usuario {
  id: number
  nome: string
  email: string
  ativo: boolean
  criado_em: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  usuario: Usuario
}

export interface Lancamento {
  id: number
  usuario_id: number
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
  criado_em: string
}

export interface Operacao {
  id: number
  usuario_id: number
  tipo: string
  categoria: string
  ticker: string
  quantidade: number
  preco_unitario: number
  taxas: number
  total: number
  data: string
  corretora?: string
  preco_medio?: number
  lucro_prejuizo?: number
  imposto_devido?: number
  criado_em: string
}