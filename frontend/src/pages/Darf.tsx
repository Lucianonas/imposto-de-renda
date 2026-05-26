// =============================================
// PÁGINA DE DARF
// Gera automaticamente os dados da guia de
// imposto de renda sobre renda variável
// =============================================

import { useState } from 'react'
import { Receipt, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'
import MensagemAlerta from '../components/common/MensagemAlerta'

function formatReal(valor: number) {
  return valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function Darf() {
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())
  const [darf, setDarf] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })

  // Busca os dados da DARF do backend
  async function gerarDarf() {
    setLoading(true)
    try {
      const response = await api.get('/dashboard/darf', {
        params: { mes, ano }
      })
      setDarf(response.data)
    } catch {
      setMensagem({ texto: 'Erro ao gerar DARF', tipo: 'erro' })
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Geração de DARF</h2>
        <p className="text-gray-500 text-sm mt-1">
          Documento de Arrecadação de Receitas Federais para renda variável
        </p>
      </div>

      {/* Mensagem de erro */}
      <MensagemAlerta mensagem={mensagem} />

      {/* Explicação do que é a DARF */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">ℹ️ Como funciona?</p>
        <p>
          O sistema calcula automaticamente o imposto sobre suas operações
          de renda variável (ações, FIIs, ETFs, criptomoedas) e gera os
          dados para preenchimento da DARF no site da Receita Federal.
        </p>
        <p className="mt-1">
          O código de receita <strong>6015</strong> é para renda variável
          (mercado à vista, opções, futuros e ouro).
        </p>
      </div>

      {/* Seletor de período */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">
          Selecione o mês de referência
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-end">

          {/* Mês */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
            <select
              value={mes}
              onChange={e => setMes(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              {MESES.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
            <select
              value={ano}
              onChange={e => setAno(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              {[2024, 2025, 2026, 2027].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Botão gerar */}
          <button
            onClick={gerarDarf}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? <RefreshCw size={16} className="animate-spin" />
              : <Receipt size={16} />
            }
            Gerar DARF
          </button>
        </div>
      </div>

      {/* Resultado da DARF */}
      {darf && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Status no topo */}
          <div className={`p-4 flex items-center gap-3 ${
            darf.status === 'SEM_IMPOSTO'
              ? 'bg-green-50 border-b border-green-100'
              : 'bg-orange-50 border-b border-orange-100'
          }`}>
            {darf.status === 'SEM_IMPOSTO'
              ? <CheckCircle size={20} className="text-green-600" />
              : <AlertCircle size={20} className="text-orange-600" />
            }
            <div>
              <p className={`font-semibold ${
                darf.status === 'SEM_IMPOSTO' ? 'text-green-700' : 'text-orange-700'
              }`}>
                {darf.status === 'SEM_IMPOSTO'
                  ? '✅ Nenhum imposto devido neste período'
                  : '⚠️ Há imposto a pagar neste período'
                }
              </p>
              <p className="text-sm text-gray-500">
                Mês de referência: {darf.mes_referencia}
              </p>
            </div>
          </div>

          {/* Campos da DARF */}
          <div className="p-6">
            <h3 className="text-base font-bold text-gray-700 mb-4">
              📋 Dados para preenchimento da DARF
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Código de Receita', valor: darf.codigo_receita, destaque: true },
                { label: 'Mês de Referência', valor: darf.mes_referencia },
                { label: 'Valor do Imposto', valor: formatReal(darf.imposto_devido), destaque: darf.imposto_devido > 0 },
                { label: 'Prejuízo Compensado', valor: formatReal(darf.prejuizo_compensado) },
                { label: 'Data de Vencimento', valor: darf.vencimento, destaque: true },
                { label: 'Status', valor: darf.status === 'SEM_IMPOSTO' ? 'Sem imposto' : 'Pendente' },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border ${
                  item.destaque
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-100 bg-gray-50'
                }`}>
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-lg font-bold ${
                    item.destaque ? 'text-blue-700' : 'text-gray-800'
                  }`}>
                    {item.valor}
                  </p>
                </div>
              ))}
            </div>

            {/* Instruções de pagamento */}
            {darf.imposto_devido > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                <p className="font-semibold mb-2">⚠️ Como pagar a DARF:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Acesse: <strong>sicalc.receita.fazenda.gov.br</strong></li>
                  <li>Código de receita: <strong>{darf.codigo_receita}</strong></li>
                  <li>Período de apuração: <strong>{darf.mes_referencia}</strong></li>
                  <li>Valor: <strong>{formatReal(darf.imposto_devido)}</strong></li>
                  <li>Pague até: <strong>{darf.vencimento}</strong></li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mensagem inicial */}
      {!darf && !loading && (
        <div className="text-center py-16 text-gray-400">
          <Receipt size={48} className="mx-auto mb-3 opacity-30" />
          <p>Selecione o mês e clique em "Gerar DARF"</p>
        </div>
      )}
    </div>
  )
}