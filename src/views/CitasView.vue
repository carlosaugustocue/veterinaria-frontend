<template>
    <v-container fluid>
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold">
            <v-icon size="large" class="mr-2">mdi-calendar-clock</v-icon>
            Citas Médicas
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Gestión completa de citas y agenda veterinaria
          </p>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end align-center">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="abrirFormularioNueva"
            class="mr-2"
          >
            Nueva Cita
          </v-btn>
          <v-btn
            color="success"
            prepend-icon="mdi-calendar-today"
            @click="filtrarCitasHoy"
            variant="outlined"
          >
            Hoy ({{ citasHoyCount }})
          </v-btn>
        </v-col>
      </v-row>
  
      <!-- Estadísticas rápidas -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3">
          <v-card color="primary" variant="flat">
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" color="white" class="mr-3">mdi-calendar-check</v-icon>
                <div>
                  <div class="text-h5 text-white font-weight-bold">{{ estadisticas.total }}</div>
                  <div class="text-white">Total Citas</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card color="warning" variant="flat">
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" color="white" class="mr-3">mdi-clock-alert</v-icon>
                <div>
                  <div class="text-h5 text-white font-weight-bold">{{ estadisticas.por_estado?.programadas || 0 }}</div>
                  <div class="text-white">Programadas</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card color="success" variant="flat">
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" color="white" class="mr-3">mdi-check-circle</v-icon>
                <div>
                  <div class="text-h5 text-white font-weight-bold">{{ estadisticas.por_estado?.confirmadas || 0 }}</div>
                  <div class="text-white">Confirmadas</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card color="info" variant="flat">
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" color="white" class="mr-3">mdi-clipboard-check</v-icon>
                <div>
                  <div class="text-h5 text-white font-weight-bold">{{ estadisticas.por_estado?.completadas || 0 }}</div>
                  <div class="text-white">Completadas</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Filtros avanzados -->
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-filter</v-icon>
          Filtros
          <v-spacer></v-spacer>
          <v-btn
            size="small"
            variant="text"
            @click="limpiarFiltros"
          >
            Limpiar
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="filtros.busqueda"
                prepend-inner-icon="mdi-magnify"
                label="Buscar cita..."
                hide-details
                clearable
                @input="aplicarFiltros"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filtros.estado"
                :items="opcionesEstado"
                label="Estado"
                clearable
                hide-details
                @update:model-value="aplicarFiltros"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filtros.tipo_cita"
                :items="opcionesTipoCita"
                label="Tipo de Cita"
                clearable
                hide-details
                @update:model-value="aplicarFiltros"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                v-model="filtros.fecha"
                type="date"
                label="Fecha"
                hide-details
                clearable
                @update:model-value="aplicarFiltros"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="filtros.veterinario_id"
                :items="veterinarios"
                item-title="nombre_completo"
                item-value="id"
                label="Veterinario"
                clearable
                hide-details
                @update:model-value="aplicarFiltros"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="filtros.hoy"
                label="Solo hoy"
                hide-details
                @update:model-value="aplicarFiltros"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="filtros.esta_semana"
                label="Esta semana"
                hide-details
                @update:model-value="aplicarFiltros"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                v-model="filtros.proximas"
                label="Próximas"
                hide-details
                @update:model-value="aplicarFiltros"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end align-center">
              <v-btn
                prepend-icon="mdi-refresh"
                @click="cargarCitas"
                :loading="loading"
                variant="outlined"
              >
                Actualizar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <!-- Tabla de citas -->
      <v-card>
        <v-data-table
          :headers="headers"
          :items="citasFiltradas"
          :loading="loading"
          :items-per-page="itemsPerPage"
          @click:row="verDetalleCita"
          class="cursor-pointer"
          hover
        >
          <!-- Slot para fecha y hora -->
          <template #item.fecha_hora="{ item }">
            <div>
              <div class="font-weight-medium">{{ formatearFecha(item.fecha_hora) }}</div>
              <div class="text-caption text-medium-emphasis">{{ formatearHora(item.fecha_hora) }}</div>
            </div>
          </template>
  
          <!-- Slot para paciente -->
          <template #item.paciente="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" :color="getColorEspecie(item.paciente?.especie?.nombre)" class="mr-2">
                <v-icon color="white" size="16">{{ getIconoEspecie(item.paciente?.especie?.nombre) }}</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.paciente?.nombre }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.paciente?.especie?.nombre }} - {{ item.paciente?.raza?.nombre }}
                </div>
              </div>
            </div>
          </template>
  
          <!-- Slot para propietario -->
          <template #item.propietario="{ item }">
            <div>
              <div class="font-weight-medium">
                {{ item.propietario?.user?.nombre }} {{ item.propietario?.user?.apellido }}
              </div>
              <div class="text-caption text-medium-emphasis">{{ item.propietario?.user?.telefono }}</div>
            </div>
          </template>
  
          <!-- Slot para veterinario -->
          <template #item.veterinario="{ item }">
            <div>
              <div class="font-weight-medium">
                Dr. {{ item.veterinario?.user?.nombre }} {{ item.veterinario?.user?.apellido }}
              </div>
              <div class="text-caption text-medium-emphasis">{{ item.tipo_cita }}</div>
            </div>
          </template>
  
          <!-- Slot para motivo -->
          <template #item.motivo="{ item }">
            <div>
              <div class="font-weight-medium">{{ item.motivo }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ item.duracion_estimada }} min
                <v-chip
                  v-if="item.prioridad !== 'normal'"
                  :color="getColorPrioridad(item.prioridad)"
                  size="x-small"
                  class="ml-1"
                >
                  {{ item.prioridad }}
                </v-chip>
              </div>
            </div>
          </template>
  
          <!-- Slot para estado -->
          <template #item.estado="{ item }">
            <v-chip
              :color="getColorEstado(item.estado)"
              size="small"
              class="font-weight-medium"
            >
              <v-icon start size="16">{{ getIconoEstado(item.estado) }}</v-icon>
              {{ item.estado }}
            </v-chip>
            <div v-if="item.requiere_ayuno" class="text-caption text-warning mt-1">
              <v-icon size="12">mdi-food-off</v-icon>
              Requiere ayuno
            </div>
          </template>
  
          <!-- Slot para acciones -->
          <template #item.acciones="{ item }">
            <div class="d-flex">
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                @click.stop="verDetalleCita(null, { item })"
                title="Ver detalle"
              ></v-btn>
              
              <v-btn
                v-if="puedeConfirmar(item)"
                icon="mdi-check"
                size="small"
                variant="text"
                color="success"
                @click.stop="confirmarCita(item)"
                title="Confirmar cita"
              ></v-btn>
              
              <v-btn
                v-if="puedeReprogramar(item)"
                icon="mdi-calendar-edit"
                size="small"
                variant="text"
                color="warning"
                @click.stop="reprogramarCita(item)"
                title="Reprogramar"
              ></v-btn>
              
              <v-btn
                v-if="puedeEditar(item)"
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click.stop="editarCita(item.id)"
                title="Editar"
              ></v-btn>
              
              <v-btn
                v-if="puedeCancelar(item)"
                icon="mdi-close"
                size="small"
                variant="text"
                color="error"
                @click.stop="confirmarCancelar(item)"
                title="Cancelar"
              ></v-btn>
            </div>
          </template>
  
          <!-- Loading -->
          <template #loading>
            <div class="text-center py-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p class="mt-2">Cargando citas...</p>
            </div>
          </template>
  
          <!-- No data -->
          <template #no-data>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-calendar-remove</v-icon>
              <h3 class="text-h6 mb-2">No hay citas</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                {{ tienesFiltrosActivos ? 'No se encontraron citas con los filtros aplicados' : 'Aún no hay citas programadas en el sistema' }}
              </p>
              <v-btn
                v-if="!tienesFiltrosActivos"
                color="primary"
                prepend-icon="mdi-plus"
                @click="abrirFormularioNueva"
              >
                Programar Primera Cita
              </v-btn>
              <v-btn
                v-else
                variant="outlined"
                @click="limpiarFiltros"
              >
                Limpiar Filtros
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
  
      <!-- Paginación -->
      <v-row v-if="pagination.last_page > 1" class="mt-4">
        <v-col cols="12" class="d-flex justify-center">
          <v-pagination
            v-model="pagination.current_page"
            :length="pagination.last_page"
            :total-visible="7"
            @update:model-value="cambiarPagina"
          ></v-pagination>
        </v-col>
      </v-row>
  
      <!-- Dialog para confirmar cita -->
      <v-dialog v-model="dialogConfirmar" max-width="400">
        <v-card>
          <v-card-title class="text-h6">
            Confirmar Cita
          </v-card-title>
          <v-card-text>
            ¿Confirmar la cita de <strong>{{ citaSeleccionada?.paciente?.nombre }}</strong> 
            para el {{ formatearFechaCompleta(citaSeleccionada?.fecha_hora) }}?
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
            ¿Estás seguro de que deseas cancelar la cita de <strong>{{ citaSeleccionada?.paciente?.nombre }}</strong>?
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
  
      <!-- Dialog para reprogramar -->
      <v-dialog v-model="dialogReprogramar" max-width="500">
        <v-card>
          <v-card-title class="text-h6">
            Reprogramar Cita
          </v-card-title>
          <v-card-text>
            <v-form ref="formReprogramar">
              <v-row>
                <v-col cols="12">
                  <p class="mb-4">
                    Reprogramar cita de <strong>{{ citaSeleccionada?.paciente?.nombre }}</strong>
                  </p>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="reprogramacion.fecha"
                    type="date"
                    label="Nueva fecha"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="reprogramacion.hora"
                    type="time"
                    label="Nueva hora"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="reprogramacion.motivo"
                    label="Motivo de reprogramación"
                    rows="3"
                    required
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialogReprogramar = false">
              Cancelar
            </v-btn>
            <v-btn
              color="warning"
              @click="ejecutarReprogramarCita"
              :loading="loadingReprogramar"
            >
              Reprogramar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Mensaje de error -->
      <v-snackbar
        v-model="mostrarError"
        color="error"
        timeout="5000"
      >
        {{ error }}
        <template #actions>
          <v-btn variant="text" @click="mostrarError = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNotifications } from '@/composables/useNotifications'
  import api from '@/api/axios'
  
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useNotifications()
  
  // Estado local
  const loading = ref(false)
  const error = ref('')
  const mostrarError = ref(false)
  const citas = ref([])
  const veterinarios = ref([])
  const itemsPerPage = ref(15)
  
  // Filtros
  const filtros = ref({
    busqueda: '',
    estado: '',
    tipo_cita: '',
    fecha: '',
    veterinario_id: '',
    hoy: false,
    esta_semana: false,
    proximas: false
  })
  
  // Diálogos
  const dialogConfirmar = ref(false)
  const dialogCancelar = ref(false)
  const dialogReprogramar = ref(false)
  const citaSeleccionada = ref(null)
  const loadingConfirmar = ref(false)
  const loadingCancelar = ref(false)
  const loadingReprogramar = ref(false)
  
  // Reprogramación
  const reprogramacion = ref({
    fecha: '',
    hora: '',
    motivo: ''
  })
  
  // Opciones para filtros
  const opcionesEstado = [
    { title: 'Programada', value: 'programada' },
    { title: 'Confirmada', value: 'confirmada' },
    { title: 'Completada', value: 'completada' },
    { title: 'Cancelada', value: 'cancelada' }
  ]
  
  const opcionesTipoCita = [
    { title: 'Consulta', value: 'consulta' },
    { title: 'Emergencia', value: 'emergencia' },
    { title: 'Control', value: 'control' },
    { title: 'Cirugía', value: 'cirugia' },
    { title: 'Vacunación', value: 'vacunacion' }
  ]
  
  // Headers para la tabla
  const headers = [
    {
      title: 'Fecha y Hora',
      key: 'fecha_hora',
      sortable: true,
      width: '150px'
    },
    {
      title: 'Paciente',
      key: 'paciente',
      sortable: false,
      width: '180px'
    },
    {
      title: 'Propietario',
      key: 'propietario',
      sortable: false,
      width: '160px'
    },
    {
      title: 'Veterinario',
      key: 'veterinario',
      sortable: false,
      width: '160px'
    },
    {
      title: 'Motivo',
      key: 'motivo',
      sortable: false,
      width: '200px'
    },
    {
      title: 'Estado',
      key: 'estado',
      sortable: true,
      width: '120px',
      align: 'center'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      sortable: false,
      width: '160px',
      align: 'center'
    }
  ]
  
  // Paginación
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 1,
    to: 15
  })
  
  // Estadísticas
  const estadisticas = ref({
    total: 0,
    por_estado: {
      programadas: 0,
      confirmadas: 0,
      completadas: 0,
      canceladas: 0
    }
  })
  
  // Computadas
  const citasFiltradas = computed(() => {
    return citas.value // La filtración se hace en el servidor
  })
  
  const citasHoyCount = computed(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return citas.value.filter(cita => 
      cita.fecha_hora.startsWith(hoy)
    ).length
  })
  
  const tienesFiltrosActivos = computed(() => {
    return filtros.value.busqueda || 
           filtros.value.estado || 
           filtros.value.tipo_cita || 
           filtros.value.fecha || 
           filtros.value.veterinario_id ||
           filtros.value.hoy ||
           filtros.value.esta_semana ||
           filtros.value.proximas
  })
  
  // Métodos de utilidad
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
      normal: 'primary'
    }
    return colores[prioridad] || 'grey'
  }
  
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  const formatearHora = (fechaHora) => {
    if (!fechaHora) return ''
    return new Date(fechaHora).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    })
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
  
  // Métodos de validación
  const puedeConfirmar = (cita) => {
    return cita.estado === 'programada'
  }
  
  const puedeReprogramar = (cita) => {
    return ['programada', 'confirmada'].includes(cita.estado)
  }
  
  const puedeEditar = (cita) => {
    return ['programada', 'confirmada'].includes(cita.estado)
  }
  
  const puedeCancelar = (cita) => {
    return ['programada', 'confirmada'].includes(cita.estado)
  }
  
  // Métodos principales
  const cargarCitas = async (page = 1) => {
    loading.value = true
    error.value = ''
    mostrarError.value = false
    
    try {
      console.log('Cargando citas desde la API...')
      
      const params = {
        page,
        per_page: itemsPerPage.value,
        ...filtros.value
      }
      
      // Limpiar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === false) {
          delete params[key]
        }
      })
      
      const response = await api.get('/citas', { params })
      
      console.log('Respuesta de citas:', response.data)
      
      if (response.data && response.data.data) {
        citas.value = response.data.data.citas || response.data.data
        estadisticas.value = response.data.data.stats || estadisticas.value
        
        if (response.data.data.pagination || response.data.meta) {
          const paginationData = response.data.data.pagination || response.data.meta
          pagination.value = {
            current_page: paginationData.current_page,
            last_page: paginationData.last_page,
            per_page: paginationData.per_page,
            total: paginationData.total,
            from: paginationData.from,
            to: paginationData.to
          }
        }
        
        console.log('Citas cargadas exitosamente:', citas.value.length)
      } else {
        error.value = 'Estructura de respuesta inesperada'
        mostrarError.value = true
      }
    } catch (err) {
      console.error('Error al cargar citas:', err)
      error.value = err.response?.data?.message || 'Error de conexión con el servidor'
      mostrarError.value = true
      showError('Error al cargar citas')
    } finally {
      loading.value = false
    }
  }
  
  const cargarVeterinarios = async () => {
    try {
      const response = await api.get('/veterinarios')
      if (response.data && response.data.data) {
        veterinarios.value = response.data.data.map(vet => ({
          id: vet.id,
          nombre_completo: `Dr. ${vet.user?.nombre} ${vet.user?.apellido}`
        }))
      }
    } catch (err) {
      console.error('Error al cargar veterinarios:', err)
    }
  }
  
  const aplicarFiltros = () => {
    pagination.value.current_page = 1
    cargarCitas()
  }
  
  const limpiarFiltros = () => {
    filtros.value = {
      busqueda: '',
      estado: '',
      tipo_cita: '',
      fecha: '',
      veterinario_id: '',
      hoy: false,
      esta_semana: false,
      proximas: false
    }
    aplicarFiltros()
  }
  
  const filtrarCitasHoy = () => {
    limpiarFiltros()
    filtros.value.hoy = true
    aplicarFiltros()
  }
  
  const cambiarPagina = async (page) => {
    await cargarCitas(page)
  }
  
  // Navegación
  const verDetalleCita = (event, { item }) => {
    console.log('Navegando a detalle de la cita:', item.id)
    router.push(`/citas/${item.id}`)
  }
  
  const editarCita = (id) => {
    console.log('Navegando a editar cita:', id)
    router.push(`/citas/${id}/editar`)
  }
  
  const abrirFormularioNueva = () => {
    console.log('Navegando a nueva cita')
    router.push('/citas/nueva')
  }
  
  // Acciones de citas
  const confirmarCita = (cita) => {
    citaSeleccionada.value = cita
    dialogConfirmar.value = true
  }
  
  const ejecutarConfirmarCita = async () => {
    if (!citaSeleccionada.value) return
    
    loadingConfirmar.value = true
    
    try {
      const response = await api.post(`/citas/${citaSeleccionada.value.id}/confirmar`)
      
      if (response.data.success) {
        showSuccess('Cita confirmada exitosamente')
        dialogConfirmar.value = false
        citaSeleccionada.value = null
        await cargarCitas()
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
  
  const confirmarCancelar = (cita) => {
    citaSeleccionada.value = cita
    dialogCancelar.value = true
  }
  
  const ejecutarCancelarCita = async () => {
    if (!citaSeleccionada.value) return
    
    loadingCancelar.value = true
    
    try {
      const response = await api.delete(`/citas/${citaSeleccionada.value.id}`)
      
      if (response.data.success) {
        showSuccess('Cita cancelada exitosamente')
        dialogCancelar.value = false
        citaSeleccionada.value = null
        await cargarCitas()
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
  
  const reprogramarCita = (cita) => {
    citaSeleccionada.value = cita
    const fechaActual = new Date(cita.fecha_hora)
    reprogramacion.value = {
      fecha: fechaActual.toISOString().split('T')[0],
      hora: fechaActual.toTimeString().slice(0, 5),
      motivo: ''
    }
    dialogReprogramar.value = true
  }
  
  const ejecutarReprogramarCita = async () => {
    if (!citaSeleccionada.value || !reprogramacion.value.fecha || !reprogramacion.value.hora) return
    
    loadingReprogramar.value = true
    
    try {
      const nuevaFechaHora = `${reprogramacion.value.fecha} ${reprogramacion.value.hora}:00`
      
      const response = await api.post(`/citas/${citaSeleccionada.value.id}/reprogramar`, {
        nueva_fecha_hora: nuevaFechaHora,
        motivo_reprogramacion: reprogramacion.value.motivo
      })
      
      if (response.data.success) {
        showSuccess('Cita reprogramada exitosamente')
        dialogReprogramar.value = false
        citaSeleccionada.value = null
        reprogramacion.value = { fecha: '', hora: '', motivo: '' }
        await cargarCitas()
      } else {
        showError(response.data.message || 'Error al reprogramar cita')
      }
    } catch (error) {
      console.error('Error al reprogramar cita:', error)
      showError('Error al reprogramar cita')
    } finally {
      loadingReprogramar.value = false
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    console.log('Componente CitasView montado')
    await Promise.all([
      cargarCitas(),
      cargarVeterinarios()
    ])
  })
  </script>
  
  <style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
  
  .v-data-table >>> tbody tr:hover {
    background-color: rgba(var(--v-theme-primary), 0.04) !important;
  }
  </style>