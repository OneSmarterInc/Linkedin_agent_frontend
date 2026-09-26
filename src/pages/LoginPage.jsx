import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function LoginPage() {
  const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState('')
  const { login } = useAuth(); const nav=useNavigate()
  async function submit(e){e.preventDefault();setError('');try{await login(username,password);nav('/')}catch{setError('Invalid username or password.')}}
  return <div className="card auth-card"><h1>Login</h1><form onSubmit={submit}>
    <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required/></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
    {error&&<div className="error">{error}</div>}<button>Login</button>
  </form><p>Need an account? <Link to="/register">Register</Link></p></div>
}
