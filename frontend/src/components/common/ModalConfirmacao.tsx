// =============================================
// MODAL DE CONFIRMAÇÃO
// Reutilizável para confirmar exclusões
// =============================================

interface Props {
  aberto: boolean
  mensagem: string
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ModalConfirmacao({ aberto, mensagem, onConfirmar, onCancelar }: Props) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar Exclusão</h3>
        <p className="text-gray-500 mb-6">{mensagem}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-medium"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}