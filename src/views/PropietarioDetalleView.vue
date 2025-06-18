<template>
    <v-container fluid>
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          color="primary"
          size="64"
          indeterminate
        ></v-progress-circular>
        <p class="text-body-1 mt-4">Cargando información del propietario...</p>
      </div>
  
      <!-- Contenido principal -->
      <div v-else-if="propietario">
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
              <h1 class="text-h4 font-weight-bold">{{ propietario.nombre_completo }}</h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                {{ propietario.ocupacion || 'Sin ocupación especificada' }}
              </p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="editarPropietario"
            >
              Editar Propietario
            </v-btn>
          </v-col>
        </v-row>
  
        <!-- Información del propietario -->
        <v-row class="mb-6">
          <!-- Card de información personal -->
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-account</v-icon>
                Información Personal
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-email</v-icon>
                      </template>
                      <v-list-item-title>Email</v-list-item-title>
                      <v-list-item-subtitle>{{ propietario.email }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-phone</v-icon>
                      </template>
                      <v-list-item-title>Teléfono</v-list-item-title>
                      <v-list-item-subtitle>{{ propietario.telefono }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-map-marker</v-icon>
                      </template>
                      <v-list-item-title>Dirección</v-list-item-title>
                      <v-list-item-subtitle>{{ propietario.direccion }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-city</v-icon>
                      </template>
                      <v-list-item-title>Ciudad</v-list-item-title>
                      <v-list-item-subtitle>{{ propietario.ciudad }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                </v-row>
  
                <!-- Información adicional -->
                <v-divider class="my-4"></v-divider>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-message</v-icon>
                      </template>
                      <v-list-item-title>Preferencia de contacto</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip size="small" color="primary" variant="tonal">
                          {{ getPreferenciaContacto(propietario.preferencia_contacto) }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-cash</v-icon>
                      </template>
                      <v-list-item-title>Límite de crédito</v-list-item-title>
                      <v-list-item-subtitle>${{ formatearMoneda(propietario.limite_credito) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                </v-row>
  
                <!-- Contacto de emergencia -->
                <div v-if="propietario.contacto_emergencia_nombre">
                  <v-divider class="my-4"></v-divider>
                  <h4 class="text-h6 mb-3">Contacto de Emergencia</h4>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-list-item class="px-0">
                        <template #prepend>
                          <v-icon>mdi-account-emergency</v-icon>
                        </template>
                        <v-list-item-title>Nombre</v-list-item-title>
                        <v-list-item-subtitle>{{ propietario.contacto_emergencia_nombre }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-list-item class="px-0">
                        <template #prepend>
                          <v-icon>mdi-phone-alert</v-icon>
                        </template>
                        <v-list-item-title>Teléfono</v-list-item-title>
                        <v-list-item-subtitle>{{ propietario.contacto_emergencia_telefono }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-list-item class="px-0">
                        <template #prepend>
                          <v-icon>mdi-family-tree</v-icon>
                        </template>
                        <v-list-item-title>Relación</v-list-item-title>
                        <v-list-item-subtitle>{{ propietario.contacto_emergencia_relacion }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </div>
  
                <!-- Observaciones -->
                <div v-if="propietario.observaciones">
                  <v-divider class="my-4"></v-divider>
                  <h4 class="text-h6 mb-3">Observaciones</h4>
                  <p class="text-body-1">{{ propietario.observaciones }}</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <!-- Card de estadísticas -->
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-chart-box</v-icon>
                Estadísticas
              </v-card-title>
              <v-card-text>
                <div class="text-center mb-4">
                  <v-avatar size="80" color="primary" class="mb-3">
                    <span class="text-h4 font-weight-bold text-white">
                      {{ getIniciales(propietario.nombre_completo) }}
                    </span>
                  </v-avatar>
                </div>
  
                <v-row class="text-center">
                  <v-col cols="6">
                    <div class="text-h4 font-weight-bold text-primary">{{ propietario.total_mascotas || 0 }}</div>
                    <div class="text-caption text-medium-emphasis">Mascotas</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-h4 font-weight-bold text-success">{{ propietario.total_citas || 0 }}</div>
                    <div class="text-caption text-medium-emphasis">Citas</div>
                  </v-col>
                </v-row>
  
                <v-divider class="my-4"></v-divider>
  
                <div class="text-center">
                  <div class="text-body-2 text-medium-emphasis mb-2">Saldo Pendiente</div>
                  <v-chip
                    :color="getSaldoColor(propietario.saldo_pendiente)"
                    variant="tonal"
                    size="large"
                  >
                    ${{ formatearMoneda(propietario.saldo_pendiente) }}
                  </v-chip>
                </div>
  
                <div class="mt-4">
                  <div class="text-body-2 text-medium-emphasis mb-2">Preferencias</div>
                  <div class="d-flex flex-wrap gap-2">
                    <v-chip
                      v-if="propietario.acepta_promociones"
                      size="small"
                      color="green"
                      variant="tonal"
                    >
                      <v-icon start>mdi-check</v-icon>
                      Promociones
                    </v-chip>
                    <v-chip
                      v-if="propietario.acepta_recordatorios"
                      size="small"
                      color="blue"
                      variant="tonal"
                    >
                      <v-icon start>mdi-check</v-icon>
                      Recordatorios
                    </v-chip>
                  </div>
                </div>
  
                <div v-if="propietario.fecha_ultima_visita" class="mt-4">
                  <div class="text-body-2 text-medium-emphasis mb-2">Última Visita</div>
                  <div class="text-body-1">{{ formatearFecha(propietario.fecha_ultima_visita) }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Mascotas del propietario -->
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-2">mdi-paw</v-icon>
                  Mascotas ({{ mascotas.length }})
                </div>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="agregarMascota"
                >
                  Agregar Mascota
                </v-btn>
              </v-card-title>
              <v-card-text>
                <!-- Lista de mascotas -->
                <div v-if="mascotas.length > 0">
                  <v-row>
                    <v-col
                      v-for="mascota in mascotas"
                      :key="mascota.id"
                      cols="12"
                      sm="6"
                      lg="4"
                    >
                      <v-card
                        class="mascota-card"
                        elevation="2"
                        @click="verDetalleMascota(mascota.id)"
                      >
                        <v-card-text>
                          <!-- Header de la mascota -->
                          <div class="d-flex justify-space-between align-start mb-3">
                            <div class="d-flex align-center">
                              <v-avatar size="48" :color="getColorEspecie(mascota.especie_raza)" class="mr-3">
                                <v-icon color="white">{{ getIconoEspecie(mascota.especie_raza) }}</v-icon>
                              </v-avatar>
                              <div>
                                <h3 class="text-h6 font-weight-bold">{{ mascota.nombre }}</h3>
                                <p class="text-body-2 text-medium-emphasis mb-0">{{ mascota.especie_raza }}</p>
                              </div>
                            </div>
                            <v-menu>
                              <template #activator="{ props }">
                                <v-btn
                                  icon="mdi-dots-vertical"
                                  variant="text"
                                  size="small"
                                  v-bind="props"
                                  @click.stop
                                ></v-btn>
                              </template>
                              <v-list>
                                <v-list-item @click="verDetalleMascota(mascota.id)">
                                  <template #prepend>
                                    <v-icon>mdi-eye</v-icon>
                                  </template>
                                  <v-list-item-title>Ver Detalle</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="editarMascota(mascota.id)">
                                  <template #prepend>
                                    <v-icon>mdi-pencil</v-icon>
                                  </template>
                                  <v-list-item-title>Editar</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="agendarCita(mascota.id)">
                                  <template #prepend>
                                    <v-icon>mdi-calendar-plus</v-icon>
                                  </template>
                                  <v-list-item-title>Agendar Cita</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
  
                          <!-- Información básica -->
                          <div class="mb-3">
                            <div class="d-flex justify-space-between mb-2">
                              <span class="text-body-2">Edad:</span>
                              <span class="text-body-2 font-weight-medium">{{ mascota.edad }}</span>
                            </div>
                            <div class="d-flex justify-space-between mb-2">
                              <span class="text-body-2">Sexo:</span>
                              <span class="text-body-2 font-weight-medium">{{ getSexo(mascota.sexo) }}</span>
                            </div>
                            <div class="d-flex justify-space-between mb-2">
                              <span class="text-body-2">Color:</span>
                              <span class="text-body-2 font-weight-medium">{{ mascota.color }}</span>
                            </div>
                            <div v-if="mascota.peso" class="d-flex justify-space-between mb-2">
                              <span class="text-body-2">Peso:</span>
                              <span class="text-body-2 font-weight-medium">{{ mascota.peso }} kg</span>
                            </div>
                          </div>
  
                          <!-- Estado -->
                          <div class="d-flex justify-space-between align-center">
                            <v-chip
                              :color="getColorEstado(mascota.estado)"
                              size="small"
                              variant="tonal"
                            >
                              {{ mascota.estado }}
                            </v-chip>
                            <v-chip
                              v-if="mascota.esterilizado"
                              size="small"
                              color="blue"
                              variant="outlined"
                            >
                              Esterilizado
                            </v-chip>
                          </div>
  
                          <!-- Alertas médicas -->
                          <div v-if="mascota.alergias_conocidas || mascota.condiciones_medicas" class="mt-3">
                            <v-divider class="mb-2"></v-divider>
                            <div class="text-caption text-medium-emphasis mb-2">Alertas médicas:</div>
                            <div v-if="mascota.alergias_conocidas" class="mb-1">
                              <v-chip size="x-small" color="warning" variant="tonal">
                                <v-icon start size="12">mdi-alert</v-icon>
                                Alergias
                              </v-chip>
                            </div>
                            <div v-if="mascota.condiciones_medicas" class="mb-1">
                              <v-chip size="x-small" color="error" variant="tonal">
                                <v-icon start size="12">mdi-medical-bag</v-icon>
                                Condiciones médicas
                              </v-chip>
                            </div>
                          </div>
  
                          <!-- Próximas citas -->
                          <div v-if="mascota.fecha_proxima_vacuna || mascota.fecha_proxima_desparasitacion" class="mt-3">
                            <v-divider class="mb-2"></v-divider>
                            <div class="text-caption text-medium-emphasis mb-2">Próximos tratamientos:</div>
                            <div v-if="mascota.fecha_proxima_vacuna" class="d-flex align-center mb-1">
                              <v-icon size="12" class="mr-1">mdi-needle</v-icon>
                              <span class="text-caption">Vacuna: {{ formatearFecha(mascota.fecha_proxima_vacuna) }}</span>
                            </div>
                            <div v-if="mascota.fecha_proxima_desparasitacion" class="d-flex align-center">
                              <v-icon size="12" class="mr-1">mdi-pill</v-icon>
                              <span class="text-caption">Desparasitación: {{ formatearFecha(mascota.fecha_proxima_desparasitacion) }}</span>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
  
                <!-- No tiene mascotas -->
                <div v-else class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-paw-off</v-icon>
                  <h3 class="text-h6 mb-2">Sin mascotas registradas</h3>
                  <p class="text-body-2 text-medium-emphasis mb-4">
                    Este propietario aún no tiene mascotas registradas en el sistema
                  </p>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="agregarMascota"
                  >
                    Agregar Primera Mascota
                  </v-btn>
                </div>
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
          <div class="font-weight-bold mb-2">Error al cargar el propietario:</div>
          <p>{{ error }}</p>
          <v-btn
            color="error"
            variant="outlined"
            @click="cargarPropietario"
            class="mt-2"
          >
            Reintentar
          </v-btn>
        </v-alert>
      </div>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotifications } from '@/composables/useNotifications'
  import api from '@/api/axios'
  
  const route = useRoute()
  const router = useRouter()
  const { showNotification } = useNotifications()
  
  // Funciones de notificación compatibles con tu sistema
  const showSuccess = (message) => {
    showNotification(message, 'success')
  }
  
  const showError = (message) => {
    showNotification(message, 'error')
  }
  
  // Props
  const propietarioId = computed(() => route.params.id)
  
  // Estado local
  const loading = ref(false)
  const error = ref('')
  const propietario = ref(null)
  
  // Computadas
  const mascotas = computed(() => propietario.value?.pacientes || [])
  
  // Métodos de utilidad
  const getIniciales = (nombreCompleto) => {
    if (!nombreCompleto) return '??'
    const nombres = nombreCompleto.split(' ')
    return nombres.map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()
  }
  
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO').format(parseFloat(valor || 0))
  }
  
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getSaldoColor = (saldo) => {
    const valor = parseFloat(saldo || 0)
    if (valor > 0) return 'error'
    if (valor < 0) return 'success'
    return 'grey'
  }
  
  const getPreferenciaContacto = (preferencia) => {
    const opciones = {
      email: 'Email',
      telefono: 'Teléfono',
      whatsapp: 'WhatsApp'
    }
    return opciones[preferencia] || preferencia
  }
  
  const getSexo = (sexo) => {
    const opciones = {
      M: 'Macho',
      F: 'Hembra'
    }
    return opciones[sexo] || sexo
  }
  
  const getColorEspecie = (especieRaza) => {
    if (especieRaza?.toLowerCase().includes('perro')) return 'brown'
    if (especieRaza?.toLowerCase().includes('gato')) return 'purple'
    if (especieRaza?.toLowerCase().includes('ave')) return 'orange'
    return 'blue-grey'
  }
  
  const getIconoEspecie = (especieRaza) => {
    if (especieRaza?.toLowerCase().includes('perro')) return 'mdi-dog'
    if (especieRaza?.toLowerCase().includes('gato')) return 'mdi-cat'
    if (especieRaza?.toLowerCase().includes('ave')) return 'mdi-bird'
    return 'mdi-paw'
  }
  
  const getColorEstado = (estado) => {
    const colores = {
      activo: 'success',
      inactivo: 'grey',
      fallecido: 'error'
    }
    return colores[estado] || 'grey'
  }
  
  // Métodos principales
  const cargarPropietario = async () => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('Cargando propietario ID:', propietarioId.value)
      
      const response = await api.get(`/propietarios/${propietarioId.value}`)
      
      if (response.data && response.data.data) {
        propietario.value = response.data.data
        console.log('Propietario cargado:', propietario.value)
      } else {
        error.value = 'Propietario no encontrado'
      }
    } catch (err) {
      console.error('Error al cargar propietario:', err)
      error.value = err.response?.data?.message || 'Error al cargar el propietario'
      showError('Error al cargar el propietario')
    } finally {
      loading.value = false
    }
  }
  
  // Navegación
  const volver = () => {
    router.push({ name: 'propietarios' })
  }
  
  const editarPropietario = () => {
    router.push({ name: 'propietario-editar', params: { id: propietarioId.value } })
  }
  
  const agregarMascota = () => {
    // Cuando tengas las rutas de pacientes, usar algo como:
    // router.push({ name: 'paciente-nuevo', query: { propietario: propietarioId.value } })
    router.push(`/pacientes/nuevo?propietario=${propietarioId.value}`)
  }
  
  const verDetalleMascota = (mascotaId) => {
    // Cuando tengas las rutas de pacientes, usar:
    // router.push({ name: 'paciente-detalle', params: { id: mascotaId } })
    router.push(`/pacientes/${mascotaId}`)
  }
  
  const editarMascota = (mascotaId) => {
    // Cuando tengas las rutas de pacientes, usar:
    // router.push({ name: 'paciente-editar', params: { id: mascotaId } })
    router.push(`/pacientes/${mascotaId}/editar`)
  }
  
  const agendarCita = (mascotaId) => {
    // Cuando tengas las rutas de citas, usar:
    // router.push({ name: 'cita-nueva', query: { paciente: mascotaId } })
    router.push(`/citas/nueva?paciente=${mascotaId}`)
  }
  
  // Lifecycle
  onMounted(async () => {
    console.log('Componente PropietarioDetalleView montado')
    await cargarPropietario()
  })
  </script>
  
  <style scoped>
  .mascota-card {
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .mascota-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  .v-list-item {
    min-height: auto !important;
    padding: 8px 0 !important;
  }
  </style>