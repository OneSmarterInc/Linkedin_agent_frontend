import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api'

const Empty=()=> <span className="muted">No information found</span>
function Section({title,children}){return <section className="card"><h2>{title}</h2>{children}</section>}
export default function ProfilePage(){
 const {id}=useParams();const [p,setP]=useState(null);const [evidence,setEvidence]=useState([])
 useEffect(()=>{api.get(`/profiles/${id}/`).then(r=>setP(r.data));api.get(`/profiles/${id}/evidence/`).then(r=>setEvidence(r.data))},[id])
 if(!p)return <div className="center">Loading…</div>
 if(p.status==='PROCESSING')return <div className="card"><p>Still processing.</p><Link to={`/profiles/${id}/processing`}>View progress</Link></div>
 return <div><div className="page-title"><div><h1>{p.name||'Unnamed profile'}</h1><p>{p.headline||'No headline found'}</p></div><Link className="button secondary" to={`/profiles/${id}/upload`}>Add images</Link></div>
 <Section title="About">{p.about?<p>{p.about}</p>:<Empty/>}</Section>
 <Section title="Location">{p.location?<p>{p.location}</p>:<Empty/>}</Section>
 <Section title="Skills">{p.skills.length?<div className="chips">{p.skills.map(s=><span className="chip" key={s.id}>{s.name}</span>)}</div>:<Empty/>}</Section>
 <Section title="Experience">{p.experiences.length?p.experiences.map(x=><div className="item" key={x.id}><strong>{x.title||'Untitled role'}</strong><div>{x.company}</div><small>{[x.start_date,x.end_date].filter(Boolean).join(' – ')}</small>{x.description&&<p>{x.description}</p>}</div>):<Empty/>}</Section>
 <Section title="Education">{p.education.length?p.education.map(x=><div className="item" key={x.id}><strong>{x.institution||'Education'}</strong><div>{[x.degree,x.field_of_study].filter(Boolean).join(' — ')}</div><small>{[x.start_date,x.end_date].filter(Boolean).join(' – ')}</small></div>):<Empty/>}</Section>
 <Section title="Projects">{p.projects.length?p.projects.map(x=><div className="item" key={x.id}><strong>{x.name||'Project'}</strong>{x.description&&<p>{x.description}</p>}{x.technologies?.length>0&&<div className="chips">{x.technologies.map(t=><span className="chip" key={t}>{t}</span>)}</div>}{x.url&&<a href={x.url} target="_blank">{x.url}</a>}</div>):<Empty/>}</Section>
 <Section title="Posts">{p.posts.length?p.posts.map(x=><div className="item" key={x.id}><p>{x.text}</p>{x.date&&<small>{x.date}</small>}{x.topics?.length>0&&<div className="chips">{x.topics.map(t=><span className="chip" key={t}>{t}</span>)}</div>}</div>):<Empty/>}</Section>
 <Section title="Certifications">{p.certifications.length?p.certifications.map(x=><div className="item" key={x.id}><strong>{x.name||'Certification'}</strong><div>{x.issuer}</div><small>{x.issue_date}</small></div>):<Empty/>}</Section>
 <Section title="Source evidence">{evidence.length?<details><summary>{evidence.length} validated facts</summary><ul className="evidence-list">{evidence.map(e=><li key={e.id}><strong>{e.field_name}:</strong> {e.value}<br/><small>{e.source_image_name}: “{e.evidence_text}”</small></li>)}</ul></details>:<Empty/>}</Section>
 </div>
}
