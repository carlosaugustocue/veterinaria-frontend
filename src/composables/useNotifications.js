// composables/useNotifications.js
import { ref, reactive } from 'vue'

// Estado global de notificaciones
const notifications = ref([])
let notificationId = 0

// Configuración por defecto
const defaultConfig = {
  timeout: 5000,
  location: 'top',
  color: 'success'
}

export function useNotifications() {
  
  // Función principal para mostrar notificaciones
  const showNotification = (message, options = {}) => {
    const config = { ...defaultConfig, ...options }
    
    const notification = {
      id: ++notificationId,
      message,
      show: true,
      ...config
    }
    
    notifications.value.push(notification)
    
    // Auto-close después del timeout
    if (config.timeout > 0) {
      setTimeout(() => {
        closeNotification(notification.id)
      }, config.timeout)
    }
    
    return notification.id
  }
  
  // Cerrar notificación específica
  const closeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value[index].show = false
      // Remover después de la animación
      setTimeout(() => {
        notifications.value.splice(index, 1)
      }, 300)
    }
  }
  
  // Cerrar todas las notificaciones
  const closeAllNotifications = () => {
    notifications.value.forEach(notification => {
      notification.show = false
    })
    setTimeout(() => {
      notifications.value.splice(0)
    }, 300)
  }
  
  // Shortcuts para diferentes tipos
  const showSuccess = (message, options = {}) => {
    return showNotification(message, {
      color: 'success',
      icon: 'mdi-check-circle',
      ...options
    })
  }
  
  const showError = (message, options = {}) => {
    return showNotification(message, {
      color: 'error',
      icon: 'mdi-alert-circle',
      timeout: 7000, // Más tiempo para errores
      ...options
    })
  }
  
  const showWarning = (message, options = {}) => {
    return showNotification(message, {
      color: 'warning',
      icon: 'mdi-alert',
      ...options
    })
  }
  
  const showInfo = (message, options = {}) => {
    return showNotification(message, {
      color: 'info',
      icon: 'mdi-information',
      ...options
    })
  }
  
  // Notificación de carga
  const showLoading = (message = 'Cargando...', options = {}) => {
    return showNotification(message, {
      color: 'primary',
      icon: 'mdi-loading',
      timeout: 0, // No se cierra automáticamente
      ...options
    })
  }
  
  // Confirmación con acciones
  const showConfirm = (message, onConfirm, onCancel = null, options = {}) => {
    return showNotification(message, {
      color: 'warning',
      icon: 'mdi-help-circle',
      timeout: 0,
      actions: [
        {
          text: 'Cancelar',
          color: 'grey',
          action: () => {
            if (onCancel) onCancel()
          }
        },
        {
          text: 'Confirmar',
          color: 'primary',
          action: () => {
            if (onConfirm) onConfirm()
          }
        }
      ],
      ...options
    })
  }
  
  return {
    notifications,
    showNotification,
    closeNotification,
    closeAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showConfirm
  }
}