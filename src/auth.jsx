import React, { createContext, useContext, useEffect, useState } from 'react'
import api from './api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    const token = localStorage.getItem('access')
    if (!token) { setUser(null); setLoading(false); return }
    try { const { data } = await api.get('/auth/me/'); setUser(data) }
    catch { setUser(null) }
    finally { setLoading(false) }
  }
  useEffect(() => { loadUser() }, [])

  async function login(username, password) {
    const { data } = await api.post('/auth/token/', { username, password })
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    await loadUser()
  }
  function logout() {
    localStorage.removeItem('access'); localStorage.removeItem('refresh'); setUser(null)
  }
  return <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: loadUser }}>{children}</AuthContext.Provider>
}
