<template>
    <div class="app-notifications">
      <v-snackbar
        v-for="notification in notifications"
        :key="notification.id"
        v-model="notification.show"
        :color="notification.color"
        :timeout="notification.timeout"
        :location="notification.location"
        :multi-line="notification.message.length > 60"
        :vertical="!!notification.actions"
        class="app-snackbar"
      >
        <div class="d-flex align-center">
          <v-icon
            v-if="notification.icon"
            :class="notification.icon === 'mdi-loading' ? 'rotating' : ''"
            class="mr-3"
          >
            {{ notification.icon }}
          </v-icon>
          
          <div class="flex-grow-1">
            <div class="notification-message">{{ notification.message }}</div>
            <div v-if="notification.subtitle" class="notification-subtitle">
              {{ notification.subtitle }}
            </div>
          </div>
        </div>
        
        <!-- Acciones personalizadas -->
        <template v-if="notification.actions" #actions>
          <div class="d-flex gap-2 mt-2">
            <v-btn
              v-for="action in notification.actions"
              :key="action.text"
              :color="action.color || 'white'"
              variant="text"
              size="small"
              @click="handleAction(notification.id, action)"
            >
              {{ action.text }}
            </v-btn>
          </div>
        </template>
        
        <!-- Botón de cerrar por defecto -->
        <template v-else #actions>
          <v-btn
            color="white"
            variant="text"
            icon="mdi-close"
            @click="closeNotification(notification.id)"
          ></v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script setup>
  import { useNotifications } from '@/composables/useNotifications'
  
  const { notifications, closeNotification } = useNotifications()
  
  const handleAction = (notificationId, action) => {
    // Ejecutar la acción
    if (action.action) {
      action.action()
    }
    
    // Cerrar la notificación después de la acción
    if (action.closeAfter !== false) {
      closeNotification(notificationId)
    }
  }
  </script>
  
  <style scoped>
  .app-notifications {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    pointer-events: none;
  }
  
  .app-snackbar {
    pointer-events: auto;
  }
  
  .notification-message {
    font-weight: 500;
    line-height: 1.4;
  }
  
  .notification-subtitle {
    font-size: 0.875rem;
    opacity: 0.8;
    margin-top: 4px;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .rotating {
    animation: rotate 1s linear infinite;
  }
  
  /* Estilos para diferentes ubicaciones */
  :deep(.v-snackbar--top) {
    top: 24px !important;
  }
  
  :deep(.v-snackbar--bottom) {
    bottom: 24px !important;
  }
  
  /* Estilo para notificaciones con acciones */
  :deep(.v-snackbar--vertical .v-snackbar__content) {
    padding: 16px !important;
  }
  </style>