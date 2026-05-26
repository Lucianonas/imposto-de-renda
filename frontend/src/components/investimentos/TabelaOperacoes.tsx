// =============================================
// TABELA DE OPERAÇÕES
// Lista compras e vendas com ações
// =============================================


import { Pencil, Trash2, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import type { Operacao } from '../../pages/Investimentos'

function formatReal(valor: number) {
  return valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'
}

interface Props {
  operacoes: Operacao[]
  loading: boolean
  onEditar: (op: Operacao) => void
  onExcluir: (id: number) => void
}

export default function TabelaOperacoes({ operacoes, loading, onEditar, onExcluir }: Props) {

  if (loading) {
    return (
      <div className="bg-white rounded-2xl flex items-center justify-center py-16 shadow-sm border border-gray-100">
        <RefreshCw size={32} className="animate-spin text-blue-600" />
      </div>
    )
  }

  if (operacoes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 text-gray-400">
        <p className="text-lg">Nenhuma operação registrada</p>
        <p className="text-sm mt-1">Clique em "Nova Operação" para começar</p>
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
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Ticker</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Tipo</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Qtd</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Preço</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Total</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Lucro/Prej</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Imposto</th>
              <th className="text-center px-5 py-3 font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {operacoes.map(op => (
              <tr key={op.id} className="border-b border-gray-50 hover:bg-gray-50 transition">

                {/* Data */}
                <td className="px-5 py-3 text-gray-500">
                  {new Date(op.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                </td>

                {/* Ticker em destaque */}
                <td className="px-5 py-3 font-bold text-blue-700">{op.ticker}</td>

                {/* Tipo com badge */}
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    op.tipo === 'COMPRA'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {op.tipo}
                  </span>
                </td>

                <td className="px-5 py-3">{op.quantidade}</td>
                <td className="px-5 py-3">{formatReal(op.preco_unitario)}</td>
                <td className="px-5 py-3 font-medium">{formatReal(op.total)}</td>

                {/* Lucro ou prejuízo com ícone */}
                <td className="px-5 py-3">
                  {op.lucro_prejuizo != null && (
                    <span className={`flex items-center gap-1 font-medium ${
                      op.lucro_prejuizo >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {op.lucro_prejuizo >= 0
                        ? <TrendingUp size={14} />
                        : <TrendingDown size={14} />
                      }
                      {formatReal(op.lucro_prejuizo)}
                    </span>
                  )}
                </td>

                {/* Imposto */}
                <td className="px-5 py-3 text-orange-600 font-medium">
                  {op.imposto_devido ? formatReal(op.imposto_devido) : '-'}
                </td>

                {/* Botões */}
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditar(op)}
                      className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onExcluir(op.id)}
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