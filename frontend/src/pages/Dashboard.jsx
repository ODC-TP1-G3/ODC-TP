import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

function fmt(b) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(1) + ' MB'
}

// ── Upload Modal ───────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return setError('Sélectionnez un fichier')
    setError(''); setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('title', title)
      if (description) form.append('description', description)
      if (tags) form.append('tags', tags)
      await api.uploadFile(form)
      onSuccess()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-title">📤 Ajouter un fichier</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Titre *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group"><label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-group"><label>Tags (séparés par virgule)</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="ex: cours,devops" />
          </div>
          <div className="form-group"><label>Fichier *</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} required />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Edit Modal ─────────────────────────────────────────────────
function EditModal({ file, onClose, onSuccess }) {
  const [title, setTitle] = useState(file.title)
  const [description, setDescription] = useState(file.description || '')
  const [tags, setTags] = useState(file.tags || '')
  const [active, setActive] = useState(file.active)
  const [newFile, setNewFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await api.updateFile(file.id, { title, description, tags, active })
      if (newFile) {
        const form = new FormData()
        form.append('file', newFile)
        await api.replaceFile(file.id, form)
      }
      onSuccess()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-title">✏️ Modifier — {file.title}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Titre *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group"><label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-group"><label>Tags</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
              Fichier actif (accessible publiquement)
            </label>
          </div>
          <div className="form-group"><label>Remplacer le fichier (optionnel)</label>
            <input type="file" onChange={e => setNewFile(e.target.files[0])} />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── QR Modal ───────────────────────────────────────────────────
function QRModal({ fileId, onClose }) {
  const [data, setData] = useState(null)
  useEffect(() => { api.getQRCode(fileId).then(setData) }, [fileId])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '2rem',
      animation: 'fadeIn 0.2s ease',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        background: 'rgba(255,255,255,0.1)', border: 'none',
        color: '#fff', borderRadius: '50%',
        width: 42, height: 42, fontSize: '1.2rem',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>✕</button>

      <div style={{ textAlign: 'center', color: '#fff' }}>
        <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Lien public
        </p>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '2rem', color: '#f1f5f9' }}>
          Scanner pour télécharger
        </h2>

        {data ? (
          <>
            <div style={{
              background: '#fff', borderRadius: 16,
              padding: '1.5rem', display: 'inline-block',
              boxShadow: '0 0 80px rgba(99,102,241,0.5)',
              marginBottom: '1.5rem',
            }}>
              <img src={data.qr} alt="QR" style={{ width: 240, height: 240, display: 'block' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#475569', wordBreak: 'break-all', marginBottom: '1.5rem', maxWidth: 320 }}>
              {data.publicUrl}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={data.qr} download="qrcode.png" className="btn btn-primary">⬇ Télécharger le QR</a>
              <button className="btn btn-outline" style={{ color: '#94a3b8', borderColor: '#334155' }}
                onClick={() => navigator.clipboard.writeText(data.publicUrl)}>
                📋 Copier le lien
              </button>
            </div>
          </>
        ) : <p style={{ color: '#475569' }}>Génération...</p>}
      </div>
    </div>
  )
}

// ── Stats Panel ────────────────────────────────────────────────
function StatsPanel() {
  const [stats, setStats] = useState(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const load = useCallback(() => {
    api.getStats(from || undefined, to || undefined).then(setStats)
  }, [from, to])

  useEffect(() => { load() }, [])

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Depuis</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ width: 'auto' }} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label>Jusqu'au</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} style={{ width: 'auto' }} />
        </div>
        <button className="btn btn-primary btn-sm" onClick={load}>Filtrer</button>
      </div>

      {stats && (
        <>
          <div className="stat-box">
            <p>Total téléchargements</p>
            <p>{stats.totalDownloads}</p>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fichier</th>
                  <th>Slug</th>
                  <th style={{ textAlign: 'right' }}>Téléchargements</th>
                </tr>
              </thead>
              <tbody>
                {stats.perFile.length === 0
                  ? <tr><td colSpan={3}><div className="empty"><div className="empty-icon">📊</div><p>Aucune donnée</p></div></td></tr>
                  : stats.perFile.map(f => (
                    <tr key={f.id}>
                      <td>{f.title}</td>
                      <td className="text-muted">{f.slug}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>{f.downloads}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// ── Dashboard Main ─────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab] = useState('files')
  const [files, setFiles] = useState([])
  const [username, setUsername] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [editFile, setEditFile] = useState(null)
  const [qrFileId, setQrFileId] = useState(null)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const loadFiles = useCallback(() => {
    api.listFiles().then(setFiles).catch(() => navigate('/login'))
  }, [navigate])

  useEffect(() => {
    api.me().then(u => setUsername(u.username)).catch(() => navigate('/login'))
    loadFiles()
  }, [])

  async function handleDelete(id, title) {
    if (!confirm(`Supprimer "${title}" ?`)) return
    await api.deleteFile(id)
    loadFiles()
  }

  return (
    <>
      <header className="header">
        <span className="header-logo">🗂 FileShare</span>
        <div className="header-user">
          <span>Connecté : <strong>{username}</strong></span>
          <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Changer le thème">
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => api.logout().then(() => navigate('/login'))}>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="page-wrap">
        <div className="tabs">
          <button className={`tab ${tab === 'files' ? 'active' : ''}`} onClick={() => setTab('files')}>📁 Fichiers</button>
          <button className={`tab ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>📊 Statistiques</button>
        </div>

        {tab === 'files' && (
          <>
            <div className="flex-between">
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Fichiers ({files.length})</h2>
              <button className="btn btn-primary" onClick={() => setShowUpload(true)}>+ Ajouter</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Titre</th><th>Fichier</th><th>Taille</th>
                    <th>Date</th><th>Statut</th><th>DL</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.length === 0
                    ? <tr><td colSpan={7}><div className="empty"><div className="empty-icon">📂</div><p>Aucun fichier uploadé</p></div></td></tr>
                    : files.map(f => (
                      <tr key={f.id}>
                        <td><strong>{f.title}</strong></td>
                        <td className="text-muted">{f.originalName}</td>
                        <td>{fmt(f.size)}</td>
                        <td>{new Date(f.uploadedAt).toLocaleDateString('fr-FR')}</td>
                        <td><span className={`badge ${f.active ? 'badge-green' : 'badge-red'}`}>{f.active ? 'Actif' : 'Inactif'}</span></td>
                        <td><span className="badge badge-blue">{f.downloadCount}</span></td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-outline btn-sm" onClick={() => setQrFileId(f.id)} title="QR Code">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
                                <rect x="19" y="14" width="2" height="2"/><rect x="14" y="19" width="2" height="2"/>
                                <rect x="18" y="18" width="3" height="3"/>
                              </svg>
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditFile(f)} title="Modifier">✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id, f.title)} title="Supprimer">🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'stats' && (
          <div className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>📊 Statistiques</h2>
            <StatsPanel />
          </div>
        )}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={() => { setShowUpload(false); loadFiles() }} />}
      {editFile && <EditModal file={editFile} onClose={() => setEditFile(null)} onSuccess={() => { setEditFile(null); loadFiles() }} />}
      {qrFileId && <QRModal fileId={qrFileId} onClose={() => setQrFileId(null)} />}
    </>
  )
}