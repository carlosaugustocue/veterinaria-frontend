<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
        :prepend-avatar="userAvatar"
        :title="authStore.userName"
        :subtitle="authStore.userRole"
        nav
      >
        <template #append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          :active="$route.name === 'dashboard'"
          @click="$router.push('/dashboard')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Propietarios"
          value="propietarios"
          :active="$route.path.startsWith('/propietarios')"
          @click="$router.push('/propietarios')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-paw"
          title="Mascotas"
          value="pacientes"
          :active="$route.path.startsWith('/pacientes')"
          @click="$router.push('/pacientes')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-calendar-clock"
          title="Citas"
          value="citas"
          :active="$route.path.startsWith('/citas')"
          @click="$router.push('/citas')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-stethoscope"
          title="Consultas"
          value="consultas"
          :active="$route.path.startsWith('/consultas')"
          @click="navegarA('/consultas')"
        ></v-list-item>

        <!-- <v-list-item
          prepend-icon="mdi-prescription"
          title="Fórmulas"
          value="formulas"
          :active="$route.path.startsWith('/formulas')"
          @click="navegarA('/formulas')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-receipt"
          title="Facturas"
          value="facturas"
          :active="$route.path.startsWith('/facturas')"
          @click="navegarA('/facturas')"
        ></v-list-item> -->

        <v-list-group value="administracion">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-cog"
              title="Administración"
            ></v-list-item>
          </template>

          <v-list-item
            prepend-icon="mdi-doctor"
            title="Veterinarios"
            value="veterinarios"
            @click="navegarA('/veterinarios')"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-chart-line"
            title="Reportes"
            value="reportes"
            @click="navegarA('/reportes')"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <!-- Header del Dashboard -->
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center">
              <div>
                <h1 class="text-h4 font-weight-bold">
                  Dashboard
                </h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Bienvenido al sistema de gestión veterinaria
                </p>
              </div>
              <v-btn
                color="primary"
                prepend-icon="mdi-refresh"
                @click="cargarDatos"
                :loading="loadingStats"
                variant="outlined"
              >
                Actualizar
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Loading overlay para estadísticas -->
        <v-overlay v-model="loadingStats" contained class="align-center justify-center">
          <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
        </v-overlay>

        <!-- Cards de estadísticas -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3">
            <v-card color="primary" variant="flat" @click="$router.push('/pacientes')" class="cursor-pointer hover-lift">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="48" color="white" class="mr-3">mdi-paw</v-icon>
                  <div>
                    <div class="text-h4 text-white font-weight-bold">
                      {{ loadingStats ? '-' : stats.totalMascotas }}
                    </div>
                    <div class="text-white">Mascotas</div>
                    <div class="text-caption text-white" style="opacity: 0.8">
                      +{{ loadingStats ? '-' : stats.mascotasEsteMes }} este mes
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card color="success" variant="flat" @click="$router.push('/citas')" class="cursor-pointer hover-lift">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="48" color="white" class="mr-3">mdi-calendar-check</v-icon>
                  <div>
                    <div class="text-h4 text-white font-weight-bold">
                      {{ loadingStats ? '-' : stats.citasHoy }}
                    </div>
                    <div class="text-white">Citas Hoy</div>
                    <div class="text-caption text-white" style="opacity: 0.8">
                      {{ loadingStats ? '-' : stats.citasPendientes }} pendientes
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card color="warning" variant="flat" @click="$router.push('/propietarios')" class="cursor-pointer hover-lift">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="48" color="white" class="mr-3">mdi-account-group</v-icon>
                  <div>
                    <div class="text-h4 text-white font-weight-bold">
                      {{ loadingStats ? '-' : stats.totalPropietarios }}
                    </div>
                    <div class="text-white">Propietarios</div>
                    <div class="text-caption text-white" style="opacity: 0.8">
                      {{ loadingStats ? '-' : stats.propietariosActivos }} activos
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card color="info" variant="flat" @click="navegarA('/facturas')" class="cursor-pointer hover-lift">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="48" color="white" class="mr-3">mdi-cash</v-icon>
                  <div>
                    <div class="text-h4 text-white font-weight-bold">
                      ${{ loadingStats ? '-' : formatCurrency(stats.ingresosMes) }}
                    </div>
                    <div class="text-white">Ingresos del Mes</div>
                    <div class="text-caption text-white" style="opacity: 0.8">
                      {{ stats.crecimientoMes > 0 ? '+' : '' }}{{ loadingStats ? '-' : stats.crecimientoMes }}% vs mes anterior
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Contenido principal -->
        <v-row>
          <!-- Citas de hoy -->
          <v-col cols="12" lg="8">
            <v-card class="mb-4">
              <v-card-title class="d-flex justify-space-between align-center">
                <div>
                  <v-icon class="mr-2">mdi-calendar-today</v-icon>
                  Citas de Hoy
                </div>
                <v-btn
                  size="small"
                  variant="outlined"
                  prepend-icon="mdi-plus"
                  @click="$router.push('/citas/nueva')"
                >
                  Nueva Cita
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-progress-linear v-if="loadingCitas" indeterminate color="primary"></v-progress-linear>
                <v-list v-else>
                  <v-list-item
                    v-for="cita in citasHoy"
                    :key="cita.id"
                    class="cursor-pointer hover-item"
                    @click="verCita(cita.id)"
                  >
                    <template #prepend>
                      <v-avatar :color="getColorEspecie(cita.paciente?.especie?.nombre)" class="mr-3">
                        <v-icon color="white">{{ getIconoEspecie(cita.paciente?.especie?.nombre) }}</v-icon>
                      </v-avatar>
                    </template>
                    
                    <v-list-item-title>{{ cita.paciente?.nombre || 'N/A' }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <div>{{ formatHora(cita.fecha_hora) }} - {{ cita.propietario?.user?.nombre }} {{ cita.propietario?.user?.apellido }}</div>
                      <div class="text-caption">{{ cita.motivo || 'Sin motivo especificado' }}</div>
                    </v-list-item-subtitle>

                    <template #append>
                      <div class="text-right">
                        <v-chip
                          :color="getEstadoColor(cita.estado)"
                          size="small"
                          class="mb-1"
                        >
                          {{ capitalizeFirst(cita.estado) }}
                        </v-chip>
                        <div class="text-caption text-medium-emphasis">
                          Dr. {{ cita.veterinario?.user?.apellido || 'N/A' }}
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                  
                  <v-list-item v-if="citasHoy.length === 0 && !loadingCitas">
                    <v-list-item-title class="text-center text-medium-emphasis">
                      <v-icon class="mr-2">mdi-calendar-check</v-icon>
                      No hay citas programadas para hoy
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Panel lateral -->
          <v-col cols="12" lg="4">
            <!-- Mascotas recientes -->
            <v-card class="mb-4">
              <v-card-title class="d-flex justify-space-between align-center">
                <div>
                  <v-icon class="mr-2">mdi-paw</v-icon>
                  Mascotas Recientes
                </div>
                <v-btn
                  size="small"
                  variant="text"
                  @click="$router.push('/pacientes')"
                >
                  Ver todas
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-progress-linear v-if="loadingMascotas" indeterminate color="primary"></v-progress-linear>
                <v-list v-else>
                  <v-list-item
                    v-for="mascota in mascotasRecientes"
                    :key="mascota.id"
                    class="cursor-pointer hover-item"
                    @click="$router.push(`/pacientes/${mascota.id}`)"
                  >
                    <template #prepend>
                      <v-avatar :color="getColorEspecie(mascota.especie?.nombre)" size="32">
                        <v-icon color="white" size="18">{{ getIconoEspecie(mascota.especie?.nombre) }}</v-icon>
                      </v-avatar>
                    </template>
                    
                    <v-list-item-title class="text-body-2">{{ mascota.nombre }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      {{ mascota.especie?.nombre || 'N/A' }} - {{ mascota.propietario?.user?.nombre }} {{ mascota.propietario?.user?.apellido }}
                    </v-list-item-subtitle>

                    <template #append>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatFechaRelativa(mascota.created_at) }}
                      </div>
                    </template>
                  </v-list-item>

                  <v-list-item v-if="mascotasRecientes.length === 0 && !loadingMascotas">
                    <v-list-item-title class="text-center text-medium-emphasis">
                      <v-icon class="mr-2">mdi-paw</v-icon>
                      No hay mascotas registradas recientemente
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Actividad reciente -->
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-history</v-icon>
                Actividad Reciente
              </v-card-title>
              <v-card-text>
                <v-timeline density="compact">
                  <v-timeline-item
                    v-for="actividad in actividadReciente"
                    :key="actividad.id"
                    :dot-color="actividad.color"
                    size="small"
                  >
                    <template #icon>
                      <v-icon size="small">{{ actividad.icon }}</v-icon>
                    </template>
                    <div>
                      <div class="text-body-2 font-weight-medium">{{ actividad.titulo }}</div>
                      <div class="text-caption text-medium-emphasis">{{ actividad.tiempo }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Accesos rápidos -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
                Accesos Rápidos
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6" sm="4" md="2">
                    <v-btn
                      block
                      variant="outlined"
                      class="mb-2 quick-action-btn"
                      @click="$router.push('/propietarios/nuevo')"
                    >
                      <div class="text-center">
                        <v-icon class="mb-1" size="24">mdi-account-plus</v-icon>
                        <div class="text-caption">Nuevo<br>Propietario</div>
                      </div>
                    </v-btn>
                  </v-col>
                  <v-col cols="6" sm="4" md="2">
                    <v-btn
                      block
                      variant="outlined"
                      class="mb-2 quick-action-btn"
                      @click="navegarA('/pacientes/nuevo')"
                    >
                      <div class="text-center">
                        <v-icon class="mb-1" size="24">mdi-paw</v-icon>
                        <div class="text-caption">Nueva<br>Mascota</div>
                      </div>
                    </v-btn>
                  </v-col>
                  <v-col cols="6" sm="4" md="2">
                    <v-btn
                      block
                      variant="outlined"
                      class="mb-2 quick-action-btn"
                      @click="$router.push('/citas/nueva')"
                    >
                      <div class="text-center">
                        <v-icon class="mb-1" size="24">mdi-calendar-plus</v-icon>
                        <div class="text-caption">Nueva<br>Cita</div>
                      </div>
                    </v-btn>
                  </v-col>
                  <v-col cols="6" sm="4" md="2">
                    <v-btn
                      block
                      variant="outlined"
                      class="mb-2 quick-action-btn"
                      @click="navegarA('/consultas/nueva')"
                    >
                      <div class="text-center">
                        <v-icon class="mb-1" size="24">mdi-stethoscope</v-icon>
                        <div class="text-caption">Nueva<br>Consulta</div>
                      </div>
                    </v-btn>
                  </v-col>
                  <v-col cols="6" sm="4" md="2">
                    <v-btn
                      block
                      variant="outlined"
                      class="mb-2 quick-action-btn"
                      @click="navegarA('/formulas/nueva')"
                    >
                      <div class="text-center">
                        <v-icon class="mb-1" size="24">mdi-prescription</v-icon>
                        <div class="text-caption">Nueva<br>Fórmula</div>
                      </div>
                    </v-btn>
                  </v-col>
                  <v-col cols="6" sm="4" md="2">
                    <v-btn
                      block
                      variant="outlined"
                      class="mb-2 quick-action-btn"
                      @click="navegarA('/facturas/nueva')"
                    >
                      <div class="text-center">
                        <v-icon class="mb-1" size="24">mdi-receipt</v-icon>
                        <div class="text-caption">Nueva<br>Factura</div>
                      </div>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'
import { useApi } from '@/composables/useApi'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showInfo, showError } = useNotifications()
const { get } = useApi()

// Variables reactivas
const drawer = ref(true)
const rail = ref(false)
const loadingStats = ref(false)
const loadingCitas = ref(false)
const loadingMascotas = ref(false)

// Datos reales de la API
const stats = ref({
  totalMascotas: 0,
  mascotasEsteMes: 0,
  citasHoy: 0,
  citasPendientes: 0,
  totalPropietarios: 0,
  propietariosActivos: 0,
  ingresosMes: 0,
  crecimientoMes: 0
})

const citasHoy = ref([])
const mascotasRecientes = ref([])

// Actividad reciente (esto podría venir de un endpoint específico o calcularse)
const actividadReciente = ref([
  {
    id: 1,
    titulo: 'Nueva cita programada',
    tiempo: 'Hace 5 minutos',
    icon: 'mdi-calendar-plus',
    color: 'success'
  },
  {
    id: 2,
    titulo: 'Consulta completada',
    tiempo: 'Hace 1 hora',
    icon: 'mdi-stethoscope',
    color: 'primary'
  },
  {
    id: 3,
    titulo: 'Nuevo propietario registrado',
    tiempo: 'Hace 2 horas',
    icon: 'mdi-account-plus',
    color: 'info'
  },
  {
    id: 4,
    titulo: 'Mascota registrada',
    tiempo: 'Hace 3 horas',
    icon: 'mdi-paw',
    color: 'warning'
  }
])

// Computed
const userAvatar = computed(() => {
  return `https://ui-avatars.com/api/?name=${authStore.userName}&background=1976d2&color=fff`
})

// Métodos para cargar datos de la API
const cargarEstadisticas = async () => {
  loadingStats.value = true
  try {
    // Cargar mascotas
    const pacientesResponse = await get('/pacientes', { 
      params: { per_page: 1000 } // Obtener todos para contar
    })
    
    if (pacientesResponse.success) {
      stats.value.totalMascotas = pacientesResponse.data.pagination?.total || pacientesResponse.data.length
      
      // Calcular mascotas del mes actual
      const hoy = new Date()
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const mascotasEsteMes = pacientesResponse.data.filter(mascota => {
        const fechaCreacion = new Date(mascota.created_at)
        return fechaCreacion >= inicioMes
      })
      stats.value.mascotasEsteMes = mascotasEsteMes.length
    }

    // Cargar propietarios
    const propietariosResponse = await get('/propietarios', { 
      params: { per_page: 1000 } 
    })
    
    if (propietariosResponse.success) {
      stats.value.totalPropietarios = propietariosResponse.data.pagination?.total || propietariosResponse.data.length
      stats.value.propietariosActivos = propietariosResponse.data.length // Asumiendo que todos están activos
    }

    // Cargar citas de hoy
    const hoy = new Date().toISOString().split('T')[0]
    const citasResponse = await get('/citas', {
      params: { 
        fecha: hoy,
        per_page: 100 
      }
    })
    
    if (citasResponse.success) {
      const citas = citasResponse.data.citas || citasResponse.data
      stats.value.citasHoy = citas.length
      stats.value.citasPendientes = citas.filter(cita => 
        cita.estado === 'programada' || cita.estado === 'pendiente'
      ).length
    }

    // Cargar facturas del mes (si está disponible)
    try {
      const facturasResponse = await get('/facturas', {
        params: {
          fecha_desde: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          fecha_hasta: new Date().toISOString().split('T')[0]
        }
      })
      
      if (facturasResponse.success) {
        const facturas = facturasResponse.data
        stats.value.ingresosMes = facturas.reduce((total, factura) => {
          return total + (factura.total || 0)
        }, 0)
      }
    } catch (error) {
      console.log('Endpoint de facturas no disponible:', error)
      stats.value.ingresosMes = 0
    }

  } catch (error) {
    console.error('Error cargando estadísticas:', error)
    showError('Error al cargar las estadísticas del dashboard')
  } finally {
    loadingStats.value = false
  }
}

const cargarCitasHoy = async () => {
  loadingCitas.value = true
  try {
    const hoy = new Date().toISOString().split('T')[0]
    const response = await get('/citas', {
      params: { 
        fecha: hoy,
        per_page: 10
      }
    })
    
    if (response.success) {
      citasHoy.value = response.data.citas || response.data || []
    }
  } catch (error) {
    console.error('Error cargando citas de hoy:', error)
    citasHoy.value = []
  } finally {
    loadingCitas.value = false
  }
}

const cargarMascotasRecientes = async () => {
  loadingMascotas.value = true
  try {
    const response = await get('/pacientes', {
      params: { 
        per_page: 5,
        page: 1
      }
    })
    
    if (response.success) {
      mascotasRecientes.value = response.data.slice(0, 5) || []
    }
  } catch (error) {
    console.error('Error cargando mascotas recientes:', error)
    mascotasRecientes.value = []
  } finally {
    loadingMascotas.value = false
  }
}

const cargarDatos = async () => {
  await Promise.all([
    cargarEstadisticas(),
    cargarCitasHoy(),
    cargarMascotasRecientes()
  ])
}

// Métodos de utilidad
const getEstadoColor = (estado) => {
  const colores = {
    programada: 'info',
    confirmada: 'success',
    completada: 'primary',
    cancelada: 'error',
    pendiente: 'warning'
  }
  return colores[estado] || 'grey'
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

const formatCurrency = (valor) => {
  return new Intl.NumberFormat('es-CO').format(valor)
}

const formatHora = (fechaHora) => {
  if (!fechaHora) return 'N/A'
  return new Date(fechaHora).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFechaRelativa = (fecha) => {
  if (!fecha) return 'N/A'
  
  const ahora = new Date()
  const fechaCreacion = new Date(fecha)
  const diferencia = ahora - fechaCreacion
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  
  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Ayer'
  if (dias < 7) return `${dias} días`
  return fechaCreacion.toLocaleDateString('es-CO')
}

const capitalizeFirst = (texto) => {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const verCita = (citaId) => {
  router.push(`/citas/${citaId}`)
}

const navegarA = (ruta) => {
  showInfo(`Funcionalidad "${ruta}" próximamente disponible`)
}

// Lifecycle
onMounted(() => {
  console.log('Dashboard cargado para:', authStore.userName)
  cargarDatos()
})
</script>

<style scoped>
.v-navigation-drawer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-navigation-drawer .v-list-item {
  color: white;
}

.v-navigation-drawer .v-list-item--active {
  background-color: rgba(255, 255, 255, 0.2);
}

.cursor-pointer {
  cursor: pointer;
}

.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.hover-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
}

.quick-action-btn {
  height: auto !important;
  padding: 16px 8px !important;
}

.quick-action-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>