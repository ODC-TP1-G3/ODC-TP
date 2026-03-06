import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'

function fmt(b) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(1) + ' MB'
}

export default function PublicFile() {
  const { slug } = useParams()
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    api.getFile(slug).then(setFile).catch(err => setError(err.message))
  }, [slug])

  function handleDownload() {
    if (done) return
    const a = document.createElement('a')
    a.href = `/api/f/${slug}/download`
    a.setAttribute('download', file.originalName)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setDone(true)
    setTimeout(() => api.getFile(slug).then(setFile), 1500)
  }

  if (error) return (
    <div className="center-page">
      <div className="card" style={{ maxWidth: 420, textAlign: 'center' }}>
        <p style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 600 }}>Fichier introuvable</p>
        <p className="text-muted mt-1">{error}</p>
      </div>
    </div>
  )

  if (!file) return (
    <div className="center-page">
      <p className="text-muted">Chargement…</p>
    </div>
  )

  return (
    <div className="center-page">
      <div className="card" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="file-icon">📄</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{file.title}</div>
            <div className="text-muted">{file.originalName}</div>
          </div>
        </div>

        {file.description && <p className="mb-2" style={{ fontSize: '0.9rem', color: '#475569' }}>{file.description}</p>}

        {file.tags && (
          <div className="tags">
            {file.tags.split(',').map(t => <span key={t} className="tag">{t.trim()}</span>)}
          </div>
        )}

        <div className="file-meta-grid">
          <div className="file-meta-item"><span>Taille</span><strong>{fmt(file.size)}</strong></div>
          <div className="file-meta-item"><span>Type</span><strong>{file.mimeType}</strong></div>
          <div className="file-meta-item"><span>Téléchargements</span><strong>{file.downloadCount}</strong></div>
        </div>

        <button onClick={handleDownload} disabled={done} className="btn btn-primary btn-full" style={{ fontSize: '1rem', padding: '0.75rem' }}>
          {done ? '✓ Téléchargé' : '⬇ Télécharger'}
        </button>

        <p className="text-muted mt-1" style={{ textAlign: 'center', fontSize: '0.78rem' }}>
          Mis en ligne le {new Date(file.uploadedAt).toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>
  )
}