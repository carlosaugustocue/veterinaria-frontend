// composables/useApi.js
import { ref } from 'vue'
import api from '@/api/axios' // Tu instancia de axios configurada

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, url, data = null, config = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await api({
        method,
        url,
        data,
        ...config
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Error en la petición'
      console.error('API Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const get = (url, config) => request('get', url, null, config)
  const post = (url, data, config) => request('post', url, data, config)
  const put = (url, data, config) => request('put', url, data, config)
  const del = (url, config) => request('delete', url, null, config)

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del
  }
}