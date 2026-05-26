// =============================================
// APP.TSX — Arquivo principal de rotas
// Define todas as páginas e quem pode acessar
// =============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import RotaProtegida from './components/RotaProtegida'
import MainLayout from './layouts/MainLayout'

// Importa todas as páginas
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Lancamentos from './pages/Lancamentos'
import Investimentos from './pages/Investimentos'
import Relatorios from './pages/Relatorios'
import Darf from './pages/Darf'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Rota pública — não precisa estar logado */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={
            <RotaProtegida>
              <MainLayout><Dashboard /></MainLayout>
            </RotaProtegida>
          } />

          {/* Lançamentos Financeiros */}
          <Route path="/lancamentos" element={
            <RotaProtegida>
              <MainLayout><Lancamentos /></MainLayout>
            </RotaProtegida>
          } />

          {/* Investimentos */}
          <Route path="/investimentos" element={
            <RotaProtegida>
              <MainLayout><Investimentos /></MainLayout>
            </RotaProtegida>
          } />

          {/* Relatórios */}
          <Route path="/relatorios" element={
            <RotaProtegida>
              <MainLayout><Relatorios /></MainLayout>
            </RotaProtegida>
          } />

          {/* DARF */}
          <Route path="/darf" element={
            <RotaProtegida>
              <MainLayout><Darf /></MainLayout>
            </RotaProtegida>
          } />

          {/* Redireciona raiz para dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Qualquer rota desconhecida vai para dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App