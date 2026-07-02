import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

export const fetchNotes = async () => {
  const response = await api.get('/notes')
  return response.data
}

export const createNote = async (payload) => {
  const response = await api.post('/notes', payload)
  return response.data
}

export const updateNote = async (id, payload) => {
  const response = await api.put(`/notes/${id}`, payload)
  return response.data
}

export const toggleFavorite = async (id) => {
  const response = await api.patch(`/notes/${id}/favorite`)
  return response.data
}

export const reorderNotes = async (ids) => {
  const response = await api.patch('/notes/reorder', { ids })
  return response.data
}

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`)
  return response.data
}
