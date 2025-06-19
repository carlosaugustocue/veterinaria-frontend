<!-- src/views/citas/DisponibilidadTestView.vue -->
<template>
    <v-container>
      <!-- Breadcrumbs -->
      <v-breadcrumbs
        :items="breadcrumbs"
        class="px-0 mb-4"
      >
        <template #divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
  
      <!-- Header -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="$router.push('/citas')"
              class="mr-3"
            ></v-btn>
            <div>
              <h1 class="text-h4 font-weight-bold">
                <v-icon class="mr-2">mdi-test-tube</v-icon>
                Test: Sistema de Disponibilidad
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                Prueba el componente de verificación de disponibilidad de horarios
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
  
      <v-row>
        <!-- Panel de Control -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              <v-icon class="mr-2">mdi-cog</v-icon>
              Configuración
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-select
                  v-model="configuracion.veterinarioId"
                  :items="veterinarios"
                  item-title="nombre_completo"
                  item-value="id"
                  label="Veterinario"
                  prepend-inner-icon="mdi-doctor"
                  :loading="loadingVeterinarios"
                  clearable
                  @update:model-value="onConfigChange"
                ></v-select>
  
                <v-text-field
                  v-model="configuracion.fecha"
                  type="date"
                  label="Fecha"
                  prepend-inner-icon="mdi-calendar"
                  :min="fechaMinima"
                  @update:model-value="onConfigChange"
                ></v-text-field>
  
                <v-select
                  v-model="configuracion.duracion"
                  :items="opcionesDuracion"
                  label="Duración"
                  prepend-inner-icon="mdi-clock"
                  @update:model-value="onConfigChange"
                ></v-select>
  
                <v-checkbox
                  v-model="configuracion.autoVerificar"
                  label="Verificación automática"
                  hide-details
                ></v-checkbox>
  
                <v-divider class="my-4"></v-divider>
  
                <div class="d-flex gap-2">
                  <v-btn
                    color="primary"
                    block
                    @click="verificarManual"
                    :loading="verificandoManual"
                    :disabled="!puedeVerificar"
                  >
                    Verificar Manual
                  </v-btn>
                </div>
  
                <v-btn
                  color="warning"
                  variant="outlined"
                  block
                  @click="limpiarTest"
                  class="mt-2"
                >
                  Limpiar Test
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
  
          <!-- Estado actual -->
          <v-card class="mt-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-information</v-icon>
              Estado Actual
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>Veterinario</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ veterinarioSeleccionado || 'No seleccionado' }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Fecha</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ fechaFormateada || 'No seleccionada' }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Duración</v-list-item-title>
                  <v-list-item-subtitle>{{ configuracion.duracion }} minutos</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Horario Seleccionado</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ horarioSeleccionado || 'Ninguno' }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Selector de Disponibilidad -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <v-icon class="mr-2">mdi-clock-check</v-icon>
              Componente DisponibilidadSelector
            </v-card-title>
            <v-card-text>
              <DisponibilidadSelector
                :veterinario-id="configuracion.veterinarioId"
                :fecha="configuracion.fecha"
                :duracion="configuracion.duracion"
                :veterinario-nombre="veterinarioSeleccionado"
                :auto-verificar="configuracion.autoVerificar"
                v-model="horarioSeleccionado"
                @horario-seleccionado="onHorarioSeleccionado"
                @error="onError"
              />
            </v-card-text>
          </v-card>
  
          <!-- Resultado del Test -->
          <v-card v-if="resultadoTest" class="mt-4">
            <v-card-title>
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              Resultado del Test
            </v-card-title>
            <v-card-text>
              <v-alert
                :type="resultadoTest.tipo"
                variant="tonal"
                class="mb-4"
              >
                <div class="font-weight-bold">{{ resultadoTest.titulo }}</div>
                <div>{{ resultadoTest.mensaje }}</div>
              </v-alert>
  
              <div v-if="resultadoTest.datos">
                <h4 class="text-h6 mb-3">Datos Capturados:</h4>
                <v-code style="white-space: pre-wrap;">{{ JSON.stringify(resultadoTest.datos, null, 2) }}</v-code>
              </div>
            </v-card-text>
          </v-card>
  
          <!-- Log de Eventos -->
          <v-card v-if="logEventos.length > 0" class="mt-4">
            <v-card-title class="d-flex align-center justify-space-between">
              <div>
                <v-icon class="mr-2">mdi-script-text</v-icon>
                Log de Eventos
              </div>
              <v-btn
                size="small"
                variant="outlined"
                @click="limpiarLog"
              >
                Limpiar Log
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-timeline density="compact">
                <v-timeline-item
                  v-for="(evento, index) in logEventos.slice().reverse()"
                  :key="index"
                  :dot-color="getColorEvento(evento.tipo)"
                  size="small"
                >
                  <div>
                    <div class="text-body-2 font-weight-medium">{{ evento.titulo }}</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ evento.hora }} - {{ evento.descripcion }}
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Snackbar para notificaciones -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      >
        {{ snackbar.message }}
        <template #actions>
          <v-btn variant="text" @click="snackbar.show = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCitasDisponibilidad } from '@/composables/useCitasDisponibilidad'
  import DisponibilidadSelector from '@/components/citas/DisponibilidadSelector.vue'
  import api from '@/api/axios'
  
  const router = useRouter()
  
  // Estado reactivo
  const configuracion = ref({
    veterinarioId: null,
    fecha: '',
    duracion: 30,
    autoVerificar: true
  })
  
  const horarioSeleccionado = ref(null)
  const veterinarios = ref([])
  const loadingVeterinarios = ref(false)
  const verificandoManual = ref(false)
  const resultadoTest = ref(null)
  const logEventos = ref([])
  
  // Snackbar
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
    timeout: 4000
  })
  
  // Composable de disponibilidad para uso directo
  const {
    loading: loadingDisponibilidad,
    verificarDisponibilidad
  } = useCitasDisponibilidad()
  
  // Breadcrumbs
  const breadcrumbs = [
    {
      title: 'Citas',
      disabled: false,
      to: '/citas'
    },
    {
      title: 'Test Disponibilidad',
      disabled: true
    }
  ]
  
  // Opciones
  const opcionesDuracion = [
    { title: '15 minutos', value: 15 },
    { title: '30 minutos', value: 30 },
    { title: '45 minutos', value: 45 },
    { title: '60 minutos', value: 60 },
    { title: '90 minutos', value: 90 },
    { title: '120 minutos', value: 120 }
  ]
  
  // Computadas
  const fechaMinima = computed(() => {
    const hoy = new Date()
    return hoy.toISOString().split('T')[0]
  })
  
  const veterinarioSeleccionado = computed(() => {
    const vet = veterinarios.value.find(v => v.id === configuracion.value.veterinarioId)
    return vet?.nombre_completo || ''
  })
  
  const fechaFormateada = computed(() => {
    if (!configuracion.value.fecha) return ''
    return new Date(configuracion.value.fecha).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })
  
  const puedeVerificar = computed(() => {
    return configuracion.value.veterinarioId && configuracion.value.fecha
  })
  
  // Métodos
  const cargarVeterinarios = async () => {
    loadingVeterinarios.value = true
    try {
      const response = await api.get('/veterinarios')
      if (response.data && response.data.data) {
        veterinarios.value = response.data.data.map(vet => ({
          id: vet.id,
          nombre_completo: `Dr. ${vet.user?.nombre} ${vet.user?.apellido}`.trim()
        }))
        
        agregarEvento('success', 'Carga Exitosa', `${veterinarios.value.length} veterinarios cargados`)
      }
    } catch (error) {
      console.error('Error al cargar veterinarios:', error)
      mostrarNotificacion('Error al cargar veterinarios', 'error')
      agregarEvento('error', 'Error de Carga', 'No se pudieron cargar los veterinarios')
    } finally {
      loadingVeterinarios.value = false
    }
  }
  
  const verificarManual = async () => {
    if (!puedeVerificar.value) {
      mostrarNotificacion('Selecciona veterinario y fecha primero', 'warning')
      return
    }
  
    verificandoManual.value = true
    agregarEvento('info', 'Verificación Manual', 'Iniciando verificación manual de disponibilidad')
  
    try {
      await verificarDisponibilidad(
        configuracion.value.veterinarioId,
        configuracion.value.fecha,
        configuracion.value.duracion
      )
      
      mostrarNotificacion('Verificación manual completada', 'success')
      agregarEvento('success', 'Verificación Completada', 'Verificación manual exitosa')
    } catch (error) {
      mostrarNotificacion('Error en verificación manual', 'error')
      agregarEvento('error', 'Error Verificación', 'Error en verificación manual')
    } finally {
      verificandoManual.value = false
    }
  }
  
  const onConfigChange = () => {
    horarioSeleccionado.value = null
    resultadoTest.value = null
    agregarEvento('info', 'Configuración Cambiada', 'Se actualizó la configuración del test')
  }
  
  const onHorarioSeleccionado = (data) => {
    agregarEvento('success', 'Horario Seleccionado', `Horario: ${data?.horario || 'ninguno'}`)
    
    if (data) {
      resultadoTest.value = {
        tipo: 'success',
        titulo: 'Horario Seleccionado Exitosamente',
        mensaje: `Se seleccionó el horario ${data.horario} para el ${fechaFormateada.value}`,
        datos: data
      }
      mostrarNotificacion(`Horario ${data.horario} seleccionado`, 'success')
    }
  }
  
  const onError = (error) => {
    agregarEvento('error', 'Error del Componente', error)
    mostrarNotificacion(`Error: ${error}`, 'error')
    
    resultadoTest.value = {
      tipo: 'error',
      titulo: 'Error en el Componente',
      mensaje: error,
      datos: null
    }
  }
  
  const limpiarTest = () => {
    configuracion.value = {
      veterinarioId: null,
      fecha: '',
      duracion: 30,
      autoVerificar: true
    }
    horarioSeleccionado.value = null
    resultadoTest.value = null
    
    agregarEvento('info', 'Test Limpiado', 'Se reinició el estado del test')
    mostrarNotificacion('Test reiniciado', 'info')
  }
  
  const limpiarLog = () => {
    logEventos.value = []
    mostrarNotificacion('Log limpiado', 'info')
  }
  
  const agregarEvento = (tipo, titulo, descripcion) => {
    const ahora = new Date()
    logEventos.value.push({
      tipo,
      titulo,
      descripcion,
      hora: ahora.toLocaleTimeString('es-CO')
    })
  }
  
  const getColorEvento = (tipo) => {
    const colores = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    }
    return colores[tipo] || 'grey'
  }
  
  const mostrarNotificacion = (mensaje, color) => {
    snackbar.value = {
      show: true,
      message: mensaje,
      color,
      timeout: 4000
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    await cargarVeterinarios()
    
    // Configuración inicial para testing
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    configuracion.value.fecha = manana.toISOString().split('T')[0]
    
    agregarEvento('info', 'Test Iniciado', 'Vista de prueba del sistema de disponibilidad cargada')
  })
  </script>
  
  <style scoped>
  .v-code {
    background-color: rgb(var(--v-theme-surface-variant));
    border-radius: 4px;
    padding: 12px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 12px;
    max-height: 200px;
    overflow-y: auto;
  }
  </style>