import React from 'react'
import { Navigate, Route, Routes, Link } from 'react-router-dom'
import { useAuth } from './auth'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import ProcessingPage from './pages/ProcessingPage'
import ProfilePage from './pages/ProfilePage'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="center">Loading…</div>
  return user ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  const { user, logout } = useAuth()
  return <>
    <header><Link className="brand" to="/">AI Profile Agent</Link>{user && <div className="nav-right"><span>{user.username}</span><button className="linkbtn" onClick={logout}>Logout</button></div>}</header>
    <main>{children}</main>
  </>
}

export default function App() {
  return <Layout><Routes>
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<Protected><DashboardPage /></Protected>} />
    <Route path="/profiles/:id/upload" element={<Protected><UploadPage /></Protected>} />
    <Route path="/profiles/:id/processing" element={<Protected><ProcessingPage /></Protected>} />
    <Route path="/profiles/:id" element={<Protected><ProfilePage /></Protected>} />
  </Routes></Layout>
}
