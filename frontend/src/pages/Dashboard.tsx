// =============================================
// PÁGINA DO DASHBOARD
// Mostra o resumo financeiro completo
// =============================================

import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  TrendingUp, TrendingDown, Wallet, DollarSign,
  AlertCircle, RefreshCw, ArrowUpRight, ArrowDownRight,
  Receipt, BarChart2
} from 'lucide-react'
import api from '../services/api'

// Tipo dos dados que vêm do backend
interface DashboardData {
  patrimonio_total: number
  saldo_mes_atual: number
  total_receitas_mes: number
  total_despesas_mes: number
  lucro_investimentos: number
  prejuizo_investimentos: number
  imposto_devido_mes: number
  total_a_declarar_ir: number
  evolucao_mensal: any[]
  posicoes: any[]
  ultimas_operacoes: any[]
  ultimos_lancamentos: any[]
}

// Cores para o gráfico de pizza
const CORES = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2']

// Formata número para Real Brasileiro
function formatReal(valor: number) {
  return valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00'
}

// ─── Componente de Card de Métrica ───────────────────
function CardMetrica({
  titulo, valor, icone: Icone, corFundo, positivo
}: {
  titulo: string
  valor: number
  icone: any
  corFundo: string
  positivo?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{titulo}</span>
        <div className={`p-2 rounded-xl ${corFundo}`}>
          <Icone size={18} className="text-white" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-xl font-bold ${
          positivo === false ? 'text-red-600' :
          positivo === true  ? 'text-green-600' :
          'text-gray-800'
        }`}>
          {formatReal(valor)}
        </span>
        {positivo !== undefined && (
          positivo
            ? <ArrowUpRight size={20} className="text-green-500" />
            : <ArrowDownRight size={20} className="text-red-500" />
        )}
      </div>
    </div>
  )
}

// ─── Componente principal do Dashboard ───────────────
export default function Dashboard() {
  const [dados, setDados] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  // Busca os dados quando a página abre
  useEffect(() => {
    buscarDados()
  }, [])

  // Chama a API do backend
  async function buscarDados() {
    setLoading(true)
    setErro('')
    try {
      const response = await api.get('/dashboard/resumo')
      setDados(response.data)
    } catch {
      setErro('Erro ao carregar dashboard. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  // Tela de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw size={40} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  // Tela de erro
  if (erro) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-600 mb-4">{erro}</p>
          <button
            onClick={buscarDados}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // Dados para o gráfico de pizza
  const dadosPizza = dados?.posicoes?.map(p => ({
    name: p.ticker,
    value: p.total_investido
  })) ?? []

  return (
    <div className="space-y-6">

      {/* Cabeçalho com botão de atualizar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
          <p className="text-gray-500 text-sm mt-1">Resumo financeiro do mês atual</p>
        </div>
        <button
          onClick={buscarDados}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardMetrica titulo="Patrimônio Total" valor={dados?.patrimonio_total ?? 0} icone={Wallet} corFundo="bg-blue-600" />
        <CardMetrica titulo="Saldo do Mês" valor={dados?.saldo_mes_atual ?? 0} icone={DollarSign} corFundo="bg-green-600" positivo={(dados?.saldo_mes_atual ?? 0) >= 0} />
        <CardMetrica titulo="Receitas do Mês" valor={dados?.total_receitas_mes ?? 0} icone={TrendingUp} corFundo="bg-emerald-600" positivo={true} />
        <CardMetrica titulo="Despesas do Mês" valor={dados?.total_despesas_mes ?? 0} icone={TrendingDown} corFundo="bg-red-500" positivo={false} />
      </div>

      {/* Cards secundários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardMetrica titulo="Lucro em Investimentos" valor={dados?.lucro_investimentos ?? 0} icone={BarChart2} corFundo="bg-violet-600" positivo={true} />
        <CardMetrica titulo="Prejuízo Acumulado" valor={Math.abs(dados?.prejuizo_investimentos ?? 0)} icone={TrendingDown} corFundo="bg-orange-500" positivo={false} />
        <CardMetrica titulo="Imposto Devido" valor={dados?.imposto_devido_mes ?? 0} icone={Receipt} corFundo="bg-yellow-600" />
        <CardMetrica titulo="A Declarar no IR" valor={dados?.total_a_declarar_ir ?? 0} icone={AlertCircle} corFundo="bg-cyan-600" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Gráfico de Evolução Mensal */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">📈 Evolução dos Últimos 6 Meses</h3>
          {dados?.evolucao_mensal && dados.evolucao_mensal.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dados.evolucao_mensal}>
                <defs>
                  <linearGradient id="gradReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatReal(Number(value))} />
                <Legend />
                <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#16a34a" fill="url(#gradReceitas)" strokeWidth={2} />
                <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#dc2626" fill="url(#gradDespesas)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Nenhum dado disponível ainda</p>
            </div>
          )}
        </div>

        {/* Gráfico de Pizza */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">🥧 Distribuição de Ativos</h3>
          {dadosPizza.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={dadosPizza} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {dadosPizza.map((_, index) => (
                    <Cell key={index} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatReal(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Sem posições em carteira</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Últimas Operações */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">📊 Últimas Operações</h3>
          {dados?.ultimas_operacoes && dados.ultimas_operacoes.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Ticker</th>
                  <th className="pb-2 font-medium">Tipo</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {dados.ultimas_operacoes.map((op: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-2 font-semibold text-blue-700">{op.ticker}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${op.tipo === 'COMPRA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {op.tipo}
                      </span>
                    </td>
                    <td className="py-2 font-medium">{formatReal(op.total)}</td>
                    <td className="py-2 text-gray-400">{new Date(op.data).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center py-8">Nenhuma operação ainda</p>
          )}
        </div>

        {/* Últimos Lançamentos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">💰 Últimos Lançamentos</h3>
          {dados?.ultimos_lancamentos && dados.ultimos_lancamentos.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Descrição</th>
                  <th className="pb-2 font-medium">Tipo</th>
                  <th className="pb-2 font-medium">Valor</th>
                  <th className="pb-2 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {dados.ultimos_lancamentos.map((l: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-2 font-medium text-gray-700 max-w-[120px] truncate">{l.descricao}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${l.tipo === 'RECEITA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {l.tipo}
                      </span>
                    </td>
                    <td className={`py-2 font-medium ${l.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatReal(l.valor)}
                    </td>
                    <td className="py-2 text-gray-400">{new Date(l.data).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center py-8">Nenhum lançamento ainda</p>
          )}
        </div>
      </div>
    </div>
  )
}