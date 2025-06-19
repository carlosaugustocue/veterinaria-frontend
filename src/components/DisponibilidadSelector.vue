<template>
    <div class="disponibilidad-selector">
      <!-- Header con información -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h3 class="text-h6 font-weight-medium">
            <v-icon class="mr-2">mdi-clock-check</v-icon>
            Horarios Disponibles
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-0" v-if="veterinarioSeleccionado && fechaSeleccionada">
            {{ veterinarioSeleccionado }} - {{ formatearFecha(fechaSeleccionada) }}
          </p>
        </div>
        
        <!-- Información de duración -->
        <v-chip
          v-if="duracion"
          color="primary"
          variant="tonal"
          size="small"
        >
          {{ duracion }} min
        </v-chip>
      </div>
  
      <!-- Estados de carga y error -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          color="primary"
          size="48"
          indeterminate
          class="mb-3"
        ></v-progress-circular>
        <p class="text-body-2 text-medium-emphasis">
          Verificando disponibilidad...
        </p>
      </div>
  
      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="font-weight-medium">Error al verificar disponibilidad</div>
            <div class="text-body-2">{{ error }}</div>
          </div>
          <v-btn
            size="small"
            variant="outlined"
            @click="reintentar"
          >
            Reintentar
          </v-btn>
        </div>
      </v-alert>
  
      <!-- Sin parámetros necesarios -->
      <v-alert
        v-else-if="!veterinarioId || !fecha"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-information</v-icon>
          <div>
            Selecciona un veterinario y fecha para ver los horarios disponibles
          </div>
        </div>
      </v-alert>
  
      <!-- No hay horarios disponibles -->
      <v-alert
        v-else-if="!tieneHorarios"
        type="warning"
        variant="tonal"
        class="mb-4"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-calendar-remove</v-icon>
          <div>
            <div class="font-weight-medium">No hay horarios disponibles</div>
            <div class="text-body-2">
              No se encontraron horarios libres para la fecha y veterinario seleccionados.
              Intenta con otra fecha o veterinario.
            </div>
          </div>
        </div>
      </v-alert>
  
      <!-- Horarios disponibles agrupados por período -->
      <div v-else-if="tieneHorarios">
        <!-- Información general -->
        <v-alert
          type="success"
          variant="tonal"
          class="mb-4"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-check-circle</v-icon>
            <div>
              <div class="font-weight-medium">{{ horariosDisponibles.length }} horarios disponibles</div>
              <div class="text-body-2">Selecciona el horario que prefieras para tu cita</div>
            </div>
          </div>
        </v-alert>
  
        <!-- Horarios agrupados por período del día -->
        <div
          v-for="periodo in horariosPorPeriodo"
          :key="periodo.key"
          class="mb-4"
        >
          <div class="d-flex align-center mb-3">
            <v-icon class="mr-2" :color="getColorPeriodo(periodo.key)">
              {{ getIconoPeriodo(periodo.key) }}
            </v-icon>
            <h4 class="text-subtitle-1 font-weight-medium">
              {{ periodo.titulo }}
            </h4>
            <v-chip
              size="x-small"
              variant="outlined"
              class="ml-2"
            >
              {{ periodo.horarios.length }} disponibles
            </v-chip>
          </div>
  
          <!-- Grid de horarios -->
          <div class="horarios-grid">
            <v-btn
              v-for="horario in periodo.horarios"
              :key="horario"
              :variant="horarioSeleccionado === horario ? 'flat' : 'outlined'"
              :color="horarioSeleccionado === horario ? 'primary' : 'default'"
              size="large"
              class="horario-btn"
              @click="seleccionarHorario(horario)"
            >
              <div class="text-center">
                <div class="text-h6 font-weight-bold">
                  {{ formatearHorario(horario) }}
                </div>
                <div class="text-caption" v-if="horarioSeleccionado === horario">
                  Seleccionado
                </div>
              </div>
            </v-btn>
          </div>
        </div>
  
        <!-- Horario seleccionado destacado -->
        <v-card
          v-if="horarioSeleccionado"
          color="primary"
          variant="tonal"
          class="mt-4"
        >
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon class="mr-3" size="large">mdi-calendar-check</v-icon>
              <div>
                <div class="text-h6 font-weight-bold">
                  Horario Seleccionado
                </div>
                <div class="text-body-1">
                  {{ formatearFecha(fecha) }} a las {{ formatearHorario(horarioSeleccionado) }}
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Duración estimada: {{ duracion }} minutos
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="limpiarSeleccion"
              ></v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
  
      <!-- Próximas citas (información adicional) -->
      <div v-if="proximasCitas.length > 0 && mostrarProximasCitas" class="mt-6">
        <v-divider class="mb-4"></v-divider>
        
        <div class="d-flex align-center justify-space-between mb-3">
          <h4 class="text-subtitle-1 font-weight-medium">
            <v-icon class="mr-2">mdi-calendar-clock</v-icon>
            Próximas Citas del Veterinario
          </h4>
          <v-btn
            size="small"
            variant="text"
            @click="mostrarProximasCitas = false"
          >
            Ocultar
          </v-btn>
        </div>
  
        <v-list density="compact">
          <v-list-item
            v-for="(cita, index) in proximasCitas.slice(0, 3)"
            :key="index"
            class="px-0"
          >
            <template #prepend>
              <v-icon size="small">mdi-clock</v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              {{ formatearHorario(cita.hora) }} - {{ cita.paciente || 'Cita programada' }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
  
      <!-- Botón para mostrar próximas citas -->
      <div v-else-if="proximasCitas.length > 0 && !mostrarProximasCitas" class="mt-4">
        <v-btn
          variant="outlined"
          size="small"
          prepend-icon="mdi-information"
          @click="mostrarProximasCitas = true"
        >
          Ver próximas citas ({{ proximasCitas.length }})
        </v-btn>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useCitasDisponibilidad } from '@/composables/useCitasDisponibilidad'
  
  // Props
  const props = defineProps({
    veterinarioId: {
      type: [Number, String],
      default: null
    },
    fecha: {
      type: String,
      default: null
    },
    duracion: {
      type: Number,
      default: 30
    },
    veterinarioNombre: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: null
    },
    autoVerificar: {
      type: Boolean,
      default: true
    }
  })
  
  // Emits
  const emit = defineEmits(['update:modelValue', 'horario-seleccionado', 'error'])
  
  // Composable
  const {
    loading,
    error,
    horariosDisponibles,
    proximasCitas,
    tieneHorarios,
    horariosPorPeriodo,
    formatearHorario,
    actualizarParametros,
    reintentar
  } = useCitasDisponibilidad()
  
  // Estado local
  const mostrarProximasCitas = ref(false)
  const horarioSeleccionado = ref(props.modelValue)
  
  // Computadas
  const veterinarioSeleccionado = computed(() => {
    return props.veterinarioNombre || `Veterinario #${props.veterinarioId}`
  })
  
  const fechaSeleccionada = computed(() => {
    return props.fecha
  })
  
  // Métodos de utilidad
  const getColorPeriodo = (periodo) => {
    const colores = {
      manana: 'orange',
      tarde: 'blue',
      noche: 'purple'
    }
    return colores[periodo] || 'grey'
  }
  
  const getIconoPeriodo = (periodo) => {
    const iconos = {
      manana: 'mdi-weather-sunny',
      tarde: 'mdi-weather-partly-cloudy',
      noche: 'mdi-weather-night'
    }
    return iconos[periodo] || 'mdi-clock'
  }
  
  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Métodos principales
  const seleccionarHorario = (horario) => {
    horarioSeleccionado.value = horario
    emit('update:modelValue', horario)
    emit('horario-seleccionado', {
      horario,
      fecha: props.fecha,
      veterinarioId: props.veterinarioId,
      duracion: props.duracion
    })
  }
  
  const limpiarSeleccion = () => {
    horarioSeleccionado.value = null
    emit('update:modelValue', null)
    emit('horario-seleccionado', null)
  }
  
  // Watchers
  watch(
    () => [props.veterinarioId, props.fecha, props.duracion],
    ([veterinarioId, fecha, duracion]) => {
      if (props.autoVerificar) {
        actualizarParametros({
          veterinario_id: veterinarioId,
          fecha: fecha,
          duracion: duracion
        })
      }
      
      // Limpiar selección si cambian los parámetros
      if (horarioSeleccionado.value) {
        limpiarSeleccion()
      }
    },
    { immediate: true }
  )
  
  watch(() => props.modelValue, (newValue) => {
    horarioSeleccionado.value = newValue
  })
  
  watch(error, (newError) => {
    if (newError) {
      emit('error', newError)
    }
  })
  
  // Lifecycle
  onMounted(() => {
    if (props.autoVerificar && props.veterinarioId && props.fecha) {
      actualizarParametros({
        veterinario_id: props.veterinarioId,
        fecha: props.fecha,
        duracion: props.duracion
      })
    }
  })
  </script>
  
  <style scoped>
  .disponibilidad-selector {
    width: 100%;
  }
  
  .horarios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .horario-btn {
    aspect-ratio: 1;
    min-height: 80px !important;
    padding: 8px !important;
  }
  
  .horario-btn .v-btn__content {
    flex-direction: column;
    height: 100%;
    justify-content: center;
  }
  
  @media (max-width: 600px) {
    .horarios-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px;
    }
    
    .horario-btn {
      min-height: 70px !important;
    }
  }
  </style>