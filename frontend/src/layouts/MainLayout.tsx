import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard, Wallet, TrendingUp, FileText,
  Receipt, LogOut, Menu, X, Sun, Moon, ChevronRight
} from 'lucide-react'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/lancamentos', icon: Wallet, label: 'Lançamentos' },
  { path: '/investimentos', icon: TrendingUp, label: 'Investimentos' },
  { path: '/relatorios', icon: FileText, label: 'Relatórios' },
  { path: '/darf', icon: Receipt, label: 'DARF' },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const { usuario, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>

      {/* Menu Lateral */}
      <aside className={`
        ${menuAberto ? 'w-64' : 'w-16'}
        bg-gradient-to-b from-blue-900 to-blue-800
        text-white transition-all duration-300 flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          {menuAberto && (
            <span className="font-bold text-lg">💰 FinanceiroApp</span>
          )}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="p-1 rounded hover:bg-blue-700 transition"
          >
            {menuAberto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Itens do Menu */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const ativo = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1
                  transition-all duration-200
                  ${ativo
                    ? 'bg-white text-blue-900 font-semibold shadow'
                    : 'hover:bg-blue-700 text-blue-100'
                  }
                `}
              >
                <item.icon size={20} />
                {menuAberto && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {ativo && <ChevronRight size={16} />}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Rodapé do Menu */}
        <div className="p-4 border-t border-blue-700">
          {menuAberto && (
            <div className="mb-3">
              <p className="text-xs text-blue-300">Logado como</p>
              <p className="text-sm font-semibold truncate">{usuario?.nome}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm"
          >
            <LogOut size={16} />
            {menuAberto && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar Superior */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            {menuItems.find(m => m.path === location.pathname)?.label || 'FinanceiroApp'}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {usuario?.nome?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600">{usuario?.nome}</span>
            </div>
          </div>
        </header>

        {/* Página */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}