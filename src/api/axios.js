// src/api/axios.js
import axios from 'axios'

// Crear instancia de axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 segundos
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejo de respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Si el token ha expirado o no es válido
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirigir al login
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api