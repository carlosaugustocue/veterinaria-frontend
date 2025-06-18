<template>
    <v-container fluid>
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold">
            <v-icon size="large" class="mr-2">mdi-account-group</v-icon>
            Propietarios
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Gestión de propietarios y sus mascotas
          </p>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end align-center">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="abrirFormularioNuevo"
          >
            Nuevo Propietario
          </v-btn>
        </v-col>
      </v-row>
  
      <!-- Controles -->
      <v-card class="mb-4">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-information</v-icon>
                <span class="text-body-1">
                  Total de propietarios: <strong>{{ totalPropietarios }}</strong>
                </span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="busqueda"
                prepend-inner-icon="mdi-magnify"
                label="Buscar propietario..."
                hide-details
                clearable
                @input="filtrarPropietarios"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="d-flex justify-end">
              <v-btn
                icon
                variant="outlined"
                @click="cargarPropietarios"
                :loading="loading"
                title="Actualizar lista"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
  
      <!-- Tabla de propietarios -->
      <v-card>
        <v-data-table
          :headers="headers"
          :items="propietariosFiltrados"
          :loading="loading"
          :items-per-page="itemsPerPage"
          @click:row="verDetallePropietario"
          class="cursor-pointer"
          hover
        >
          <!-- Slot para el nombre completo con avatar -->
          <template #item.nombre_completo="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="40" color="primary" class="mr-3">
                <span class="text-white font-weight-bold">
                  {{ getIniciales(item.nombre_completo) }}
                </span>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.nombre_completo }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.ocupacion || 'Sin especificar' }}</div>
              </div>
            </div>
          </template>
  
          <!-- Slot para contacto -->
          <template #item.contacto="{ item }">
            <div>
              <div class="d-flex align-center mb-1">
                <v-icon size="14" class="mr-1">mdi-email</v-icon>
                <span class="text-body-2">{{ item.email }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                <span class="text-body-2">{{ item.telefono }}</span>
              </div>
            </div>
          </template>
  
          <!-- Slot para dirección -->
          <template #item.direccion_completa="{ item }">
            <div>
              <div>{{ item.direccion }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.ciudad }}</div>
            </div>
          </template>
  
          <!-- Slot para estadísticas -->
          <template #item.estadisticas="{ item }">
            <div class="d-flex justify-space-around">
              <div class="text-center">
                <div class="text-h6 font-weight-bold text-primary">{{ item.total_mascotas || 0 }}</div>
                <div class="text-caption">Mascotas</div>
              </div>
              <div class="text-center">
                <div class="text-h6 font-weight-bold text-success">{{ item.total_citas || 0 }}</div>
                <div class="text-caption">Citas</div>
              </div>
            </div>
          </template>
  
          <!-- Slot para saldo -->
          <template #item.saldo_pendiente="{ item }">
            <v-chip
              :color="getSaldoColor(item.saldo_pendiente)"
              variant="tonal"
              size="small"
            >
              ${{ formatearMoneda(item.saldo_pendiente) }}
            </v-chip>
          </template>
  
          <!-- Slot para acciones -->
          <template #item.acciones="{ item }">
            <div class="d-flex">
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                @click.stop="verDetallePropietario(null, { item })"
                title="Ver detalle"
              ></v-btn>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click.stop="editarPropietario(item.id)"
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
              <p class="mt-2">Cargando propietarios...</p>
            </div>
          </template>
  
          <!-- No data -->
          <template #no-data>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-group-outline</v-icon>
              <h3 class="text-h6 mb-2">No hay propietarios</h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                {{ busqueda ? 'No se encontraron resultados para tu búsqueda' : 'Aún no hay propietarios registrados en el sistema' }}
              </p>
              <v-btn
                v-if="!busqueda"
                color="primary"
                prepend-icon="mdi-plus"
                @click="abrirFormularioNuevo"
              >
                Agregar Primer Propietario
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
            ¿Estás seguro de que deseas eliminar al propietario <strong>{{ propietarioAEliminar?.nombre_completo }}</strong>?
            <br><br>
            <v-alert type="warning" variant="tonal">
              Esta acción no se puede deshacer y también eliminará todas las mascotas asociadas.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="dialogEliminar = false">
              Cancelar
            </v-btn>
            <v-btn
              color="error"
              @click="eliminarPropietario"
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
  const propietarios = ref([])
  const busqueda = ref('')
  const dialogEliminar = ref(false)
  const propietarioAEliminar = ref(null)
  const loadingEliminar = ref(false)
  const itemsPerPage = ref(15)
  
  // Headers para la tabla
  const headers = [
    {
      title: 'Propietario',
      key: 'nombre_completo',
      sortable: true,
      width: '250px'
    },
    {
      title: 'Contacto',
      key: 'contacto',
      sortable: false,
      width: '200px'
    },
    {
      title: 'Dirección',
      key: 'direccion_completa',
      sortable: false,
      width: '200px'
    },
    {
      title: 'Estadísticas',
      key: 'estadisticas',
      sortable: false,
      width: '150px',
      align: 'center'
    },
    {
      title: 'Saldo',
      key: 'saldo_pendiente',
      sortable: true,
      width: '120px',
      align: 'center'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      sortable: false,
      width: '120px',
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
  const totalPropietarios = computed(() => pagination.value.total)
  
  const propietariosFiltrados = computed(() => {
    if (!busqueda.value) return propietarios.value
    
    const termino = busqueda.value.toLowerCase()
    return propietarios.value.filter(propietario => 
      propietario.nombre_completo?.toLowerCase().includes(termino) ||
      propietario.email?.toLowerCase().includes(termino) ||
      propietario.telefono?.includes(termino) ||
      propietario.ciudad?.toLowerCase().includes(termino) ||
      propietario.ocupacion?.toLowerCase().includes(termino)
    )
  })
  
  // Métodos
  const getIniciales = (nombreCompleto) => {
    if (!nombreCompleto) return '??'
    const nombres = nombreCompleto.split(' ')
    return nombres.map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()
  }
  
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO').format(parseFloat(valor || 0))
  }
  
  const getSaldoColor = (saldo) => {
    const valor = parseFloat(saldo || 0)
    if (valor > 0) return 'error'
    if (valor < 0) return 'success'
    return 'grey'
  }
  
  const cargarPropietarios = async (page = 1) => {
    loading.value = true
    error.value = ''
    mostrarError.value = false
    
    try {
      console.log('Cargando propietarios desde la API...')
      
      const response = await api.get('/propietarios', {
        params: {
          page,
          per_page: itemsPerPage.value
        }
      })
      
      console.log('Respuesta completa de la API:', response.data)
      
      if (response.data && response.data.data) {
        propietarios.value = response.data.data
        
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
        
        console.log('Propietarios cargados exitosamente:', propietarios.value.length)
      } else {
        error.value = 'Estructura de respuesta inesperada'
        mostrarError.value = true
        console.error('Estructura de respuesta inesperada:', response.data)
      }
    } catch (err) {
      console.error('Error al cargar propietarios:', err)
      error.value = err.response?.data?.message || 'Error de conexión con el servidor'
      mostrarError.value = true
      showError('Error al cargar propietarios')
    } finally {
      loading.value = false
    }
  }
  
  const cambiarPagina = async (page) => {
    await cargarPropietarios(page)
  }
  
  const filtrarPropietarios = () => {
    // La filtración se hace automáticamente con la computada
    console.log('Filtrando por:', busqueda.value)
  }
  
  // Navegación
  const verDetallePropietario = (event, { item }) => {
    console.log('Navegando a detalle del propietario:', item.id)
    router.push({ name: 'propietario-detalle', params: { id: item.id } })
  }
  
  const editarPropietario = (id) => {
    console.log('Navegando a editar propietario:', id)
    router.push({ name: 'propietario-editar', params: { id } })
  }
  
  const abrirFormularioNuevo = () => {
    console.log('Navegando a nuevo propietario')
    router.push({ name: 'propietario-nuevo' })
  }
  
  // Eliminación
  const confirmarEliminar = (propietario) => {
    propietarioAEliminar.value = propietario
    dialogEliminar.value = true
  }
  
  const eliminarPropietario = async () => {
    if (!propietarioAEliminar.value) return
    
    loadingEliminar.value = true
    
    try {
      const response = await api.delete(`/propietarios/${propietarioAEliminar.value.id}`)
      
      if (response.data.success) {
        showSuccess('Propietario eliminado correctamente')
        dialogEliminar.value = false
        propietarioAEliminar.value = null
        await cargarPropietarios()
      } else {
        showError(response.data.message || 'Error al eliminar propietario')
      }
    } catch (error) {
      console.error('Error al eliminar propietario:', error)
      showError('Error al eliminar propietario')
    } finally {
      loadingEliminar.value = false
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    console.log('Componente PropietariosView montado')
    await cargarPropietarios()
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