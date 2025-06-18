<template>
    <v-container fluid>
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold">
            <v-icon size="large" class="mr-2">mdi-paw</v-icon>
            Mascotas
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Gestión de pacientes y su información médica
          </p>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end align-center">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="abrirFormularioNuevo"
          >
            Nueva Mascota
          </v-btn>
        </v-col>
      </v-row>
  
      <!-- Controles y filtros -->
      <v-card class="mb-4">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-information</v-icon>
                <span class="text-body-1">
                  Total de mascotas: <strong>{{ totalPacientes }}</strong>
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="busqueda"
                prepend-inner-icon="mdi-magnify"
                label="Buscar mascota..."
                hide-details
                clearable
                @input="filtrarPacientes"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filtroEspecie"
                :items="especies"
                label="Especie"
                clearable
                hide-details
                @update:model-value="filtrarPacientes"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filtroSexo"
                :items="opcionesSexo"
                label="Sexo"
                clearable
                hide-details
                @update:model-value="filtrarPacientes"
              ></v-select>
            </v-col>
            <v-col cols="12" md="2" class="d-flex justify-end">
              <v-btn
                icon
                variant="outlined"
                @click="cargarPacientes"
                :loading="loading"
                title="Actualizar lista"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <!-- Tabla de pacientes -->
      <v-card>
        <v-data-table
          :headers="headers"
          :items="pacientesFiltrados"
          :loading="loading"
          :items-per-page="itemsPerPage"
          @click:row="verDetallePaciente"
          class="cursor-pointer"
          hover
        >
          <!-- Slot para mascota con avatar -->
          <template #item.mascota="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="48" :color="getColorEspecie(item.especie?.nombre)" class="mr-3">
                <v-icon color="white">{{ getIconoEspecie(item.especie?.nombre) }}</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.nombre }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.especie?.nombre }} - {{ item.raza?.nombre }}</div>
              </div>
            </div>
          </template>
  
          <!-- Slot para propietario -->
          <template #item.propietario="{ item }">
            <div v-if="item.propietario">
              <div class="font-weight-medium">{{ item.propietario.user?.nombre }} {{ item.propietario.user?.apellido }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.propietario.user?.telefono }}</div>
            </div>
            <div v-else>
              <span class="text-medium-emphasis">Sin propietario</span>
            </div>
          </template>
  
          <!-- Slot para información básica -->
          <template #item.info_basica="{ item }">
            <div>
              <div class="d-flex align-center mb-1">
                <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                <span class="text-body-2">{{ calcularEdad(item.fecha_nacimiento) }}</span>
              </div>
              <div class="d-flex align-center mb-1">
                <v-icon size="14" class="mr-1">{{ item.sexo === 'macho' ? 'mdi-gender-male' : 'mdi-gender-female' }}</v-icon>
                <span class="text-body-2">{{ item.sexo }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="14" class="mr-1">mdi-palette</v-icon>
                <span class="text-body-2">{{ item.color }}</span>
              </div>
            </div>
          </template>
  
          <!-- Slot para peso -->
          <template #item.peso="{ item }">
            <v-chip
              v-if="item.peso"
              size="small"
              color="primary"
              variant="tonal"
            >
              {{ item.peso }} kg
            </v-chip>
            <span v-else class="text-medium-emphasis">No registrado</span>
          </template>
  
          <!-- Slot para microchip -->
          <template #item.microchip="{ item }">
            <div v-if="item.microchip">
              <v-chip
                size="small"
                color="success"
                variant="tonal"
                prepend-icon="mdi-check-circle"
              >
                Con microchip
              </v-chip>
              <div class="text-caption mt-1">{{ item.microchip }}</div>
            </div>
            <v-chip
              v-else
              size="small"
              color="warning"
              variant="tonal"
              prepend-icon="mdi-alert"
            >
              Sin microchip
            </v-chip>
          </template>
  
          <!-- Slot para acciones -->
          <template #item.acciones="{ item }">
            <div class="d-flex">
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                @click.stop="verDetallePaciente(null, { item })"
                title="Ver detalle"
              ></v-btn>
              <v-btn
                icon="mdi-medical-bag"
                size="small"
                variant="text"
                color="primary"
                @click.stop="verHistorial(item.id)"
                title="Historial médico"
              ></v-btn>
              <v-btn
                icon="mdi-calendar-plus"
                size="small"
                variant="text"
                color="success"
                @click.stop="agendarCita(item.id)"
                title="Agendar cita"
              ></v-btn>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click.stop="editarPaciente(item.id)"
                title="Editar"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click.stop="confirmarEliminar(item)"
                title="Eliminar"
              ></v-btn>
            </div>
          </template>
  
          <!-- Loading -->
          <template #loading>
            <div class="text-center py-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p class="mt-2">Cargando mascotas...</p>
            </div>
          </template>
  
          <!-- No data -->
          <template #no-data>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-paw-off</v-icon>
              <h3 class="text-h6 mb-2">No hay mascotas</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                {{ busqueda ? 'No se encontraron resultados para tu búsqueda' : 'Aún no hay mascotas registradas en el sistema' }}
              </p>
              <v-btn
                v-if="!busqueda"
                color="primary"
                prepend-icon="mdi-plus"
                @click="abrirFormularioNuevo"
              >
                Agregar Primera Mascota
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
  
      <!-- Dialog de confirmación para eliminar -->
      <v-dialog v-model="dialogEliminar" max-width="400">
        <v-card>
          <v-card-title class="text-h6">
            Confirmar Eliminación
          </v-card-title>
          <v-card-text>
            ¿Estás seguro de que deseas eliminar a <strong>{{ pacienteAEliminar?.nombre }}</strong>?
            <br><br>
            <v-alert type="warning" variant="tonal">
              Esta acción no se puede deshacer y eliminará todo el historial médico asociado.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialogEliminar = false">
              Cancelar
            </v-btn>
            <v-btn
              color="error"
              @click="eliminarPaciente"
              :loading="loadingEliminar"
            >
              Eliminar
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
  const { showSuccess, showError } = useNotifications()
  
  // Estado local
  const loading = ref(false)
  const error = ref('')
  const mostrarError = ref(false)
  const pacientes = ref([])
  const busqueda = ref('')
  const filtroEspecie = ref('')
  const filtroSexo = ref('')
  const dialogEliminar = ref(false)
  const pacienteAEliminar = ref(null)
  const loadingEliminar = ref(false)
  const itemsPerPage = ref(15)
  
  // Opciones para filtros
  const especies = ref(['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Pez'])
  const opcionesSexo = [
    { title: 'Macho', value: 'macho' },
    { title: 'Hembra', value: 'hembra' }
  ]
  
  // Headers para la tabla
  const headers = [
    {
      title: 'Mascota',
      key: 'mascota',
      sortable: true,
      width: '200px'
    },
    {
      title: 'Propietario',
      key: 'propietario',
      sortable: false,
      width: '180px'
    },
    {
      title: 'Información',
      key: 'info_basica',
      sortable: false,
      width: '150px'
    },
    {
      title: 'Peso',
      key: 'peso',
      sortable: true,
      width: '100px',
      align: 'center'
    },
    {
      title: 'Microchip',
      key: 'microchip',
      sortable: false,
      width: '140px',
      align: 'center'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      sortable: false,
      width: '200px',
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
  
  // Computadas
  const totalPacientes = computed(() => pagination.value.total)
  
  const pacientesFiltrados = computed(() => {
    let filtrados = [...pacientes.value]
    
    // Filtro por búsqueda
    if (busqueda.value) {
      const termino = busqueda.value.toLowerCase()
      filtrados = filtrados.filter(paciente => 
        paciente.nombre?.toLowerCase().includes(termino) ||
        paciente.especie?.nombre?.toLowerCase().includes(termino) ||
        paciente.raza?.nombre?.toLowerCase().includes(termino) ||
        paciente.propietario?.user?.nombre?.toLowerCase().includes(termino) ||
        paciente.propietario?.user?.apellido?.toLowerCase().includes(termino) ||
        paciente.color?.toLowerCase().includes(termino) ||
        paciente.microchip?.toLowerCase().includes(termino)
      )
    }
    
    // Filtro por especie
    if (filtroEspecie.value) {
      filtrados = filtrados.filter(paciente => 
        paciente.especie?.nombre === filtroEspecie.value
      )
    }
    
    // Filtro por sexo
    if (filtroSexo.value) {
      filtrados = filtrados.filter(paciente => 
        paciente.sexo === filtroSexo.value
      )
    }
    
    return filtrados
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
  
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'No especificada'
    
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    const diffTime = Math.abs(hoy - nacimiento)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const años = Math.floor(diffDays / 365)
    const meses = Math.floor((diffDays % 365) / 30)
    
    if (años > 0) {
      return meses > 0 ? `${años} años, ${meses} meses` : `${años} años`
    } else if (meses > 0) {
      return `${meses} meses`
    } else {
      return `${diffDays} días`
    }
  }
  
  // Métodos principales
  const cargarPacientes = async (page = 1) => {
    loading.value = true
    error.value = ''
    mostrarError.value = false
    
    try {
      console.log('Cargando pacientes desde la API...')
      
      const response = await api.get('/pacientes', {
        params: {
          page,
          per_page: itemsPerPage.value
        }
      })
      
      console.log('Respuesta completa de la API:', response.data)
      
      if (response.data && response.data.data) {
        pacientes.value = response.data.data
        
        if (response.data.meta) {
          pagination.value = {
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            per_page: response.data.meta.per_page,
            total: response.data.meta.total,
            from: response.data.meta.from,
            to: response.data.meta.to
          }
        }
        
        console.log('Pacientes cargados exitosamente:', pacientes.value.length)
      } else {
        error.value = 'Estructura de respuesta inesperada'
        mostrarError.value = true
        console.error('Estructura de respuesta inesperada:', response.data)
      }
    } catch (err) {
      console.error('Error al cargar pacientes:', err)
      error.value = err.response?.data?.message || 'Error de conexión con el servidor'
      mostrarError.value = true
      showError('Error al cargar pacientes')
    } finally {
      loading.value = false
    }
  }
  
  const cambiarPagina = async (page) => {
    await cargarPacientes(page)
  }
  
  const filtrarPacientes = () => {
    // La filtración se hace automáticamente con la computada
    console.log('Filtrando pacientes...')
  }
  
  // Navegación
  const verDetallePaciente = (event, { item }) => {
    console.log('Navegando a detalle del paciente:', item.id)
    router.push(`/pacientes/${item.id}`)
  }
  
  const editarPaciente = (id) => {
    console.log('Navegando a editar paciente:', id)
    router.push(`/pacientes/${id}/editar`)
  }
  
  const verHistorial = (id) => {
    console.log('Navegando a historial del paciente:', id)
    router.push(`/pacientes/${id}/historial`)
  }
  
  const agendarCita = (id) => {
    console.log('Navegando a agendar cita para paciente:', id)
    router.push(`/citas/nueva?paciente=${id}`)
  }
  
  const abrirFormularioNuevo = () => {
    console.log('Navegando a nueva mascota')
    router.push('/pacientes/nuevo')
  }
  
  // Eliminación
  const confirmarEliminar = (paciente) => {
    pacienteAEliminar.value = paciente
    dialogEliminar.value = true
  }
  
  const eliminarPaciente = async () => {
    if (!pacienteAEliminar.value) return
    
    loadingEliminar.value = true
    
    try {
      const response = await api.delete(`/pacientes/${pacienteAEliminar.value.id}`)
      
      if (response.data.success) {
        showSuccess('Mascota eliminada correctamente')
        dialogEliminar.value = false
        pacienteAEliminar.value = null
        await cargarPacientes()
      } else {
        showError(response.data.message || 'Error al eliminar mascota')
      }
    } catch (error) {
      console.error('Error al eliminar paciente:', error)
      showError('Error al eliminar mascota')
    } finally {
      loadingEliminar.value = false
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    console.log('Componente PacientesView montado')
    await cargarPacientes()
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