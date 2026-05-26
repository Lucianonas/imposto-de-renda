// =============================================
// MODAL DE LANÇAMENTO
// Formulário para criar ou editar lançamentos
// =============================================

import { X } from 'lucide-react'

// Categorias disponíveis por tipo
const CATEGORIAS_RECEITA = [
  'SALARIO', 'FREELANCE', 'ALUGUEL_RECEBIDO', 'DIVIDENDOS',
  'RENDIMENTOS', 'PENSAO', 'OUTROS_RECEITA'
]
const CATEGORIAS_DESPESA = [
  'ALUGUEL', 'ALIMENTACAO', 'TRANSPORTE', 'SAUDE',
  'EDUCACAO', 'LAZER', 'VESTUARIO', 'CONTAS',
  'CARTAO_CREDITO', 'EMPRESTIMO', 'OUTROS_DESPESA'
]

interface Props {
  aberto: boolean
  form: any
  setForm: (f: any) => void
  editandoId: number | null
  onSalvar: () => void
  onFechar: () => void
}

export default function ModalLancamento({ aberto, form, setForm, editandoId, onSalvar, onFechar }: Props) {

  // Não renderiza se o modal estiver fechado
  if (!aberto) return null

  // Categorias mudam conforme o tipo selecionado
  const categorias = form.tipo === 'RECEITA' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Cabeçalho do modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {editandoId ? '✏️ Editar Lançamento' : '➕ Novo Lançamento'}
          </h3>
          <button onClick={onFechar} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        {/* Campos do formulário */}
        <div className="p-6 space-y-4">

          {/* Tipo: Receita ou Despesa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <div className="flex gap-3">
              {['RECEITA', 'DESPESA'].map(t => (
                <button
                  key={t}
                  onClick={() => setForm({
                    ...form,
                    tipo: t,
                    categoria: t === 'RECEITA' ? 'SALARIO' : 'ALUGUEL'
                  })}
                  className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition ${
                    form.tipo === t
                      ? t === 'RECEITA'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {t === 'RECEITA' ? '💰 Receita' : '💸 Despesa'}
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
              {categorias.map(c => (
                <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <input
              type="text"
              value={form.descricao}
              onChange={e => setForm({ ...form, descricao: e.target.value })}
              placeholder="Ex: Salário Janeiro 2026"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                value={form.valor}
                onChange={e => setForm({ ...form, valor: e.target.value })}
                placeholder="0,00"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input
                type="date"
                value={form.data}
                onChange={e => setForm({ ...form, data: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Status e Recorrente */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="PAGO">Pago</option>
                <option value="PENDENTE">Pendente</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recorrente</label>
              <select
                value={form.recorrente}
                onChange={e => setForm({ ...form, recorrente: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="NAO">Não</option>
                <option value="MENSAL">Mensal</option>
                <option value="ANUAL">Anual</option>
              </select>
            </div>
          </div>

          {/* Declarar IR — só aparece para receitas */}
          {form.tipo === 'RECEITA' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Declarar no IR?</label>
                <div className="flex gap-3">
                  {['SIM', 'NAO'].map(v => (
                    <button
                      key={v}
                      onClick={() => setForm({ ...form, declarar_ir: v })}
                      className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition ${
                        form.declarar_ir === v
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {v === 'SIM' ? '✅ Sim' : '❌ Não'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fonte pagadora — só aparece se declarar IR */}
              {form.declarar_ir === 'SIM' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fonte Pagadora</label>
                    <input
                      type="text"
                      value={form.fonte_pagadora}
                      onChange={e => setForm({ ...form, fonte_pagadora: e.target.value })}
                      placeholder="Nome da empresa"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <input
                      type="text"
                      value={form.cnpj_fonte}
                      onChange={e => setForm({ ...form, cnpj_fonte: e.target.value })}
                      placeholder="00.000.000/0001-00"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              )}
            </>
          )}

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
            {editandoId ? 'Salvar Alterações' : 'Criar Lançamento'}
          </button>
        </div>
      </div>
    </div>
  )
}