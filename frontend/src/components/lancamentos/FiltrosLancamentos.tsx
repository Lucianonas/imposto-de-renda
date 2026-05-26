// =============================================
// FILTROS DE LANÇAMENTOS
// Barra de busca e filtro por tipo
// =============================================

import { Search, Filter, RefreshCw } from 'lucide-react'

interface Props {
  busca: string
  setBusca: (v: string) => void
  filtroTipo: string
  setFiltroTipo: (v: string) => void
  onAtualizar: () => void
}

export default function FiltrosLancamentos({ busca, setBusca, filtroTipo, setFiltroTipo, onAtualizar }: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Campo de busca por texto */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição ou categoria..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        {/* Filtro por tipo */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filtroTipo}
            onChange={e => { setFiltroTipo(e.target.value); setTimeout(onAtualizar, 100) }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Todos</option>
            <option value="RECEITA">Receitas</option>
            <option value="DESPESA">Despesas</option>
          </select>
        </div>

        {/* Botão de atualizar */}
        <button
          onClick={onAtualizar}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>
    </div>
  )
}