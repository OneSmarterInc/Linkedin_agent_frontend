import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function ProcessingPage(){
 const {id}=useParams();const nav=useNavigate();const [data,setData]=useState(null)
 useEffect(()=>{let timer;async function poll(){try{const r=await api.get(`/profiles/${id}/status/`);setData(r.data);if(r.data.status==='COMPLETE'){nav(`/profiles/${id}`,{replace:true});return}if(r.data.status==='FAILED')return;timer=setTimeout(poll,1200)}catch{timer=setTimeout(poll,2000)}}poll();return()=>clearTimeout(timer)},[id,nav])
 const run=data?.run;const pct=run?.images_total?Math.round((run.images_done/run.images_total)*100):0
 return <div className="card"><h1>Processing</h1><p>Status: <strong>{data?.status||'Starting…'}</strong></p><div className="progress"><div style={{width:`${pct}%`}}/></div><p>{run?`${run.images_done} / ${run.images_total} images OCR processed`:''}</p><p>The next steps structure, validate, merge and save the extracted information.</p>{data?.status==='FAILED'&&<div className="error">{data.last_error||run?.error||'Processing failed.'}</div>}</div>
}
