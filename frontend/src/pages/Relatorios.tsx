// =============================================
// PÁGINA DE RELATÓRIOS
// Relatório mensal completo com resumo financeiro
// =============================================

import { useState } from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import api from '../services/api'
import MensagemAlerta from '../components/common/MensagemAlerta'

function formatReal(valor: number) {
  return valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'
}

// Lista de meses para o select
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function Relatorios() {
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())
  const [relatorio, setRelatorio] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })

  // Busca o relatório do backend
  async function buscarRelatorio() {
    setLoading(true)
    try {
      const response = await api.get('/dashboard/relatorio/mensal', {
        params: { mes, ano }
      })
      setRelatorio(response.data)
    } catch {
      setMensagem({ texto: 'Erro ao buscar relatório', tipo: 'erro' })
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
        <p className="text-gray-500 text-sm mt-1">Análise financeira por período</p>
      </div>

      {/* Mensagem de erro */}
      <MensagemAlerta mensagem={mensagem} />

      {/* Seletor de período */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Selecione o período</h3>
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
            onClick={buscarRelatorio}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? <RefreshCw size={16} className="animate-spin" />
              : <FileText size={16} />
            }
            Gerar Relatório
          </button>
        </div>
      </div>

      {/* Resultado do relatório */}
      {relatorio && (
        <div className="space-y-4">

          {/* Título do período */}
          <h3 className="text-lg font-bold text-gray-700">
            📋 Relatório de {MESES[relatorio.mes - 1]} / {relatorio.ano}
          </h3>

          {/* Cards com os valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { titulo: '💰 Total de Receitas', valor: relatorio.total_receitas, cor: 'text-green-600' },
              { titulo: '💸 Total de Despesas', valor: relatorio.total_despesas, cor: 'text-red-600' },
              { titulo: '📊 Saldo do Mês', valor: relatorio.saldo, cor: relatorio.saldo >= 0 ? 'text-green-600' : 'text-red-600' },
              { titulo: '🏢 Total de Salários', valor: relatorio.total_salarios, cor: 'text-blue-600' },
              { titulo: '📈 Total Investido', valor: relatorio.total_investido, cor: 'text-violet-600' },
              { titulo: '💹 Lucro Realizado', valor: relatorio.lucro_realizado, cor: 'text-green-600' },
              { titulo: '📉 Prejuízo Realizado', valor: Math.abs(relatorio.prejuizo_realizado), cor: 'text-red-600' },
              { titulo: '🧾 Imposto Devido', valor: relatorio.imposto_devido, cor: 'text-orange-600' },
              { titulo: '📄 A Declarar no IR', valor: relatorio.a_declarar_ir, cor: 'text-cyan-600' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">{item.titulo}</p>
                <p className={`text-xl font-bold ${item.cor}`}>{formatReal(item.valor)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem inicial quando nenhum relatório foi gerado */}
      {!relatorio && !loading && (
        <div className="text-center py-16 text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-30" />
          <p>Selecione um período e clique em "Gerar Relatório"</p>
        </div>
      )}
    </div>
  )
}