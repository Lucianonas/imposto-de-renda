// =============================================
// COMPONENTE DE MENSAGEM DE ALERTA
// Reutilizável em todas as páginas
// =============================================

import { Check, AlertCircle } from 'lucide-react'

interface Props {
  mensagem: { texto: string; tipo: string }
}

export default function MensagemAlerta({ mensagem }: Props) {
  // Não renderiza se não tiver mensagem
  if (!mensagem.texto) return null

  return (
    <div className={`flex items-center gap-2 p-4 rounded-xl ${
      mensagem.tipo === 'sucesso'
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      {mensagem.tipo === 'sucesso'
        ? <Check size={18} />
        : <AlertCircle size={18} />
      }
      {mensagem.texto}
    </div>
  )
}