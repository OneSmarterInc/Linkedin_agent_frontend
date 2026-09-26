import React from 'react'

const names = {
  inspect: 'Inspect OCR passage', extract: 'Extract and validate passage',
  retry_ocr: 'Reread image region', finish: 'Finish image',
  request_clearer_image: 'Request clearer image', decision_error: 'Reject invalid action',
  fallback: 'Use extraction workflow fallback', fallback_extract: 'Fallback extraction',
  limit: 'Stop at agent budget',
}

export default function AgentHistory({ trace = [] }) {
  if (!trace.length) return <p className="muted">No agent actions recorded for this image yet.</p>
  return <details><summary>Agent actions ({trace.length})</summary><ol>
    {trace.map((event, index) => <li key={`${event.step}-${index}`} style={{marginBottom:10}}>
      <strong>{names[event.action] || event.action}</strong> — {String(event.outcome || '').replaceAll('_', ' ')}
      {Number.isInteger(event.chunk) && <span> · passage {event.chunk + 1}</span>}
      {event.region && <span> · {event.region} / {event.mode}</span>}
      {Number.isInteger(event.facts_added) && <span> · {event.facts_added} new validated observations</span>}
      {event.error && <p className="warning">{event.error}</p>}
      {event.notes?.length > 0 && <ul>{event.notes.map((note, i) => <li key={i}>{note}</li>)}</ul>}
    </li>)}
  </ol><small>These are executed tool actions and outcomes, not a guarantee that every visible fact was recovered.</small></details>
}
