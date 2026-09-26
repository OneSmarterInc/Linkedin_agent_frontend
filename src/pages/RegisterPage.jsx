import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function RegisterPage() {
  const [form, setForm] = useState({ username:'', email:'', password:'' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  async function submit(e) {
    e.preventDefault(); setError('')
    try { await api.post('/auth/register/', form); navigate('/login') }
    catch (err) { setError(JSON.stringify(err.response?.data || 'Registration failed')) }
  }
  return <div className="card auth-card"><h1>Create account</h1><form onSubmit={submit}>
    <label>Username<input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required /></label>
    <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></label>
    <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={8}/></label>
    {error && <div className="error">{error}</div>}<button type="submit">Register</button>
  </form><p>Already registered? <Link to="/login">Login</Link></p></div>
}
