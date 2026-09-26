import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function UploadPage(){
 const {id}=useParams();const nav=useNavigate();const [files,setFiles]=useState([]);const [images,setImages]=useState([]);const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [inputKey,setInputKey]=useState(0)
 const errorMessage=(e,fallback)=>e.response?.data?.detail||Object.values(e.response?.data||{}).flat().join(' ')||fallback
 async function load(){const {data}=await api.get(`/profiles/${id}/images/`);setImages(data)}
 useEffect(()=>{load()},[id])
 async function upload(){if(!files.length)return;setBusy(true);setError('');const fd=new FormData();files.forEach(f=>fd.append('images',f));fd.append('auto_process','true');try{await api.post(`/profiles/${id}/images/`,fd);setFiles([]);setInputKey(k=>k+1);nav(`/profiles/${id}/processing`)}catch(e){setError(errorMessage(e,'Upload failed'));setBusy(false)}}
 async function process(){if(files.length){setError('Upload or clear the selected files before starting the batch.');return}setBusy(true);setError('');try{await api.post(`/profiles/${id}/process/`);nav(`/profiles/${id}/processing`)}catch(e){setError(errorMessage(e,'Could not start processing'));setBusy(false)}}
 return <div><div className="page-title"><div><h1>Autonomous photo agent</h1><p>Upload PNG, JPG, JPEG or WEBP images. The agent starts automatically.</p></div></div>
 <div className="card"><input key={inputKey} type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={e=>setFiles(Array.from(e.target.files||[]))}/>{files.length>0&&<div className="selection"><strong>{files.length} selected</strong><ul>{files.map((f,index)=><li key={`${f.name}-${f.size}-${index}`}>{f.name}</li>)}</ul><button className="linkbtn" disabled={busy} onClick={()=>{setFiles([]);setInputKey(k=>k+1)}}>Clear selection</button></div>}<div className="row"><button disabled={!files.length||busy} onClick={upload}>{busy?'Starting agent…':`Upload & run agent${files.length?` (${files.length})`:''}`}</button><button className="secondary" disabled={!images.length||files.length>0||busy} onClick={process}>Rerun agent on {images.length||''} images</button></div>{files.length>0&&images.length>0&&<small>The agent will re-evaluate every uploaded image and merge the trustworthy results.</small>}{error&&<div className="error">{error}</div>}</div>
 <div className="card"><h2>Uploaded</h2>{images.length===0?<p>No images uploaded.</p>:<ul className="clean-list">{images.map(i=><li key={i.id}>{i.original_name}<span className="badge">{i.status}</span></li>)}</ul>}</div></div>
}
