import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import api from '../services/api'
import type { Usuario} from '../types'

interface AuthContextData {
  usuario: Usuario | null
  token: string | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recupera sessão salva
    const tokenSalvo = localStorage.getItem('token')
    const usuarioSalvo = localStorage.getItem('usuario')

    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo)
      setUsuario(JSON.parse(usuarioSalvo))
    }
    setLoading(false)
  }, [])

  async function login(email: string, senha: string) {
    const response = await api.post('/auth/login', { email, senha })
    const { access_token, usuario } = response.data

    localStorage.setItem('token', access_token)
    localStorage.setItem('usuario', JSON.stringify(usuario))

    setToken(access_token)
    setUsuario(usuario)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}