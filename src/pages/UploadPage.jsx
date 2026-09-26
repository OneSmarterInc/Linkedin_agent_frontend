import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function UploadPage(){
 const {id}=useParams();const nav=useNavigate();const [files,setFiles]=useState([]);const [images,setImages]=useState([]);const [error,setError]=useState('');const [busy,setBusy]=useState(false)
 async function load(){const {data}=await api.get(`/profiles/${id}/images/`);setImages(data)}
 useEffect(()=>{load()},[id])
 async function upload(){if(!files.length)return;setBusy(true);setError('');const fd=new FormData();files.forEach(f=>fd.append('images',f));try{await api.post(`/profiles/${id}/images/`,fd,{headers:{'Content-Type':'multipart/form-data'}});setFiles([]);await load()}catch(e){setError(e.response?.data?.detail||'Upload failed')}finally{setBusy(false)}}
 async function process(){setBusy(true);setError('');try{await api.post(`/profiles/${id}/process/`);nav(`/profiles/${id}/processing`)}catch(e){setError(e.response?.data?.detail||'Could not start processing');setBusy(false)}}
 return <div><div className="page-title"><div><h1>Upload images</h1><p>PNG, JPG, JPEG or WEBP. Images may contain any content.</p></div></div>
 <div className="card"><input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={e=>setFiles([...e.target.files])}/><div className="row"><button disabled={!files.length||busy} onClick={upload}>Upload selected</button><button className="secondary" disabled={!images.length||busy} onClick={process}>Process images</button></div>{error&&<div className="error">{error}</div>}</div>
 <div className="card"><h2>Uploaded</h2>{images.length===0?<p>No images uploaded.</p>:<ul className="clean-list">{images.map(i=><li key={i.id}>{i.original_name}<span className="badge">{i.status}</span></li>)}</ul>}</div></div>
}
