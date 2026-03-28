import { create } from 'zustand'
import api from '../lib/axios'

const useUserStore = create((set) => ({
  profile: null,
  token: null,
  isAuthenticated: false,

  // Initialize from localStorage — call this on client side only
  init: () => {
    const token = localStorage.getItem('token')
    const expiresAt = localStorage.getItem('tokenExpiresAt')
    const expired = expiresAt && Date.now() > Number(expiresAt)

    if (expired) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiresAt')
      return
    }

    if (token) {
      set({ token, isAuthenticated: true })
    }
  },

  signup: async (formData) => {
    const response = await api.post('/auth/signup', formData)
    return response.data
  },

  login: async (formData) => {
  const response = await api.post('/auth/login', {
    email: formData.email,
    password: formData.password
  })
  const token = response.data.token
  const expiresAt = Date.now() + 60 * 60 * 1000

  // Save to both localStorage AND cookie
  localStorage.setItem('token', token)
  localStorage.setItem('tokenExpiresAt', expiresAt)
  document.cookie = `token=${token}; path=/; max-age=3600` // ← 1 hour

  set({ token, isAuthenticated: true })
  return response.data
},

  fetchProfile: async () => {
    try {
      const response = await api.get('/users/me')
      set({ profile: response.data })
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiresAt')
      set({ token: null, profile: null, isAuthenticated: false })
    }
  },

  updateProfile: async (updateData) => {
    const response = await api.patch('/users/me', updateData)
    set({ profile: response.data })
  },

  logout: () => {
  localStorage.removeItem('token')
  localStorage.removeItem('tokenExpiresAt')
  document.cookie = 'token=; path=/; max-age=0' // ← clear cookie
  set({ token: null, profile: null, isAuthenticated: false })
}
}))

export default useUserStore