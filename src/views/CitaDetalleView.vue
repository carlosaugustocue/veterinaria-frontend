<template>
    <v-container fluid>
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          color="primary"
          size="64"
          indeterminate
        ></v-progress-circular>
        <p class="text-body-1 mt-4">Cargando información de la cita...</p>
      </div>
  
      <!-- Contenido principal -->
      <div v-else-if="cita">
        <!-- Header con navegación -->
        <v-row class="mb-4">
          <v-col cols="12" class="d-flex align-center">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="volver"
              class="mr-3"
            ></v-btn>
            <div class="flex-grow-1">
              <h1 class="text-h4 font-weight-bold">
                Cita #{{ cita.id }} - {{ cita.paciente?.nombre }}
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                {{ formatearFechaCompleta(cita.fecha_hora) }}
              </p>
            </div>
            
            <!-- Estado de la cita -->
            <v-chip
              :color="getColorEstado(cita.estado)"
              size="large"
              class="mr-4"
            >
              <v-icon start>{{ getIconoEstado(cita.estado) }}</v-icon>
              {{ cita.estado }}
            </v-chip>
  
            <!-- Botones de acción -->
            <div class="d-flex gap-2">
              <v-btn
                v-if="permisos.puede_confirmar"
                color="success"
                prepend-icon="mdi-check"
                @click="confirmarCita"
                :loading="loadingConfirmar"
              >
                Confirmar
              </v-btn>
              
              <v-btn
                v-if="permisos.puede_modificar"
                color="warning"
                prepend-icon="mdi-calendar-edit"
                @click="reprogramarCita"
              >
                Reprogramar
              </v-btn>
              
              <v-btn
                v-if="permisos.puede_modificar"
                color="primary"
                prepend-icon="mdi-pencil"
                @click="editarCita"
              >
                Editar
              </v-btn>
              
              <v-btn
                v-if="permisos.puede_cancelar"
                color="error"
                prepend-icon="mdi-close"
                @click="cancelarCita"
                variant="outlined"
              >
                Cancelar
              </v-btn>
            </div>
          </v-col>
        </v-row>
  
        <!-- Información principal -->
        <v-row class="mb-6">
          <!-- Información de la cita -->
          <v-col cols="12" lg="8">
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                Detalles de la Cita
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title>Fecha y Hora</v-list-item-title>
                      <v-list-item-subtitle>{{ formatearFechaCompleta(cita.fecha_hora) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-clock</v-icon>
                      </template>
                      <v-list-item-title>Duración Estimada</v-list-item-title>
                      <v-list-item-subtitle>{{ cita.duracion_estimada }} minutos</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-medical-bag</v-icon>
                      </template>
                      <v-list-item-title>Tipo de Cita</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip size="small" color="primary" variant="tonal">
                          {{ cita.tipo_cita }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-flag</v-icon>
                      </template>
                      <v-list-item-title>Prioridad</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip 
                          size="small" 
                          :color="getColorPrioridad(cita.prioridad)"
                          variant="tonal"
                        >
                          {{ cita.prioridad }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                </v-row>
  
                <!-- Motivo y observaciones -->
                <v-divider class="my-4"></v-divider>
                <v-row>
                  <v-col cols="12">
                    <h4 class="text-h6 mb-3">Motivo de la Consulta</h4>
                    <p class="text-body-1 mb-4">{{ cita.motivo || 'No especificado' }}</p>
                  </v-col>
                  <v-col cols="12" v-if="cita.observaciones">
                    <h4 class="text-h6 mb-3">Observaciones</h4>
                    <p class="text-body-1">{{ cita.observaciones }}</p>
                  </v-col>
                </v-row>
  
                <!-- Alertas especiales -->
                <div v-if="cita.requiere_ayuno" class="mb-4">
                  <v-alert type="warning" variant="tonal">
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-food-off</v-icon>
                      <div>
                        <strong>Requiere Ayuno</strong>
                        <div class="text-body-2">El paciente debe venir en ayunas para esta cita.</div>
                      </div>
                    </div>
                  </v-alert>
                </div>
  
                <!-- Tiempo restante -->
                <div v-if="tiempoRestante" class="mb-4">
                  <v-alert 
                    :type="getTipoAlertaTiempo()" 
                    variant="tonal"
                  >
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-timer</v-icon>
                      <div>
                        <strong>{{ tiempoRestante }}</strong>
                        <div class="text-body-2">{{ getMensajeTiempo() }}</div>
                      </div>
                    </div>
                  </v-alert>
                </div>
              </v-card-text>
            </v-card>
  
            <!-- Información del paciente -->
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-2">mdi-paw</v-icon>
                  Información del Paciente
                </div>
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-eye"
                  @click="verPaciente"
                >
                  Ver Perfil
                </v-btn>
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center mb-4">
                  <v-avatar 
                    size="64" 
                    :color="getColorEspecie(cita.paciente?.especie?.nombre)" 
                    class="mr-4"
                  >
                    <v-icon color="white" size="32">{{ getIconoEspecie(cita.paciente?.especie?.nombre) }}</v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="text-h5 font-weight-bold">{{ cita.paciente?.nombre }}</h3>
                    <p class="text-body-1 text-medium-emphasis mb-1">
                      {{ cita.paciente?.especie?.nombre }} - {{ cita.paciente?.raza?.nombre }}
                    </p>
                    <div class="d-flex gap-2">
                      <v-chip size="small" color="primary" variant="outlined">
                        ID: {{ cita.paciente?.id }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
  
            <!-- Información del propietario -->
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-2">mdi-account</v-icon>
                  Información del Propietario
                </div>
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-eye"
                  @click="verPropietario"
                >
                  Ver Perfil
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-account</v-icon>
                      </template>
                      <v-list-item-title>Nombre</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ cita.propietario?.user?.nombre }} {{ cita.propietario?.user?.apellido }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-phone</v-icon>
                      </template>
                      <v-list-item-title>Teléfono</v-list-item-title>
                      <v-list-item-subtitle>{{ cita.propietario?.user?.telefono }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
  
            <!-- Información del veterinario -->
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-doctor</v-icon>
                Veterinario Asignado
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-avatar size="48" color="success" class="mr-3">
                    <v-icon color="white">mdi-doctor</v-icon>
                  </v-avatar>
                  <div>
                    <h4 class="text-h6 font-weight-medium">
                      Dr. {{ cita.veterinario?.user?.nombre }} {{ cita.veterinario?.user?.apellido }}
                    </h4>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      Especialista en {{ cita.tipo_cita }}
                    </p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <!-- Panel lateral -->
          <v-col cols="12" lg="4">
            <!-- Acciones rápidas -->
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
                Acciones Rápidas
              </v-card-title>
              <v-card-text>
                <div class="d-flex flex-column gap-2">
                  <v-btn
                    v-if="permisos.puede_confirmar"
                    color="success"
                    block
                    prepend-icon="mdi-check"
                    @click="confirmarCita"
                    :loading="loadingConfirmar"
                  >
                    Confirmar Cita
                  </v-btn>
                  
                  <v-btn
                    block
                    prepend-icon="mdi-stethoscope"
                    @click="iniciarConsulta"
                    :disabled="cita.estado !== 'confirmada'"
                  >
                    Iniciar Consulta
                  </v-btn>
                  
                  <v-btn
                    block
                    prepend-icon="mdi-phone"
                    @click="llamarPropietario"
                    variant="outlined"
                  >
                    Llamar Propietario
                  </v-btn>
                  
                  <v-btn
                    block
                    prepend-icon="mdi-message"
                    @click="enviarRecordatorio"
                    variant="outlined"
                  >
                    Enviar Recordatorio
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
  
            <!-- Historial de cambios -->
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-history</v-icon>
                Historial de Cambios
              </v-card-title>
              <v-card-text>
                <v-timeline density="compact" v-if="historialCambios.length > 0">
                  <v-timeline-item
                    v-for="cambio in historialCambios"
                    :key="cambio.fecha"
                    :dot-color="getColorCambio(cambio.accion)"
                    size="small"
                  >
                    <template #icon>
                      <v-icon size="small">{{ getIconoCambio(cambio.accion) }}</v-icon>
                    </template>
                    <div>
                      <div class="text-body-2 font-weight-medium">{{ cambio.accion }}</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatearFecha(cambio.fecha) }} - {{ cambio.usuario }}
                      </div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
                <div v-else class="text-center text-medium-emphasis">
                  <v-icon class="mb-2">mdi-history</v-icon>
                  <p>No hay historial de cambios</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Información de consulta -->
        <v-row v-if="infoConsulta">
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-stethoscope</v-icon>
                Estado de la Consulta
              </v-card-title>
              <v-card-text>
                <v-alert 
                  :type="infoConsulta.tiene_consulta ? 'success' : 'info'"
                  variant="tonal"
                >
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">
                      {{ infoConsulta.tiene_consulta ? 'mdi-check-circle' : 'mdi-information' }}
                    </v-icon>
                    <div>
                      <strong>
                        {{ infoConsulta.tiene_consulta ? 'Consulta Realizada' : 'Consulta Pendiente' }}
                      </strong>
                      <div class="text-body-2">{{ infoConsulta.nota }}</div>
                    </div>
                  </div>
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
  
      <!-- Error -->
      <div v-else-if="error">
        <v-alert
          type="error"
          variant="tonal"
          class="mb-4"
        >
          <div class="font-weight-bold mb-2">Error al cargar la cita:</div>
          <p>{{ error }}</p>
          <v-btn
            color="error"
            variant="outlined"
            @click="cargarCita"
            class="mt-2"
          >
            Reintentar
          </v-btn>
        </v-alert>
      </div>
  
      <!-- Dialog para confirmar cita -->
      <v-dialog v-model="dialogConfirmar" max-width="400">
        <v-card>
          <v-card-title class="text-h6">
            Confirmar Cita
          </v-card-title>
          <v-card-text>
            ¿Confirmar la cita de <strong>{{ cita?.paciente?.nombre }}</strong> 
            para el {{ formatearFechaCompleta(cita?.fecha_hora) }}?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialogConfirmar = false">
              Cancelar
            </v-btn>
            <v-btn
              color="success"
              @click="ejecutarConfirmarCita"
              :loading="loadingConfirmar"
            >
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Dialog para cancelar cita -->
      <v-dialog v-model="dialogCancelar" max-width="400">
        <v-card>
          <v-card-title class="text-h6">
            Cancelar Cita
          </v-card-title>
          <v-card-text>
            ¿Estás seguro de que deseas cancelar la cita de <strong>{{ cita?.paciente?.nombre }}</strong>?
            <br><br>
            <v-alert type="warning" variant="tonal">
              Esta acción no se puede deshacer.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialogCancelar = false">
              No cancelar
            </v-btn>
            <v-btn
              color="error"
              @click="ejecutarCancelarCita"
              :loading="loadingCancelar"
            >
              Cancelar Cita
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotifications } from '@/composables/useNotifications'
  import api from '@/api/axios'
  
  const route = useRoute()
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useNotifications()
  
  // Props
  const citaId = computed(() => route.params.id)
  
  // Estado local
  const loading = ref(false)
  const error = ref('')
  const cita = ref(null)
  const permisos = ref({
    puede_modificar: false,
    puede_cancelar: false,
    puede_confirmar: false
  })
  const tiempoRestante = ref('')
  const historialCambios = ref([])
  const infoConsulta = ref(null)
  
  // Diálogos
  const dialogConfirmar = ref(false)
  const dialogCancelar = ref(false)
  const loadingConfirmar = ref(false)
  const loadingCancelar = ref(false)
  
  // Métodos de utilidad
  const getColorEstado = (estado) => {
    const colores = {
      programada: 'warning',
      confirmada: 'success',
      completada: 'primary',
      cancelada: 'error'
    }
    return colores[estado] || 'grey'
  }
  
  const getIconoEstado = (estado) => {
    const iconos = {
      programada: 'mdi-clock',
      confirmada: 'mdi-check',
      completada: 'mdi-clipboard-check',
      cancelada: 'mdi-close'
    }
    return iconos[estado] || 'mdi-help'
  }
  
  const getColorPrioridad = (prioridad) => {
    const colores = {
      alta: 'error',
      media: 'warning',
      normal: 'success'
    }
    return colores[prioridad] || 'grey'
  }
  
  const getColorEspecie = (especie) => {
    const colores = {
      'Perro': 'brown',
      'Gato': 'purple',
      'Ave': 'orange',
      'Conejo': 'pink',
      'Reptil': 'green',
      'Pez': 'blue'
    }
    return colores[especie] || 'blue-grey'
  }
  
  const getIconoEspecie = (especie) => {
    const iconos = {
      'Perro': 'mdi-dog',
      'Gato': 'mdi-cat',
      'Ave': 'mdi-bird',
      'Conejo': 'mdi-rabbit',
      'Reptil': 'mdi-snake',
      'Pez': 'mdi-fish'
    }
    return iconos[especie] || 'mdi-paw'
  }
  
  const getColorCambio = (accion) => {
    const colores = {
      'Cita creada': 'success',
      'Cita confirmada': 'success',
      'Cita reprogramada': 'warning',
      'Cita cancelada': 'error',
      'Cita modificada': 'info'
    }
    return colores[accion] || 'grey'
  }
  
  const getIconoCambio = (accion) => {
    const iconos = {
      'Cita creada': 'mdi-plus',
      'Cita confirmada': 'mdi-check',
      'Cita reprogramada': 'mdi-calendar-edit',
      'Cita cancelada': 'mdi-close',
      'Cita modificada': 'mdi-pencil'
    }
    return iconos[accion] || 'mdi-circle'
  }
  
  const formatearFechaCompleta = (fechaHora) => {
    if (!fechaHora) return 'No especificada'
    return new Date(fechaHora).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getTipoAlertaTiempo = () => {
    if (!tiempoRestante.value) return 'info'
    
    const ahora = new Date()
    const fechaCita = new Date(cita.value.fecha_hora)
    const diffHoras = (fechaCita - ahora) / (1000 * 60 * 60)
    
    if (diffHoras < 1) return 'error'
    if (diffHoras < 24) return 'warning'
    return 'info'
  }
  
  const getMensajeTiempo = () => {
    const ahora = new Date()
    const fechaCita = new Date(cita.value.fecha_hora)
    
    if (fechaCita < ahora) {
      return 'La cita ya pasó'
    } else {
      return 'Tiempo restante para la cita'
    }
  }
  
  // Métodos principales
  const cargarCita = async () => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('Cargando cita ID:', citaId.value)
      
      const response = await api.get(`/citas/${citaId.value}`)
      
      if (response.data && response.data.data) {
        const data = response.data.data
        cita.value = data.cita
        permisos.value = {
          puede_modificar: data.puede_modificar,
          puede_cancelar: data.puede_cancelar,
          puede_confirmar: data.puede_confirmar
        }
        tiempoRestante.value = data.tiempo_restante
        historialCambios.value = data.historial_cambios || []
        infoConsulta.value = data.info_consulta
        
        console.log('Cita cargada:', cita.value)
      } else {
        error.value = 'Cita no encontrada'
      }
    } catch (err) {
      console.error('Error al cargar cita:', err)
      error.value = err.response?.data?.message || 'Error al cargar la cita'
      showError('Error al cargar la cita')
    } finally {
      loading.value = false
    }
  }
  
  // Navegación
  const volver = () => {
    router.push('/citas')
  }
  
  const verPaciente = () => {
    if (cita.value?.paciente?.id) {
      router.push(`/pacientes/${cita.value.paciente.id}`)
    }
  }
  
  const verPropietario = () => {
    if (cita.value?.propietario?.id) {
      router.push(`/propietarios/${cita.value.propietario.id}`)
    }
  }
  
  const editarCita = () => {
    router.push(`/citas/${citaId.value}/editar`)
  }
  
  const reprogramarCita = () => {
    router.push(`/citas/${citaId.value}/editar?reprogramar=true`)
  }
  
  // Acciones de citas
  const confirmarCita = () => {
    dialogConfirmar.value = true
  }
  
  const ejecutarConfirmarCita = async () => {
    loadingConfirmar.value = true
    
    try {
      const response = await api.post(`/citas/${citaId.value}/confirmar`)
      
      if (response.data.success) {
        showSuccess(response.data.data.mensaje_confirmacion || 'Cita confirmada exitosamente')
        dialogConfirmar.value = false
        await cargarCita() // Recargar datos
      } else {
        showError(response.data.message || 'Error al confirmar cita')
      }
    } catch (error) {
      console.error('Error al confirmar cita:', error)
      showError('Error al confirmar cita')
    } finally {
      loadingConfirmar.value = false
    }
  }
  
  const cancelarCita = () => {
    dialogCancelar.value = true
  }
  
  const ejecutarCancelarCita = async () => {
    loadingCancelar.value = true
    
    try {
      const response = await api.delete(`/citas/${citaId.value}`)
      
      if (response.data.success) {
        showSuccess('Cita cancelada exitosamente')
        dialogCancelar.value = false
        router.push('/citas') // Volver a la lista
      } else {
        showError(response.data.message || 'Error al cancelar cita')
      }
    } catch (error) {
      console.error('Error al cancelar cita:', error)
      showError('Error al cancelar cita')
    } finally {
      loadingCancelar.value = false
    }
  }
  
  // Acciones adicionales
  const iniciarConsulta = () => {
    showInfo('Funcionalidad de consultas próximamente disponible')
  }
  
  const llamarPropietario = () => {
    if (cita.value?.propietario?.user?.telefono) {
      const telefono = cita.value.propietario.user.telefono
      window.open(`tel:${telefono}`)
    }
  }
  
  const enviarRecordatorio = () => {
    showInfo('Funcionalidad de recordatorios próximamente disponible')
  }
  
  // Lifecycle
  onMounted(async () => {
    console.log('Componente CitaDetalleView montado')
    await cargarCita()
  })
  </script>
  
  <style scoped>
  .v-list-item {
    min-height: auto !important;
    padding: 8px 0 !important;
  }
  </style>