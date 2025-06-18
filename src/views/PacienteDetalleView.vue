<template>
    <v-container fluid>
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          color="primary"
          size="64"
          indeterminate
        ></v-progress-circular>
        <p class="text-body-1 mt-4">Cargando información del paciente...</p>
      </div>
  
      <!-- Contenido principal -->
      <div v-else-if="paciente">
        <!-- Header con navegación -->
        <v-row class="mb-4">
          <v-col cols="12" class="d-flex align-center">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="volver"
              class="mr-3"
            ></v-btn>
            <v-avatar size="48" :color="getColorEspecie(paciente.especie?.nombre)" class="mr-3">
              <v-icon color="white">{{ getIconoEspecie(paciente.especie?.nombre) }}</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <h1 class="text-h4 font-weight-bold">{{ paciente.nombre }}</h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                {{ paciente.especie?.nombre }} - {{ paciente.raza?.nombre }}
              </p>
            </div>
            <div class="d-flex gap-2">
              <v-btn
                color="success"
                prepend-icon="mdi-calendar-plus"
                @click="agendarCita"
              >
                Agendar Cita
              </v-btn>
              <v-btn
                color="primary"
                prepend-icon="mdi-pencil"
                @click="editarPaciente"
              >
                Editar
              </v-btn>
            </div>
          </v-col>
        </v-row>
  
        <!-- Información básica -->
        <v-row class="mb-6">
          <!-- Card de información general -->
          <v-col cols="12" lg="8">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">{{ getIconoEspecie(paciente.especie?.nombre) }}</v-icon>
                Información General
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title>Fecha de nacimiento</v-list-item-title>
                      <v-list-item-subtitle>{{ formatearFecha(paciente.fecha_nacimiento) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-cake</v-icon>
                      </template>
                      <v-list-item-title>Edad</v-list-item-title>
                      <v-list-item-subtitle>{{ calcularEdad(paciente.fecha_nacimiento) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>{{ paciente.sexo === 'macho' ? 'mdi-gender-male' : 'mdi-gender-female' }}</v-icon>
                      </template>
                      <v-list-item-title>Sexo</v-list-item-title>
                      <v-list-item-subtitle>{{ paciente.sexo }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-palette</v-icon>
                      </template>
                      <v-list-item-title>Color</v-list-item-title>
                      <v-list-item-subtitle>{{ paciente.color }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-weight</v-icon>
                      </template>
                      <v-list-item-title>Peso</v-list-item-title>
                      <v-list-item-subtitle>{{ paciente.peso ? `${paciente.peso} kg` : 'No registrado' }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon>mdi-chip</v-icon>
                      </template>
                      <v-list-item-title>Microchip</v-list-item-title>
                      <v-list-item-subtitle>{{ paciente.microchip || 'No registrado' }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                </v-row>
  
                <!-- Propietario -->
                <v-divider class="my-4"></v-divider>
                <h4 class="text-h6 mb-3">Propietario</h4>
                <div v-if="paciente.propietario">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-list-item class="px-0">
                        <template #prepend>
                          <v-icon>mdi-account</v-icon>
                        </template>
                        <v-list-item-title>Nombre</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ paciente.propietario.user?.nombre }} {{ paciente.propietario.user?.apellido }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-list-item class="px-0">
                        <template #prepend>
                          <v-icon>mdi-phone</v-icon>
                        </template>
                        <v-list-item-title>Teléfono</v-list-item-title>
                        <v-list-item-subtitle>{{ paciente.propietario.user?.telefono }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-btn
                    variant="outlined"
                    prepend-icon="mdi-eye"
                    @click="verPropietario"
                    class="mt-3"
                  >
                    Ver Perfil Completo
                  </v-btn>
                </div>
                <div v-else>
                  <v-alert type="warning" variant="tonal">
                    Esta mascota no tiene propietario asignado
                  </v-alert>
                </div>
  
                <!-- Observaciones -->
                <div v-if="paciente.observaciones">
                  <v-divider class="my-4"></v-divider>
                  <h4 class="text-h6 mb-3">Observaciones</h4>
                  <p class="text-body-1">{{ paciente.observaciones }}</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <!-- Card de estado y estadísticas -->
          <v-col cols="12" lg="4">
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-medical-bag</v-icon>
                Estado Médico
              </v-card-title>
              <v-card-text>
                <div class="text-center mb-4">
                  <v-avatar size="80" :color="getColorEspecie(paciente.especie?.nombre)" class="mb-3">
                    <v-icon size="40" color="white">{{ getIconoEspecie(paciente.especie?.nombre) }}</v-icon>
                  </v-avatar>
                  <div class="text-h6 font-weight-bold">{{ paciente.nombre }}</div>
                  <div class="text-caption text-medium-emphasis">ID: {{ paciente.id }}</div>
                </div>
  
                <!-- Estado general -->
                <div class="mb-4">
                  <div class="text-body-2 text-medium-emphasis mb-2">Estado General</div>
                  <v-chip
                    :color="getColorEstado('activo')"
                    variant="tonal"
                    size="large"
                  >
                    <v-icon start>mdi-heart-pulse</v-icon>
                    Activo
                  </v-chip>
                </div>
  
                <!-- Alertas médicas -->
                <div v-if="tieneAlertasMedicas" class="mb-4">
                  <div class="text-body-2 text-medium-emphasis mb-2">Alertas Médicas</div>
                  <div class="d-flex flex-column gap-2">
                    <v-chip
                      v-if="paciente.alergias_conocidas"
                      size="small"
                      color="warning"
                      variant="tonal"
                    >
                      <v-icon start>mdi-alert</v-icon>
                      Alergias conocidas
                    </v-chip>
                    <v-chip
                      v-if="paciente.condiciones_medicas"
                      size="small"
                      color="error"
                      variant="tonal"
                    >
                      <v-icon start>mdi-medical-bag</v-icon>
                      Condiciones médicas
                    </v-chip>
                  </div>
                </div>
  
                <!-- Esterilización -->
                <div class="mb-4">
                  <div class="text-body-2 text-medium-emphasis mb-2">Esterilización</div>
                  <v-chip
                    :color="paciente.esterilizado ? 'success' : 'warning'"
                    variant="tonal"
                  >
                    <v-icon start>{{ paciente.esterilizado ? 'mdi-check' : 'mdi-close' }}</v-icon>
                    {{ paciente.esterilizado ? 'Esterilizado' : 'No esterilizado' }}
                  </v-chip>
                  <div v-if="paciente.esterilizado && paciente.fecha_esterilizacion" class="text-caption mt-1">
                    Fecha: {{ formatearFecha(paciente.fecha_esterilizacion) }}
                  </div>
                </div>
  
                <!-- Botón historial -->
                <v-btn
                  color="primary"
                  variant="outlined"
                  block
                  prepend-icon="mdi-history"
                  @click="verHistorialCompleto"
                >
                  Ver Historial Completo
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Historial médico resumido -->
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-2">mdi-history</v-icon>
                  Historial Médico Reciente
                </div>
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-eye"
                  @click="verHistorialCompleto"
                >
                  Ver Completo
                </v-btn>
              </v-card-title>
              <v-card-text>
                <!-- Loading historial -->
                <div v-if="loadingHistorial" class="text-center py-4">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  <p class="mt-2">Cargando historial...</p>
                </div>
  
                <!-- Historial cargado -->
                <div v-else-if="historial">
                  <!-- Consultas recientes -->
                  <div v-if="historial.consultas && historial.consultas.length > 0" class="mb-6">
                    <h4 class="text-h6 mb-3">Últimas Consultas</h4>
                    <v-row>
                      <v-col
                        v-for="consulta in historial.consultas.slice(0, 3)"
                        :key="consulta.id"
                        cols="12"
                        md="4"
                      >
                        <v-card variant="outlined">
                          <v-card-text>
                            <div class="d-flex justify-space-between align-start mb-2">
                              <div>
                                <div class="font-weight-medium">{{ formatearFecha(consulta.fecha_hora) }}</div>
                                <div class="text-caption text-medium-emphasis">{{ formatearHora(consulta.fecha_hora) }}</div>
                              </div>
                              <v-chip size="x-small" color="primary" variant="tonal">
                                Consulta
                              </v-chip>
                            </div>
                            <div class="mb-2">
                              <div class="text-body-2 font-weight-medium">Motivo:</div>
                              <div class="text-body-2">{{ consulta.motivo_consulta }}</div>
                            </div>
                            <div v-if="consulta.diagnostico_definitivo">
                              <div class="text-body-2 font-weight-medium">Diagnóstico:</div>
                              <div class="text-body-2">{{ consulta.diagnostico_definitivo }}</div>
                            </div>
                            <div v-if="consulta.veterinario" class="mt-2">
                              <div class="text-caption text-medium-emphasis">
                                Dr. {{ consulta.veterinario.user?.nombre }} {{ consulta.veterinario.user?.apellido }}
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
  
                  <!-- Vacunas recientes -->
                  <div v-if="historial.vacunas && historial.vacunas.length > 0" class="mb-6">
                    <h4 class="text-h6 mb-3">Vacunas Recientes</h4>
                    <v-row>
                      <v-col
                        v-for="vacuna in historial.vacunas.slice(0, 3)"
                        :key="vacuna.id"
                        cols="12"
                        md="4"
                      >
                        <v-card variant="outlined">
                          <v-card-text>
                            <div class="d-flex justify-space-between align-start mb-2">
                              <div>
                                <div class="font-weight-medium">{{ vacuna.nombre_vacuna }}</div>
                                <div class="text-caption text-medium-emphasis">{{ formatearFecha(vacuna.fecha_aplicacion) }}</div>
                              </div>
                              <v-chip size="x-small" color="success" variant="tonal">
                                <v-icon start size="12">mdi-needle</v-icon>
                                Vacuna
                              </v-chip>
                            </div>
                            <div v-if="vacuna.laboratorio">
                              <div class="text-body-2">{{ vacuna.laboratorio }}</div>
                            </div>
                            <div v-if="vacuna.proxima_dosis">
                              <div class="text-caption text-medium-emphasis mt-2">
                                Próxima dosis: {{ formatearFecha(vacuna.proxima_dosis) }}
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
  
                  <!-- Fórmulas recientes -->
                  <div v-if="historial.formulas && historial.formulas.length > 0">
                    <h4 class="text-h6 mb-3">Fórmulas Recientes</h4>
                    <v-row>
                      <v-col
                        v-for="formula in historial.formulas.slice(0, 3)"
                        :key="formula.id"
                        cols="12"
                        md="4"
                      >
                        <v-card variant="outlined">
                          <v-card-text>
                            <div class="d-flex justify-space-between align-start mb-2">
                              <div>
                                <div class="font-weight-medium">{{ formula.numero_formula }}</div>
                                <div class="text-caption text-medium-emphasis">{{ formatearFecha(formula.fecha_prescripcion) }}</div>
                              </div>
                              <v-chip size="x-small" color="info" variant="tonal">
                                <v-icon start size="12">mdi-pill</v-icon>
                                Fórmula
                              </v-chip>
                            </div>
                            <div v-if="formula.medicamentos && formula.medicamentos.length > 0">
                              <div class="text-body-2 mb-1">
                                <strong>{{ formula.medicamentos[0].nombre_medicamento }}</strong>
                              </div>
                              <div class="text-caption">{{ formula.medicamentos[0].dosis }} - {{ formula.medicamentos[0].frecuencia }}</div>
                              <div v-if="formula.medicamentos.length > 1" class="text-caption text-medium-emphasis">
                                +{{ formula.medicamentos.length - 1 }} medicamento(s) más
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
  
                  <!-- Sin historial -->
                  <div v-if="!historial.consultas?.length && !historial.vacunas?.length && !historial.formulas?.length">
                    <div class="text-center py-8">
                      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-history</v-icon>
                      <h3 class="text-h6 mb-2">Sin historial médico</h3>
                      <p class="text-body-2 text-medium-emphasis mb-4">
                        Esta mascota aún no tiene consultas, vacunas o fórmulas registradas
                      </p>
                      <v-btn
                        color="primary"
                        prepend-icon="mdi-calendar-plus"
                        @click="agendarCita"
                      >
                        Agendar Primera Consulta
                      </v-btn>
                    </div>
                  </div>
                </div>
  
                <!-- Error al cargar historial -->
                <div v-else-if="errorHistorial">
                  <v-alert type="error" variant="tonal">
                    Error al cargar el historial médico
                  </v-alert>
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
          <div class="font-weight-bold mb-2">Error al cargar el paciente:</div>
          <p>{{ error }}</p>
          <v-btn
            color="error"
            variant="outlined"
            @click="cargarPaciente"
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
  const { showSuccess, showError } = useNotifications()
  
  // Props
  const pacienteId = computed(() => route.params.id)
  
  // Estado local
  const loading = ref(false)
  const loadingHistorial = ref(false)
  const error = ref('')
  const errorHistorial = ref('')
  const paciente = ref(null)
  const historial = ref(null)
  
  // Computadas
  const tieneAlertasMedicas = computed(() => {
    return paciente.value?.alergias_conocidas || paciente.value?.condiciones_medicas
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
      activo: 'success',
      inactivo: 'grey',
      fallecido: 'error'
    }
    return colores[estado] || 'grey'
  }
  
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const formatearHora = (fechaHora) => {
    if (!fechaHora) return ''
    return new Date(fechaHora).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    })
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
  const cargarPaciente = async () => {
    loading.value = true
    error.value = ''
    
    try {
      console.log('Cargando paciente ID:', pacienteId.value)
      
      const response = await api.get(`/pacientes/${pacienteId.value}`)
      
      if (response.data && response.data.data) {
        paciente.value = response.data.data
        console.log('Paciente cargado:', paciente.value)
        
        // Cargar historial después de cargar el paciente
        await cargarHistorial()
      } else {
        error.value = 'Paciente no encontrado'
      }
    } catch (err) {
      console.error('Error al cargar paciente:', err)
      error.value = err.response?.data?.message || 'Error al cargar el paciente'
      showError('Error al cargar el paciente')
    } finally {
      loading.value = false
    }
  }
  
  const cargarHistorial = async () => {
    loadingHistorial.value = true
    errorHistorial.value = ''
    
    try {
      console.log('Cargando historial del paciente:', pacienteId.value)
      
      const response = await api.get(`/pacientes/${pacienteId.value}/historial`)
      
      if (response.data && response.data.data) {
        historial.value = response.data.data
        console.log('Historial cargado:', historial.value)
      }
    } catch (err) {
      console.error('Error al cargar historial:', err)
      errorHistorial.value = err.response?.data?.message || 'Error al cargar el historial'
      // No mostrar error si es 404, simplemente no hay historial
      if (err.response?.status !== 404) {
        showError('Error al cargar el historial médico')
      }
    } finally {
      loadingHistorial.value = false
    }
  }
  
  // Navegación
  const volver = () => {
    router.push('/pacientes')
  }
  
  const editarPaciente = () => {
    router.push(`/pacientes/${pacienteId.value}/editar`)
  }
  
  const verPropietario = () => {
    if (paciente.value?.propietario) {
      router.push(`/propietarios/${paciente.value.propietario.id}`)
    }
  }
  
  const agendarCita = () => {
    router.push(`/citas/nueva?paciente=${pacienteId.value}`)
  }
  
  const verHistorialCompleto = () => {
    router.push(`/pacientes/${pacienteId.value}/historial`)
  }
  
  // Lifecycle
  onMounted(async () => {
    console.log('Componente PacienteDetalleView montado')
    await cargarPaciente()
  })
  </script>
  
  <style scoped>
  .v-list-item {
    min-height: auto !important;
    padding: 8px 0 !important;
  }
  </style>