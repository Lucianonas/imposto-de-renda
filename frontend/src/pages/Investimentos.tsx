// =============================================
// PÁGINA DE INVESTIMENTOS
// =============================================

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import api from '../services/api'

// Componentes
import TabelaOperacoes from '../components/investimentos/TabelaOperacoes'
import TabelaPosicoes from '../components/investimentos/TabelaPosicoes'
import ModalOperacao from '../components/investimentos/ModalOperacao'
import MensagemAlerta from '../components/common/MensagemAlerta'
import ModalConfirmacao from '../components/common/ModalConfirmacao'

// =============================================
// TIPOS
// =============================================

export type Operacao = {
  id: number
  tipo: string
  categoria: string
  ticker: string
  quantidade: number
  preco_unitario: number
  taxas: number
  total: number
  data: string
  corretora?: string
  observacoes?: string
  preco_medio?: number
  lucro_prejuizo?: number
  imposto_devido?: number
}

export type Posicao = {
  ticker: string
  categoria: string
  quantidade_atual: number
  preco_medio: number
  total_investido: number
  lucro_prejuizo_realizado: number
  imposto_devido: number
}

// =============================================
// FORMULÁRIO VAZIO
// =============================================

export const FORM_VAZIO_OP = {
  tipo: 'COMPRA',
  categoria: 'ACAO',
  ticker: '',
  quantidade: '',
  preco_unitario: '',
  taxas: '0',
  data: new Date().toISOString().split('T')[0],
  corretora: '',
  observacoes: ''
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export default function Investimentos() {

  const [operacoes, setOperacoes] = useState<Operacao[]>([])
  const [posicoes, setPosicoes] = useState<Posicao[]>([])

  const [abaAtiva, setAbaAtiva] = useState<'operacoes' | 'posicoes'>('operacoes')

  const [form, setForm] = useState(FORM_VAZIO_OP)

  const [modalAberto, setModalAberto] = useState(false)

  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)

  const [mensagem, setMensagem] = useState({
    texto: '',
    tipo: ''
  })

  const [confirmarExclusao, setConfirmarExclusao] = useState<number | null>(null)

  // =============================================
  // CARREGA DADOS
  // =============================================

  useEffect(() => {
    buscarDados()
  }, [])

  async function buscarDados() {

    setLoading(true)

    try {

      const [resOps, resPosicoes] = await Promise.all([
        api.get('/operacoes/'),
        api.get('/operacoes/resumo')
      ])

      setOperacoes(resOps.data)
      setPosicoes(resPosicoes.data)

    } catch (error) {

      mostrarMensagem(
        'Erro ao buscar dados',
        'erro'
      )

    } finally {

      setLoading(false)

    }
  }

  // =============================================
  // ALERTAS
  // =============================================

  function mostrarMensagem(texto: string, tipo: string) {

    setMensagem({
      texto,
      tipo
    })

    setTimeout(() => {

      setMensagem({
        texto: '',
        tipo: ''
      })

    }, 3000)
  }

  // =============================================
  // NOVA OPERAÇÃO
  // =============================================

  function novaOperacao() {

    setForm(FORM_VAZIO_OP)

    setEditandoId(null)

    setModalAberto(true)
  }

  // =============================================
  // EDITAR
  // =============================================

  function editarOperacao(op: Operacao) {

    setForm({
      ...op,
      quantidade: op.quantidade.toString(),
      preco_unitario: op.preco_unitario.toString(),
      taxas: op.taxas.toString(),
      corretora: op.corretora || '',
      observacoes: op.observacoes || ''
    })

    setEditandoId(op.id)

    setModalAberto(true)
  }

  // =============================================
  // SALVAR
  // =============================================

  async function salvarOperacao() {

    try {

      const dados = {
        ...form,
        ticker: form.ticker.toUpperCase(),
        quantidade: parseFloat(form.quantidade),
        preco_unitario: parseFloat(form.preco_unitario),
        taxas: parseFloat(form.taxas || '0')
      }

      if (editandoId) {

        await api.put(`/operacoes/${editandoId}`, dados)

        mostrarMensagem(
          'Operação atualizada!',
          'sucesso'
        )

      } else {

        await api.post('/operacoes/', dados)

        mostrarMensagem(
          'Operação registrada!',
          'sucesso'
        )
      }

      setModalAberto(false)

      buscarDados()

    } catch (err: any) {

      mostrarMensagem(
        err.response?.data?.detail || 'Erro ao salvar',
        'erro'
      )
    }
  }

  // =============================================
  // EXCLUIR
  // =============================================

  async function deletarOperacao(id: number) {

    try {

      await api.delete(`/operacoes/${id}`)

      mostrarMensagem(
        'Operação excluída!',
        'sucesso'
      )

      setConfirmarExclusao(null)

      buscarDados()

    } catch (error) {

      mostrarMensagem(
        'Erro ao excluir',
        'erro'
      )
    }
  }

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Investimentos
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Gerencie suas operações na bolsa
          </p>
        </div>

        <button
          onClick={novaOperacao}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />

          Nova Operação
        </button>

      </div>

      {/* Alertas */}
      <MensagemAlerta mensagem={mensagem} />

      {/* Abas */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit">

        <button
          onClick={() => setAbaAtiva('operacoes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            abaAtiva === 'operacoes'
              ? 'bg-white shadow text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📋 Operações
        </button>

        <button
          onClick={() => setAbaAtiva('posicoes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            abaAtiva === 'posicoes'
              ? 'bg-white shadow text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          💼 Posições
        </button>

      </div>

      {/* Conteúdo */}
      {abaAtiva === 'operacoes' ? (

        <TabelaOperacoes
          operacoes={operacoes}
          loading={loading}
          onEditar={editarOperacao}
          onExcluir={(id) => setConfirmarExclusao(id)}
        />

      ) : (

        <TabelaPosicoes
          posicoes={posicoes}
        />

      )}

      {/* Modal confirmação */}
      <ModalConfirmacao
        aberto={confirmarExclusao !== null}
        mensagem="Tem certeza que deseja excluir esta operação?"
        onCancelar={() => setConfirmarExclusao(null)}
        onConfirmar={() => deletarOperacao(confirmarExclusao!)}
      />

      {/* Modal formulário */}
      <ModalOperacao
        aberto={modalAberto}
        form={form}
        setForm={setForm}
        editandoId={editandoId}
        onSalvar={salvarOperacao}
        onFechar={() => setModalAberto(false)}
      />

    </div>
  )
}