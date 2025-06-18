// src/stores/propietarios.js (Versión Simplificada)
import { defineStore } from 'pinia'
import api from '@/api/axios'

export const usePropietariosStore = defineStore('propietarios', {
  state: () => ({
    propietarios: [],
    propietarioActual: null,
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 1,
      to: 15,
      has_next_page: false,
      has_prev_page: false
    }
  }),

  getters: {
    totalPropietarios: (state) => state.pagination.total,
    propietariosPaginados: (state) => state.propietarios,
    tieneSiguientePagina: (state) => state.pagination.has_next_page,
    tieneAnteriorPagina: (state) => state.pagination.has_prev_page,
    paginaActual: (state) => state.pagination.current_page,
    totalPaginas: (state) => state.pagination.last_page
  },

  actions: {
    async fetchPropietarios(page = 1, perPage = 15) {
      this.loading = true
      try {
        console.log(`Solicitando propietarios - Página: ${page}, Por página: ${perPage}`)
        
        const params = {
          page,
          per_page: perPage
        }

        const response = await api.get('/propietarios', { params })
        
        console.log('Respuesta completa del store:', response.data)
        
        if (response.data.success) {
          this.propietarios = response.data.data || []
          
          if (response.data.pagination) {
            this.pagination = response.data.pagination
          }
          
          console.log('Propietarios guardados en store:', this.propietarios.length)
        }
        
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Error en store al obtener propietarios:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al cargar propietarios'
        }
      } finally {
        this.loading = false
      }
    },

    async fetchPropietario(id) {
      this.loading = true
      try {
        console.log('Obteniendo propietario con ID:', id)
        
        const response = await api.get(`/propietarios/${id}`)
        
        console.log('Respuesta del propietario individual:', response.data)
        
        if (response.data.success) {
          this.propietarioActual = response.data.data
        }
        
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Error al obtener propietario:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al cargar propietario'
        }
      } finally {
        this.loading = false
      }
    },

    async crearPropietario(datosUsuario, datosPropietario) {
      this.loading = true
      try {
        console.log('Creando propietario:', { datosUsuario, datosPropietario })
        
        // Crear usuario y propietario
        const response = await api.post('/propietarios', {
          user: datosUsuario,
          propietario: datosPropietario
        })
        
        if (response.data.success) {
          await this.fetchPropietarios() // Recargar lista
        }
        
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Error al crear propietario:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al crear propietario',
          errors: error.response?.data?.errors || null
        }
      } finally {
        this.loading = false
      }
    },

    async actualizarPropietario(id, datos) {
      this.loading = true
      try {
        console.log('Actualizando propietario:', id, datos)
        
        const response = await api.put(`/propietarios/${id}`, datos)
        
        if (response.data.success) {
          await this.fetchPropietarios() // Recargar lista
          if (this.propietarioActual?.id === id) {
            await this.fetchPropietario(id) // Recargar detalle si está abierto
          }
        }
        
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Error al actualizar propietario:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al actualizar propietario',
          errors: error.response?.data?.errors || null
        }
      } finally {
        this.loading = false
      }
    },

    async eliminarPropietario(id) {
      this.loading = true
      try {
        console.log('Eliminando propietario:', id)
        
        const response = await api.delete(`/propietarios/${id}`)
        
        if (response.data.success) {
          await this.fetchPropietarios() // Recargar lista
        }
        
        return { success: true }
      } catch (error) {
        console.error('Error al eliminar propietario:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Error al eliminar propietario'
        }
      } finally {
        this.loading = false
      }
    },

    // Limpiar propietario actual
    limpiarPropietarioActual() {
      this.propietarioActual = null
    },

    // Cambiar página
    async cambiarPagina(page) {
      await this.fetchPropietarios(page)
    }
  }
})