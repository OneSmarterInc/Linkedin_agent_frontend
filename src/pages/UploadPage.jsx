import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import { UPLOAD_SECTIONS, emptySelection, selectionCount, uploadFormData } from '../uploadSections'
import './UploadPage.css'

const errorMessage = (e, fallback) => e.response?.data?.detail || fallback

export default function UploadPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [selected, setSelected] = useState(emptySelection)
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const count = selectionCount(selected)
  const disabled = busy || loading || processing

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSelected(emptySelection())
    Promise.all([api.get(`/profiles/${id}/images/`), api.get(`/profiles/${id}/`)])
      .then(([uploaded, profile]) => {
        if (!cancelled) {
          setImages(uploaded.data)
          setProcessing(profile.data.status === 'PROCESSING')
        }
      })
      .catch(e => { if (!cancelled) setError(errorMessage(e, 'Could not load uploaded images. Please reload.')) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  async function start() {
    if (disabled || (!count && !images.length)) return
    setBusy(true)
    setError('')
    try {
      if (count) await api.post(`/profiles/${id}/images/`, uploadFormData(selected))
      else await api.post(`/profiles/${id}/process/`)
      setSelected(emptySelection())
      nav(`/profiles/${id}/processing`)
    } catch (e) {
      setError(errorMessage(e, 'Could not upload or start processing. Your selections have been kept.'))
      setBusy(false)
    }
  }

  async function changeSection(image, section) {
    setBusy(true)
    setError('')
    try {
      const { data } = await api.patch(`/profiles/${id}/images/${image.id}/`, { section })
      setImages(items => items.map(item => item.id === image.id ? data : item))
    } catch (e) {
      setError(errorMessage(e, 'Could not change the image section.'))
    } finally { setBusy(false) }
  }

  function storedImages(items) {
    return <ul className="clean-list">{items.map(image => <li key={image.id} style={{flexWrap:'wrap', gap:8}}>
      <span>{image.original_name} <span className="badge">{image.status}</span></span>
      <label style={{margin:0}}>Section for {image.original_name}
        <select value={image.section || 'AUTO'} disabled={disabled} onChange={e => changeSection(image, e.target.value)}>
          <option value="AUTO">Automatic (legacy)</option>
          {UPLOAD_SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>
    </li>)}</ul>
  }

  return <div>
    <div className="page-title"><div><h1>Upload images by section</h1>
      <p>Add multiple PNG, JPG, JPEG, or WEBP images to any of the four sections.</p></div></div>
    <p>The agent processes Profile → Experience → Education → Certificates, one image at a time. Each image can only fill fields in its selected section. Only upload screenshots belonging to this person.</p>
    {error && <div className="error" role="alert">{error}</div>}
    {processing && <div className="warning">A batch is already processing. <Link to={`/profiles/${id}/processing`}>View progress</Link></div>}
    <div className="upload-grid">
      {UPLOAD_SECTIONS.map(section => {
        const files = selected[section.value]
        const uploaded = images.filter(image => image.section === section.value)
        return <section className="card" key={section.value} aria-labelledby={`heading-${section.value}`}>
          <h2 id={`heading-${section.value}`}>{section.label}</h2>
          <p>{section.description}</p>
          <label htmlFor={`upload-${section.value}`}>Add {section.label.toLowerCase()}
            <input id={`upload-${section.value}`} type="file" multiple accept="image/png,image/jpeg,image/webp" disabled={disabled}
              onChange={e => {
                const added = Array.from(e.target.files || [])
                setSelected(current => ({...current, [section.value]: [...current[section.value], ...added]}))
                e.target.value = ''
              }}/>
          </label>
          {files.length > 0 && <div className="selection"><strong>{files.length} selected</strong><ul>
            {files.map((file, index) => <li key={`${file.name}-${index}`}>{file.name} <button className="linkbtn" disabled={disabled}
              aria-label={`Remove ${file.name} from ${section.label}`} onClick={() => setSelected(current => ({...current, [section.value]: current[section.value].filter((_, i) => i !== index)}))}>Remove</button></li>)}
          </ul></div>}
          <h3>Uploaded ({uploaded.length})</h3>
          {uploaded.length ? storedImages(uploaded) : <p className="muted">No images in this section yet.</p>}
        </section>
      })}
    </div>
    {images.some(image => !image.section || image.section === 'AUTO') && <section className="card"><h2>Earlier uploads — choose a section</h2>
      <p>These images still use automatic detection. Assign a section above each image and rerun for more focused extraction.</p>
      {storedImages(images.filter(image => !image.section || image.section === 'AUTO'))}</section>}
    <div className="card"><strong>{count} selected · {images.length} already uploaded</strong>
      <p>You can leave sections empty. Processing includes all saved images and new selections. Section changes take effect when you rerun.</p>
      <button disabled={disabled || (!count && !images.length)} onClick={start}>
        {busy ? 'Saving / starting…' : count ? `Upload & process ${count} new images` : `Rerun all ${images.length} images`}
      </button>
    </div>
  </div>
}
