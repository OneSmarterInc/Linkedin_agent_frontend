import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function ProcessingPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [data, setData] = useState(null)
  useEffect(() => {
    let timer, cancelled = false
    async function poll() {
      try {
        const { data: result } = await api.get(`/profiles/${id}/status/`)
        if (cancelled) return
        setData(result)
        if (result.status === 'COMPLETE') {
          if (!result.run?.images_failed && !result.run?.error) nav(`/profiles/${id}`, { replace: true })
          return
        }
        if (result.status === 'FAILED') return
        timer = setTimeout(poll, 1200)
      } catch { if (!cancelled) timer = setTimeout(poll, 2000) }
    }
    poll()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [id, nav])
  const run = data?.run
  const pct = run?.images_total ? Math.round(run.images_done / run.images_total * 100) : 0
  const warnings = data?.status === 'COMPLETE' && (run?.images_failed > 0 || Boolean(run?.error))
  return <div className="card">
    <h1>{warnings ? 'Agent finished with warnings' : 'Agentic photo extraction'}</h1>
    <p>Status: <strong>{data?.status || 'Starting…'}</strong></p>
    {data?.agent?.stage && <p>Agent stage: <strong>{data.agent.stage.replaceAll('_', ' ')}</strong></p>}
    <div className="progress"><div style={{width: `${pct}%`}}/></div>
    <p>{run ? `${run.images_done} / ${run.images_total} images checked` : ''}</p>
    {run && <p><small>{run.images_succeeded} succeeded · {run.images_failed} failed</small></p>}
    <p>The AI chooses which OCR passage to inspect or extract, whether to reread a region of the image, and when to finish or request a clearer image. Section boundaries and evidence checks remain enforced.</p>
    <p>Each image has limited tool calls and retries. If planning fails, the app records a workflow fallback. You can review executed actions under Source images in the results.</p>
    {warnings && <><div className="warning">Supported information was saved. Some images or sections need review.<pre>{run.error}</pre></div><Link className="button" to={`/profiles/${id}`}>View extracted profile</Link></>}
    {data?.status === 'FAILED' && <div className="error">{data.last_error || run?.error || 'Processing failed.'}</div>}
  </div>
}
