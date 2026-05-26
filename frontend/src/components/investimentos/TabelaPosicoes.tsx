// =============================================
// TABELA DE POSIÇÕES
// Lista posições atuais da carteira
// =============================================

// Tipo da posição
interface Posicao {
  ticker: string
  categoria: string
  quantidade_atual: number
  preco_medio: number
  total_investido: number
  lucro_prejuizo_realizado: number
  imposto_devido: number
}

interface Props {
  posicoes: Posicao[]
}

function formatReal(valor: number) {
  return valor?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }) ?? 'R$ 0,00'
}

export default function TabelaPosicoes({ posicoes }: Props) {

  // Lista vazia
  if (!posicoes || posicoes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
        Nenhuma posição encontrada
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3">Ticker</th>
              <th className="text-left px-5 py-3">Categoria</th>
              <th className="text-left px-5 py-3">Quantidade</th>
              <th className="text-left px-5 py-3">Preço Médio</th>
              <th className="text-left px-5 py-3">Total Investido</th>
              <th className="text-left px-5 py-3">Lucro/Prejuízo</th>
              <th className="text-left px-5 py-3">Imposto</th>
            </tr>
          </thead>

          <tbody>
            {posicoes.map((pos) => (

              <tr
                key={pos.ticker}
                className="border-b border-gray-50 hover:bg-gray-50"
              >

                {/* Ticker */}
                <td className="px-5 py-3 font-bold text-blue-700">
                  {pos.ticker}
                </td>

                {/* Categoria */}
                <td className="px-5 py-3">
                  {pos.categoria}
                </td>

                {/* Quantidade */}
                <td className="px-5 py-3">
                  {pos.quantidade_atual}
                </td>

                {/* Preço médio */}
                <td className="px-5 py-3">
                  {formatReal(pos.preco_medio)}
                </td>

                {/* Total investido */}
                <td className="px-5 py-3 font-semibold">
                  {formatReal(pos.total_investido)}
                </td>

                {/* Lucro / prejuízo */}
                <td
                  className={`px-5 py-3 font-semibold ${
                    pos.lucro_prejuizo_realizado >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatReal(pos.lucro_prejuizo_realizado)}
                </td>

                {/* Imposto */}
                <td className="px-5 py-3">
                  {formatReal(pos.imposto_devido)}
                </td>

              </tr>

            ))}
          </tbody>

        </table>

      </div>
    </div>
  )
}