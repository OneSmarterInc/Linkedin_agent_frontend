import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function ProcessingPage(){
 const {id}=useParams();const nav=useNavigate();const [data,setData]=useState(null)
 useEffect(()=>{let timer;let cancelled=false;async function poll(){try{const r=await api.get(`/profiles/${id}/status/`);if(cancelled)return;setData(r.data);if(r.data.status==='COMPLETE'){if(!r.data.run?.images_failed)nav(`/profiles/${id}`,{replace:true});return}if(r.data.status==='FAILED')return;timer=setTimeout(poll,1200)}catch{if(!cancelled)timer=setTimeout(poll,2000)}}poll();return()=>{cancelled=true;clearTimeout(timer)}},[id,nav])
 const run=data?.run;const pct=run?.images_total?Math.round((run.images_done/run.images_total)*100):0
 const completeWithWarnings=data?.status==='COMPLETE'&&run?.images_failed>0
 return <div className="card"><h1>{completeWithWarnings?'Processing complete with warnings':'Processing'}</h1><p>Status: <strong>{data?.status||'Starting…'}</strong></p><div className="progress"><div style={{width:`${pct}%`}}/></div><p>{run?`${run.images_done} / ${run.images_total} images fully processed`:''}</p>{run&&<p><small>{run.images_succeeded} succeeded · {run.images_failed} failed</small></p>}<p>Each image is OCRed, structured, evidence-checked, and merged before it counts as done.</p>{completeWithWarnings&&<><div className="warning">Successful images were saved. Some images could not be used.<pre>{run.error}</pre></div><Link className="button" to={`/profiles/${id}`}>View extracted profile</Link></>}{data?.status==='FAILED'&&<div className="error">{data.last_error||run?.error||'Processing failed.'}</div>}</div>
}
