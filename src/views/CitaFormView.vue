<template>
    <v-container fluid>
      <!-- Header -->
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
              <v-icon size="large" class="mr-2">
                {{ esEdicion ? 'mdi-pencil' : esReprogramacion ? 'mdi-calendar-edit' : 'mdi-plus' }}
              </v-icon>
              {{ tituloFormulario }}
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              {{ subtituloFormulario }}
            </p>
          </div>
          
          <!-- Indicador de modo -->
          <v-chip
            :color="colorModo"
            variant="tonal"
            size="large"
          >
            {{ modoTexto }}
          </v-chip>
        </v-col>
      </v-row>
  
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          color="primary"
          size="64"
          indeterminate
        ></v-progress-circular>
        <p class="text-body-1 mt-4">{{ loadingMessage }}</p>
      </div>
  
      <!-- Formulario -->
      <v-form 
        v-else
        ref="formulario" 
        @submit.prevent="guardarCita"
        :disabled="guardando"
      >
        <v-row>
          <!-- Columna principal del formulario -->
          <v-col cols="12" lg="8">
            <!-- Información básica -->
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-information</v-icon>
                Información Básica
              </v-card-title>
              <v-card-text>
                <v-row>
                  <!-- Selección de paciente -->
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="cita.paciente_id"
                      :items="pacientes"
                      :loading="loadingPacientes"
                      item-title="nombre_completo"
                      item-value="id"
                      label="Paciente *"
                      placeholder="Buscar mascota..."
                      prepend-inner-icon="mdi-paw"
                      :rules="[v => !!v || 'Seleccione un paciente']"
                      @update:search="buscarPacientes"
                      @update:model-value="onPacienteChange"
                      clearable
                      required
                    >
                      <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template #prepend>
                            <v-avatar 
                              size="32" 
                              :color="getColorEspecie(item.raw.especie)"
                            >
                              <v-icon color="white" size="16">
                                {{ getIconoEspecie(item.raw.especie) }}
                              </v-icon>
                            </v-avatar>
                          </template>
                          <v-list-item-title>{{ item.raw.nombre }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ item.raw.especie }} - {{ item.raw.propietario }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
  
                  <!-- Selección de veterinario -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="cita.veterinario_id"
                      :items="veterinarios"
                      :loading="loadingVeterinarios"
                      item-title="nombre_completo"
                      item-value="id"
                      label="Veterinario *"
                      prepend-inner-icon="mdi-doctor"
                      :rules="[v => !!v || 'Seleccione un veterinario']"
                      @update:model-value="onVeterinarioChange"
                      required
                    >
                      <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template #prepend>
                            <v-avatar size="32" color="success">
                              <v-icon color="white" size="16">mdi-doctor</v-icon>
                            </v-avatar>
                          </template>
                          <v-list-item-title>{{ item.raw.nombre_completo }}</v-list-item-title>
                          <v-list-item-subtitle>{{ item.raw.especialidad }}</v-list-item-subtitle>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
  
                  <!-- Tipo de cita -->
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="cita.tipo_cita"
                      :items="tiposCita"
                      label="Tipo de Cita *"
                      prepend-inner-icon="mdi-medical-bag"
                      :rules="[v => !!v || 'Seleccione el tipo de cita']"
                      @update:model-value="onTipoCitaChange"
                      required
                    ></v-select>
                  </v-col>
  
                  <!-- Prioridad -->
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="cita.prioridad"
                      :items="prioridades"
                      label="Prioridad"
                      prepend-inner-icon="mdi-flag"
                    >
                      <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template #prepend>
                            <v-chip 
                              size="small" 
                              :color="getColorPrioridad(item.value)"
                            >
                              {{ item.title }}
                            </v-chip>
                          </template>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
  
                  <!-- Duración estimada -->
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="cita.duracion_estimada"
                      :items="duraciones"
                      label="Duración Estimada"
                      prepend-inner-icon="mdi-clock"
                      suffix="minutos"
                    ></v-select>
                  </v-col>
  
                  <!-- Motivo -->
                  <v-col cols="12">
                    <v-textarea
                      v-model="cita.motivo"
                      label="Motivo de la Consulta *"
                      prepend-inner-icon="mdi-text"
                      :rules="[v => !!v || 'Ingrese el motivo de la consulta']"
                      rows="3"
                      auto-grow
                      required
                    ></v-textarea>
                  </v-col>
  
                  <!-- Observaciones -->
                  <v-col cols="12">
                    <v-textarea
                      v-model="cita.observaciones"
                      label="Observaciones Adicionales"
                      prepend-inner-icon="mdi-note-text"
                      rows="2"
                      auto-grow
                      placeholder="Información adicional, instrucciones especiales, etc."
                    ></v-textarea>
                  </v-col>
  
                  <!-- Requiere ayuno -->
                  <v-col cols="12">
                    <v-checkbox
                      v-model="cita.requiere_ayuno"
                      label="El paciente debe venir en ayunas"
                      color="warning"
                    >
                      <template #label>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2" color="warning">mdi-food-off</v-icon>
                          <span>El paciente debe venir en ayunas</span>
                        </div>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
  
            <!-- Fecha y hora -->
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                Programación
              </v-card-title>
              <v-card-text>
                <v-row>
                  <!-- Fecha -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="fechaSeleccionada"
                      type="date"
                      label="Fecha de la Cita *"
                      prepend-inner-icon="mdi-calendar"
                      :rules="[v => !!v || 'Seleccione una fecha']"
                      :min="fechaMinima"
                      @update:model-value="onFechaChange"
                      required
                    ></v-text-field>
                  </v-col>
  
                  <!-- Hora -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="horaSeleccionada"
                      :items="horariosDisponibles"
                      :loading="verificandoDisponibilidad"
                      label="Hora Disponible *"
                      prepend-inner-icon="mdi-clock"
                      :rules="[v => !!v || 'Seleccione una hora']"
                      :disabled="!fechaSeleccionada || !cita.veterinario_id"
                      @update:model-value="onHoraChange"
                      required
                    >
                      <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template #prepend>
                            <v-icon color="success">mdi-check-circle</v-icon>
                          </template>
                          <v-list-item-title>{{ item.title }}</v-list-item-title>
                          <v-list-item-subtitle>Disponible</v-list-item-subtitle>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
  
                <!-- Información de disponibilidad -->
                <div v-if="fechaSeleccionada && cita.veterinario_id">
                  <v-divider class="my-4"></v-divider>
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-2" color="info">mdi-information</v-icon>
                    <span class="text-body-2 font-weight-medium">
                      Disponibilidad para {{ fechaFormateada }}
                    </span>
                  </div>
                  
                  <div v-if="verificandoDisponibilidad" class="text-center py-4">
                    <v-progress-circular size="24" indeterminate color="primary"></v-progress-circular>
                    <span class="ml-2">Verificando disponibilidad...</span>
                  </div>
                  
                  <div v-else-if="horariosDisponibles.length === 0" class="text-center py-4">
                    <v-alert type="warning" variant="tonal">
                      <div class="d-flex align-center">
                        <v-icon class="mr-2">mdi-calendar-remove</v-icon>
                        <div>
                          <strong>No hay horarios disponibles</strong>
                          <div class="text-body-2">
                            Seleccione otra fecha o veterinario
                          </div>
                        </div>
                      </div>
                    </v-alert>
                  </div>
                  
                  <div v-else>
                    <v-chip-group>
                      <v-chip
                        v-for="horario in horariosDisponibles.slice(0, 5)"
                        :key="horario.value"
                        size="small"
                        color="success"
                        variant="tonal"
                      >
                        {{ horario.title }}
                      </v-chip>
                      <v-chip
                        v-if="horariosDisponibles.length > 5"
                        size="small"
                        variant="outlined"
                      >
                        +{{ horariosDisponibles.length - 5 }} más
                      </v-chip>
                    </v-chip-group>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
  
          <!-- Panel lateral -->
          <v-col cols="12" lg="4">
            <!-- Información del paciente seleccionado -->
            <v-card v-if="pacienteSeleccionado" class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-paw</v-icon>
                Paciente Seleccionado
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center mb-3">
                  <v-avatar 
                    size="48" 
                    :color="getColorEspecie(pacienteSeleccionado.especie)" 
                    class="mr-3"
                  >
                    <v-icon color="white">{{ getIconoEspecie(pacienteSeleccionado.especie) }}</v-icon>
                  </v-avatar>
                  <div>
                    <h4 class="text-h6 font-weight-medium">{{ pacienteSeleccionado.nombre }}</h4>
                    <p class="text-body-2 text-medium-emphasis mb-0">
                      {{ pacienteSeleccionado.especie }} - {{ pacienteSeleccionado.raza }}
                    </p>
                  </div>
                </div>
                <div class="mb-2">
                  <strong>Propietario:</strong> {{ pacienteSeleccionado.propietario }}
                </div>
                <div class="mb-2">
                  <strong>Teléfono:</strong> {{ pacienteSeleccionado.telefono }}
                </div>
                <v-btn
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-eye"
                  @click="verPaciente"
                  block
                >
                  Ver Perfil Completo
                </v-btn>
              </v-card-text>
            </v-card>
  
            <!-- Resumen de la cita -->
            <v-card class="mb-4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-clipboard-check</v-icon>
                Resumen de la Cita
              </v-card-title>
              <v-card-text>
                <div class="mb-3">
                  <div class="text-body-2 text-medium-emphasis">Paciente</div>
                  <div class="font-weight-medium">
                    {{ pacienteSeleccionado?.nombre || 'No seleccionado' }}
                  </div>
                </div>
                <div class="mb-3">
                  <div class="text-body-2 text-medium-emphasis">Veterinario</div>
                  <div class="font-weight-medium">
                    {{ veterinarioSeleccionado?.nombre_completo || 'No seleccionado' }}
                  </div>
                </div>
                <div class="mb-3">
                  <div class="text-body-2 text-medium-emphasis">Fecha y Hora</div>
                  <div class="font-weight-medium">
                    {{ fechaHoraFormateada || 'No programada' }}
                  </div>
                </div>
                <div class="mb-3">
                  <div class="text-body-2 text-medium-emphasis">Tipo</div>
                  <div class="font-weight-medium">
                    {{ cita.tipo_cita || 'No especificado' }}
                  </div>
                </div>
                <div class="mb-3">
                  <div class="text-body-2 text-medium-emphasis">Duración</div>
                  <div class="font-weight-medium">
                    {{ cita.duracion_estimada }} minutos
                  </div>
                </div>
                <div v-if="cita.requiere_ayuno" class="mb-3">
                  <v-chip size="small" color="warning" variant="tonal">
                    <v-icon start size="12">mdi-food-off</v-icon>
                    Requiere ayuno
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
  
            <!-- Acciones -->
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
                Acciones
              </v-card-title>
              <v-card-text>
                <div class="d-flex flex-column gap-2">
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    :loading="guardando"
                    :disabled="!formularioValido"
                    block
                  >
                    <v-icon start>{{ iconoAccion }}</v-icon>
                    {{ textoBotonPrincipal }}
                  </v-btn>
                  
                  <v-btn
                    variant="outlined"
                    @click="volver"
                    :disabled="guardando"
                    block
                  >
                    Cancelar
                  </v-btn>
  
                  <v-divider class="my-2"></v-divider>
  
                  <v-btn
                    v-if="cita.veterinario_id && fechaSeleccionada"
                    variant="text"
                    prepend-icon="mdi-calendar-search"
                    @click="verificarDisponibilidad"
                    :loading="verificandoDisponibilidad"
                    size="small"
                    block
                  >
                    Verificar Disponibilidad
                  </v-btn>
  
                  <v-btn
                    variant="text"
                    prepend-icon="mdi-refresh"
                    @click="limpiarFormulario"
                    :disabled="guardando"
                    size="small"
                    block
                  >
                    Limpiar Formulario
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
  
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
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotifications } from '@/composables/useNotifications'
  import api from '@/api/axios'
  
  const route = useRoute()
  const router = useRouter()
  const { showSuccess, showError } = useNotifications()
  
  // Detectar modo del formulario
  const citaId = computed(() => route.params.id)
  const esEdicion = computed(() => !!citaId.value)
  const esReprogramacion = computed(() => route.query.reprogramar === 'true')
  const pacientePreseleccionado = computed(() => route.query.paciente)
  
  // Estado del formulario
  const formulario = ref(null)
  const loading = ref(false)
  const guardando = ref(false)
  const error = ref('')
  const mostrarError = ref(false)
  const loadingMessage = ref('Cargando...')
  
  // Datos del formulario
  const cita = ref({
    paciente_id: null,
    veterinario_id: null,
    fecha_hora: '',
    duracion_estimada: 30,
    tipo_cita: 'consulta_general',
    prioridad: 'normal',
    motivo: '',
    observaciones: '',
    requiere_ayuno: false
  })
  
  // Fecha y hora separadas para mejor UX
  const fechaSeleccionada = ref('')
  const horaSeleccionada = ref('')
  
  // Datos de listas
  const pacientes = ref([])
  const veterinarios = ref([])
  const horariosDisponibles = ref([])
  
  // Loading states
  const loadingPacientes = ref(false)
  const loadingVeterinarios = ref(false)
  const verificandoDisponibilidad = ref(false)
  
  // Opciones para selects
  const tiposCita = [
    { title: 'Consulta', value: 'consulta_general' },
    { title: 'Emergencia', value: 'emergencia' },
    { title: 'Control', value: 'control' },
    { title: 'Cirugía', value: 'cirugia' },
    { title: 'Vacunación', value: 'vacunacion' }
  ]
  
  const prioridades = [
    { title: 'Normal', value: 'normal' },
    { title: 'Media', value: 'media' },
    { title: 'Alta', value: 'alta' }
  ]
  
  const duraciones = [
    { title: '15 minutos', value: 15 },
    { title: '30 minutos', value: 30 },
    { title: '45 minutos', value: 45 },
    { title: '60 minutos', value: 60 },
    { title: '90 minutos', value: 90 },
    { title: '120 minutos', value: 120 }
  ]
  
  // Computadas
  const tituloFormulario = computed(() => {
    if (esReprogramacion.value) return 'Reprogramar Cita'
    if (esEdicion.value) return 'Editar Cita'
    return 'Nueva Cita Médica'
  })
  
  const subtituloFormulario = computed(() => {
    if (esReprogramacion.value) return 'Seleccione nueva fecha y hora para la cita'
    if (esEdicion.value) return 'Modifique los datos de la cita médica'
    return 'Complete la información para programar una nueva cita'
  })
  
  const modoTexto = computed(() => {
    if (esReprogramacion.value) return 'Reprogramar'
    if (esEdicion.value) return 'Editar'
    return 'Nueva Cita'
  })
  
  const colorModo = computed(() => {
    if (esReprogramacion.value) return 'warning'
    if (esEdicion.value) return 'info'
    return 'success'
  })
  
  const textoBotonPrincipal = computed(() => {
    if (esReprogramacion.value) return 'Reprogramar Cita'
    if (esEdicion.value) return 'Actualizar Cita'
    return 'Crear Cita'
  })
  
  const iconoAccion = computed(() => {
    if (esReprogramacion.value) return 'mdi-calendar-edit'
    if (esEdicion.value) return 'mdi-content-save'
    return 'mdi-plus'
  })
  
  const fechaMinima = computed(() => {
    return new Date().toISOString().split('T')[0]
  })
  
  const fechaFormateada = computed(() => {
    if (!fechaSeleccionada.value) return ''
    return new Date(fechaSeleccionada.value).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })
  
  const fechaHoraFormateada = computed(() => {
    if (!fechaSeleccionada.value || !horaSeleccionada.value) return ''
    const fecha = new Date(`${fechaSeleccionada.value}T${horaSeleccionada.value}`)
    return fecha.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  })
  
  const pacienteSeleccionado = computed(() => {
    return pacientes.value.find(p => p.id === cita.value.paciente_id)
  })
  
  const veterinarioSeleccionado = computed(() => {
    return veterinarios.value.find(v => v.id === cita.value.veterinario_id)
  })
  
  const formularioValido = computed(() => {
    return cita.value.paciente_id && 
           cita.value.veterinario_id && 
           fechaSeleccionada.value && 
           horaSeleccionada.value && 
           cita.value.motivo &&
           cita.value.tipo_cita
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
  
  const getColorPrioridad = (prioridad) => {
    const colores = {
      alta: 'error',
      media: 'warning',
      normal: 'success'
    }
    return colores[prioridad] || 'grey'
  }
  
  // Métodos para cargar datos
  const cargarPacientes = async (busqueda = '') => {
    loadingPacientes.value = true
    try {
      const params = busqueda ? { q: busqueda } : {}
      const response = await api.get('/pacientes', { params })
      
      if (response.data && response.data.data) {
        pacientes.value = response.data.data.map(paciente => ({
          id: paciente.id,
          nombre: paciente.nombre,
          nombre_completo: `${paciente.nombre} (${paciente.propietario?.user?.nombre} ${paciente.propietario?.user?.apellido})`,
          especie: paciente.especie?.nombre,
          raza: paciente.raza?.nombre,
          propietario: `${paciente.propietario?.user?.nombre} ${paciente.propietario?.user?.apellido}`,
          telefono: paciente.propietario?.user?.telefono
        }))
      }
    } catch (err) {
      console.error('Error al cargar pacientes:', err)
    } finally {
      loadingPacientes.value = false
    }
  }
  
  const cargarVeterinarios = async () => {
    loadingVeterinarios.value = true
    try {
      const response = await api.get('/veterinarios')
      
      if (response.data && response.data.data) {
        veterinarios.value = response.data.data.map(vet => ({
          id: vet.id,
          nombre_completo: `Dr. ${vet.user?.nombre} ${vet.user?.apellido}`,
          especialidad: vet.especialidad || 'Medicina General'
        }))
      }
    } catch (err) {
      console.error('Error al cargar veterinarios:', err)
    } finally {
      loadingVeterinarios.value = false
    }
  }
  
  const cargarCitaExistente = async () => {
    if (!citaId.value) return
    
    loading.value = true
    loadingMessage.value = 'Cargando datos de la cita...'
    
    try {
      const response = await api.get(`/citas/${citaId.value}`)
      
      if (response.data && response.data.data) {
        const citaData = response.data.data.cita
        
        // Cargar datos básicos
        cita.value = {
          paciente_id: citaData.paciente?.id,
          veterinario_id: citaData.veterinario?.id,
          duracion_estimada: citaData.duracion_estimada,
          tipo_cita: citaData.tipo_cita,
          prioridad: citaData.prioridad,
          motivo: citaData.motivo,
          observaciones: citaData.observaciones,
          requiere_ayuno: citaData.requiere_ayuno
        }
        
        // Separar fecha y hora
        const fechaHora = new Date(citaData.fecha_hora)
        fechaSeleccionada.value = fechaHora.toISOString().split('T')[0]
        horaSeleccionada.value = fechaHora.toTimeString().slice(0, 5)
        
        console.log('Cita cargada para edición:', cita.value)
      }
    } catch (err) {
      console.error('Error al cargar cita:', err)
      error.value = 'Error al cargar los datos de la cita'
      mostrarError.value = true
    } finally {
      loading.value = false
    }
  }
  
  const verificarDisponibilidad = async () => {
    if (!cita.value.veterinario_id || !fechaSeleccionada.value) return
    
    verificandoDisponibilidad.value = true
    try {
      const response = await api.get('/citas/disponibilidad', {
        params: {
          veterinario_id: cita.value.veterinario_id,
          fecha: fechaSeleccionada.value,
          duracion: cita.value.duracion_estimada
        }
      })
      
      if (response.data && response.data.data) {
        const horarios = response.data.data.horarios_disponibles || []
        horariosDisponibles.value = horarios.map(hora => ({
          title: hora,
          value: hora
        }))
      }
    } catch (err) {
      console.error('Error al verificar disponibilidad:', err)
      horariosDisponibles.value = []
    } finally {
      verificandoDisponibilidad.value = false
    }
  }
  
  // Eventos del formulario
  const buscarPacientes = (busqueda) => {
    if (busqueda && busqueda.length > 2) {
      cargarPacientes(busqueda)
    }
  }
  
  const onPacienteChange = () => {
    console.log('Paciente seleccionado:', pacienteSeleccionado.value)
  }
  
  const onVeterinarioChange = () => {
    horaSeleccionada.value = ''
    if (fechaSeleccionada.value) {
      verificarDisponibilidad()
    }
  }
  
  const onTipoCitaChange = () => {
    // Ajustar duración según tipo de cita
    const duracionesPorTipo = {
      consulta: 30,
      emergencia: 60,
      control: 20,
      cirugia: 120,
      vacunacion: 15
    }
    
    if (duracionesPorTipo[cita.value.tipo_cita]) {
      cita.value.duracion_estimada = duracionesPorTipo[cita.value.tipo_cita]
    }
  }
  
  const onFechaChange = () => {
    horaSeleccionada.value = ''
    if (cita.value.veterinario_id) {
      verificarDisponibilidad()
    }
  }
  
  const onHoraChange = () => {
    // Construir fecha_hora completa
    if (fechaSeleccionada.value && horaSeleccionada.value) {
      cita.value.fecha_hora = `${fechaSeleccionada.value} ${horaSeleccionada.value}:00`
    }
  }
  
  // Acciones principales
  const guardarCita = async () => {
    const isValid = await formulario.value.validate()
    if (!isValid.valid) return
    
    guardando.value = true
    
    try {
      let response
      
      if (esReprogramacion.value) {
        // Reprogramar cita existente
        response = await api.post(`/citas/${citaId.value}/reprogramar`, {
          nueva_fecha_hora: cita.value.fecha_hora,
          motivo_reprogramacion: 'Reprogramación solicitada por el usuario'
        })
      } else if (esEdicion.value) {
        // Actualizar cita existente
        response = await api.put(`/citas/${citaId.value}`, cita.value)
      } else {
        // Crear nueva cita
        response = await api.post('/citas', cita.value)
      }
      
      if (response.data.success) {
        const mensaje = esReprogramacion.value ? 'Cita reprogramada exitosamente' :
                        esEdicion.value ? 'Cita actualizada exitosamente' :
                        'Cita creada exitosamente'
        
        showSuccess(mensaje)
        
        // Redirigir al detalle de la cita
        const citaResultado = response.data.data.cita || response.data.data
        router.push(`/citas/${citaResultado.id || citaId.value}`)
      } else {
        showError(response.data.message || 'Error al guardar la cita')
      }
    } catch (err) {
      console.error('Error al guardar cita:', err)
      const mensaje = err.response?.data?.message || 'Error al guardar la cita'
      showError(mensaje)
    } finally {
      guardando.value = false
    }
  }
  
  const limpiarFormulario = () => {
    cita.value = {
      paciente_id: null,
      veterinario_id: null,
      fecha_hora: '',
      duracion_estimada: 30,
      tipo_cita: 'consulta_general',
      prioridad: 'normal',
      motivo: '',
      observaciones: '',
      requiere_ayuno: false
    }
    
    fechaSeleccionada.value = ''
    horaSeleccionada.value = ''
    horariosDisponibles.value = []
    
    formulario.value?.resetValidation()
  }
  
  const verPaciente = () => {
    if (pacienteSeleccionado.value) {
      router.push(`/pacientes/${pacienteSeleccionado.value.id}`)
    }
  }
  
  const volver = () => {
    router.push('/citas')
  }
  
  // Watchers
  watch([fechaSeleccionada, () => cita.value.veterinario_id, () => cita.value.duracion_estimada], () => {
    if (fechaSeleccionada.value && cita.value.veterinario_id) {
      verificarDisponibilidad()
    }
  })
  
  // Lifecycle
  onMounted(async () => {
    console.log('Formulario de cita montado')
    console.log('Modo:', esEdicion.value ? 'Edición' : esReprogramacion.value ? 'Reprogramación' : 'Nueva')
    
    await Promise.all([
      cargarPacientes(),
      cargarVeterinarios()
    ])
    
    // Preseleccionar paciente si viene de URL
    if (pacientePreseleccionado.value) {
      cita.value.paciente_id = parseInt(pacientePreseleccionado.value)
    }
    
    // Cargar datos si es edición
    if (esEdicion.value) {
      await cargarCitaExistente()
    }
  })
  </script>
  
  <style scoped>
  .v-form {
    max-width: none;
  }
  
  .v-card-text {
    padding: 16px 24px !important;
  }
  
  .v-autocomplete .v-field__input {
    min-height: 56px;
  }
  </style>