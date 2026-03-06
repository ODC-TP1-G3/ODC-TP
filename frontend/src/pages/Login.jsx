import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await api.login(username, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center-page">
      <div className="card" style={{ maxWidth: 400 }}>
        <h1 style={{ textAlign: 'center', color: '#6366f1', marginBottom: '1.5rem', fontSize: '1.4rem' }}>
          🗂 FileShare — Admin
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Identifiant</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} autoFocus required />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}