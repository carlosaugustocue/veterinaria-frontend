// src/stores/auth.js (Versión Real - Sin Mock)
import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role?.nombre || null,
    isAdmin: (state) => state.user?.role?.nombre === 'administrador',
    isVeterinario: (state) => state.user?.role?.nombre === 'veterinario',
    isCliente: (state) => state.user?.role?.nombre === 'cliente',
    userName: (state) => {
      if (state.user) {
        return `${state.user.nombre} ${state.user.apellido}`
      }
      return 'Usuario'
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const response = await api.post('/auth/login', credentials)
        const { user, token } = response.data.data
        
        this.user = user
        this.token = token
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Error en login:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al iniciar sesión' 
        }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const response = await api.post('/auth/register', userData)
        const { user, token } = response.data.data
        
        this.user = user
        this.token = token
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Error en registro:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al registrar usuario',
          errors: error.response?.data?.errors || null
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
      
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async fetchUser() {
      try {
        const response = await api.get('/auth/me')
        this.user = response.data.data.user
        localStorage.setItem('user', JSON.stringify(this.user))
        return { success: true }
      } catch (error) {
        console.error('Error al obtener usuario:', error)
        this.logout()
        return { success: false }
      }
    }
  }
})