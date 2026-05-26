// =============================================
// MODAL DE OPERAÇÃO
// Formulário para registrar compra ou venda
// =============================================

import { X } from 'lucide-react'

interface Props {
  aberto: boolean
  form: any
  setForm: (f: any) => void
  editandoId: number | null
  onSalvar: () => void
  onFechar: () => void
}

export default function ModalOperacao({ aberto, form, setForm, editandoId, onSalvar, onFechar }: Props) {

  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {editandoId ? '✏️ Editar Operação' : '➕ Nova Operação'}
          </h3>
          <button onClick={onFechar} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* Tipo: Compra ou Venda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <div className="flex gap-3">
              {['COMPRA', 'VENDA'].map(t => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, tipo: t })}
                  className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition ${
                    form.tipo === t
                      ? t === 'COMPRA'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-500'
                  }`}
                >
                  {t === 'COMPRA' ? '📈 Compra' : '📉 Venda'}
                </button>
              ))}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
            <select
              value={form.categoria}
              onChange={e => setForm({ ...form, categoria: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              {['ACAO', 'FII', 'ETF', 'CRIPTO', 'BDR', 'RENDA_FIXA'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Ticker e Corretora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticker *</label>
              <input
                type="text"
                value={form.ticker}
                onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                placeholder="Ex: PETR4"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Corretora</label>
              <input
                type="text"
                value={form.corretora}
                onChange={e => setForm({ ...form, corretora: e.target.value })}
                placeholder="Ex: Clear"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Quantidade, Preço e Taxas */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
              <input
                type="number"
                value={form.quantidade}
                onChange={e => setForm({ ...form, quantidade: e.target.value })}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unit. *</label>
              <input
                type="number"
                step="0.01"
                value={form.preco_unitario}
                onChange={e => setForm({ ...form, preco_unitario: e.target.value })}
                placeholder="35.50"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxas (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.taxas}
                onChange={e => setForm({ ...form, taxas: e.target.value })}
                placeholder="5.00"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
            <input
              type="date"
              value={form.data}
              onChange={e => setForm({ ...form, data: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={form.observacoes}
              onChange={e => setForm({ ...form, observacoes: e.target.value })}
              placeholder="Opcional..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onFechar}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onSalvar}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium"
          >
            {editandoId ? 'Salvar Alterações' : 'Registrar Operação'}
          </button>
        </div>
      </div>
    </div>
  )
}