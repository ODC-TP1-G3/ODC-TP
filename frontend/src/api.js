const BASE = '/api'

async function req(method, path, body, isForm = false) {
  const opts = {
    method,
    credentials: 'include',
    headers: isForm ? undefined : (body ? { 'Content-Type': 'application/json' } : {}),
    body: isForm ? body : (body ? JSON.stringify(body) : undefined),
  }
  const res = await fetch(BASE + path, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Erreur serveur')
  }
  return res.json()
}

export const api = {
  login:       (username, password) => req('POST', '/auth/login', { username, password }),
  logout:      () => req('POST', '/auth/logout'),
  me:          () => req('GET', '/auth/me'),
  getFile:     (slug) => req('GET', `/f/${slug}`),
  listFiles:   () => req('GET', '/admin/files'),
  uploadFile:  (form) => req('POST', '/admin/files', form, true),
  updateFile:  (id, data) => req('PATCH', `/admin/files/${id}`, data),
  replaceFile: (id, form) => req('PUT', `/admin/files/${id}/replace`, form, true),
  deleteFile:  (id) => req('DELETE', `/admin/files/${id}`),
  getQRCode:   (id) => req('GET', `/admin/files/${id}/qrcode`),
  getStats:    (from, to) => {
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    return req('GET', `/admin/stats?${p}`)
  },
}