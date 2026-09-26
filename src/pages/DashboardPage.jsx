import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function DashboardPage(){
 const [profiles,setProfiles]=useState([]); const nav=useNavigate()
 async function load(){const {data}=await api.get('/profiles/');setProfiles(data.results||data)}
 useEffect(()=>{load()},[])
 async function create(){const {data}=await api.post('/profiles/',{});nav(`/profiles/${data.id}/upload`)}
 return <div><div className="page-title"><div><h1>Profiles</h1><p>Upload images and extract only the information they actually contain.</p></div><button onClick={create}>Create profile</button></div>
 <div className="grid">{profiles.length===0?<div className="card"><p>No profiles yet.</p></div>:profiles.map(p=><Link className="card profile-card" to={p.status==='CREATED'?`/profiles/${p.id}/upload`:`/profiles/${p.id}`} key={p.id}><strong>{p.name||`Profile #${p.id}`}</strong><span>{p.headline||'No headline found'}</span><span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span></Link>)}</div></div>
}
