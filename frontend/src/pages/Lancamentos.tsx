// =============================================
// PÁGINA DE LANÇAMENTOS FINANCEIROS
// =============================================

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import api from '../services/api'

// Componentes
import TabelaLancamentos from '../components/lancamentos/TabelaLancamentos'
import ModalLancamento from '../components/lancamentos/ModalLancamento'
import FiltrosLancamentos from '../components/lancamentos/FiltrosLancamentos'
import MensagemAlerta from '../components/common/MensagemAlerta'
import ModalConfirmacao from '../components/common/ModalConfirmacao'

// =============================================
// TIPAGEM
// =============================================

export type Lancamento = {
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

// =============================================
// FORMULÁRIO VAZIO
// =============================================

export const FORM_VAZIO = {
  tipo: 'RECEITA',
  categoria: 'SALARIO',
  descricao: '',
  valor: '',
  data: new Date().toISOString().split('T')[0],
  recorrente: 'NAO',
  status: 'PAGO',
  declarar_ir: 'NAO',
  fonte_pagadora: '',
  cnpj_fonte: '',
  observacoes: ''
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export default function Lancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [form, setForm] = useState(FORM_VAZIO)

  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

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
    buscarLancamentos()
  }, [])

  async function buscarLancamentos() {
    setLoading(true)

    try {
      const params: any = {}

      if (filtroTipo) {
        params.tipo = filtroTipo
      }

      const response = await api.get('/lancamentos/', {
        params
      })

      setLancamentos(response.data)
    } catch (error) {
      mostrarMensagem('Erro ao buscar lançamentos', 'erro')
    } finally {
      setLoading(false)
    }
  }

  // =============================================
  // ALERTAS
  // =============================================

  function mostrarMensagem(texto: string, tipo: string) {
    setMensagem({ texto, tipo })

    setTimeout(() => {
      setMensagem({
        texto: '',
        tipo: ''
      })
    }, 3000)
  }

  // =============================================
  // NOVO LANÇAMENTO
  // =============================================

  function novoLancamento() {
    setForm(FORM_VAZIO)
    setEditandoId(null)
    setModalAberto(true)
  }

  // =============================================
  // EDITAR
  // =============================================

  function editarLancamento(l: Lancamento) {
    setForm({
      ...l,
      valor: l.valor.toString(),
      fonte_pagadora: l.fonte_pagadora || '',
      cnpj_fonte: l.cnpj_fonte || '',
      observacoes: l.observacoes || ''
    })

    setEditandoId(l.id)
    setModalAberto(true)
  }

  // =============================================
  // SALVAR
  // =============================================

  async function salvarLancamento() {
    try {
      const dados = {
        ...form,
        valor: parseFloat(form.valor)
      }

      if (editandoId) {
        await api.put(`/lancamentos/${editandoId}`, dados)

        mostrarMensagem(
          'Lançamento atualizado com sucesso!',
          'sucesso'
        )
      } else {
        await api.post('/lancamentos/', dados)

        mostrarMensagem(
          'Lançamento criado com sucesso!',
          'sucesso'
        )
      }

      setModalAberto(false)

      buscarLancamentos()

    } catch (err: any) {
      mostrarMensagem(
        err.response?.data?.detail || 'Erro ao salvar lançamento',
        'erro'
      )
    }
  }

  // =============================================
  // EXCLUIR
  // =============================================

  async function deletarLancamento(id: number) {
    try {
      await api.delete(`/lancamentos/${id}`)

      mostrarMensagem(
        'Lançamento excluído com sucesso!',
        'sucesso'
      )

      setConfirmarExclusao(null)

      buscarLancamentos()

    } catch (error) {
      mostrarMensagem('Erro ao excluir lançamento', 'erro')
    }
  }

  // =============================================
  // FILTROS
  // =============================================

  const lancamentosFiltrados = lancamentos.filter((l) =>
    l.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    l.categoria.toLowerCase().includes(busca.toLowerCase())
  )

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Lançamentos Financeiros
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Controle suas receitas e despesas
          </p>
        </div>

        <button
          onClick={novoLancamento}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
        >
          <Plus size={18} />
          Novo Lançamento
        </button>

      </div>

      {/* Mensagem */}
      <MensagemAlerta mensagem={mensagem} />

      {/* Filtros */}
      <FiltrosLancamentos
        busca={busca}
        setBusca={setBusca}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        onAtualizar={buscarLancamentos}
      />

      {/* Tabela */}
      <TabelaLancamentos
        lancamentos={lancamentosFiltrados}
        loading={loading}
        onEditar={editarLancamento}
        onExcluir={(id) => setConfirmarExclusao(id)}
      />

      {/* Modal exclusão */}
      <ModalConfirmacao
        aberto={confirmarExclusao !== null}
        mensagem="Tem certeza que deseja excluir este lançamento?"
        onCancelar={() => setConfirmarExclusao(null)}
        onConfirmar={() => deletarLancamento(confirmarExclusao!)}
      />

      {/* Modal formulário */}
      <ModalLancamento
        aberto={modalAberto}
        form={form}
        setForm={setForm}
        editandoId={editandoId}
        onSalvar={salvarLancamento}
        onFechar={() => setModalAberto(false)}
      />

    </div>
  )
}