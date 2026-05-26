// =============================================
// TABELA DE LANÇAMENTOS
// Exibe a lista de lançamentos com ações
// =============================================

import { Pencil, Trash2, RefreshCw } from 'lucide-react'
import type { Lancamento } from '../../types/lancamento'

// Formata valor para Real
function formatReal(valor: number) {
  return valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'
}

interface Props {
  lancamentos: Lancamento[]
  loading: boolean
  onEditar: (l: Lancamento) => void
  onExcluir: (id: number) => void
}

export default function TabelaLancamentos({ lancamentos, loading, onEditar, onExcluir }: Props) {

  // Tela de carregamento
  if (loading) {
    return (
      <div className="bg-white rounded-2xl flex items-center justify-center py-16 shadow-sm border border-gray-100">
        <RefreshCw size={32} className="animate-spin text-blue-600" />
      </div>
    )
  }

  // Tela vazia
  if (lancamentos.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 text-gray-400">
        <p className="text-lg">Nenhum lançamento encontrado</p>
        <p className="text-sm mt-1">Clique em "Novo Lançamento" para adicionar</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Data</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Descrição</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Categoria</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Tipo</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Valor</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">IR</th>
              <th className="text-center px-5 py-3 font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map(l => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition">

                {/* Data */}
                <td className="px-5 py-3 text-gray-500">
                  {new Date(l.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                </td>

                {/* Descrição */}
                <td className="px-5 py-3 font-medium text-gray-800">{l.descricao}</td>

                {/* Categoria */}
                <td className="px-5 py-3 text-gray-500">{l.categoria.replace(/_/g, ' ')}</td>

                {/* Tipo com badge colorido */}
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    l.tipo === 'RECEITA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {l.tipo}
                  </span>
                </td>

                {/* Valor colorido por tipo */}
                <td className={`px-5 py-3 font-semibold ${
                  l.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatReal(l.valor)}
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    l.status === 'PAGO' ? 'bg-blue-100 text-blue-700' :
                    l.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {l.status}
                  </span>
                </td>

                {/* Declarar IR */}
                <td className="px-5 py-3">
                  {l.declarar_ir === 'SIM' && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      Declarar
                    </span>
                  )}
                </td>

                {/* Botões de ação */}
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditar(l)}
                      className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onExcluir(l.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition"
                      title="Excluir"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}