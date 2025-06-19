// composables/useCitasDisponibilidad.js
import { ref, computed, watch } from 'vue'
import api from '@/api/axios'

export function useCitasDisponibilidad() {
  // Estado reactivo
  const loading = ref(false)
  const error = ref('')
  const disponibilidad = ref(null)
  const horariosDisponibles = ref([])
  const proximasCitas = ref([])

  // Parámetros de búsqueda
  const parametros = ref({
    veterinario_id: null,
    fecha: null,
    duracion: 30
  })

  // Computadas
  const estaDisponible = computed(() => {
    return disponibilidad.value?.disponible || false
  })

  const tieneHorarios = computed(() => {
    return horariosDisponibles.value.length > 0
  })

  const fechaSeleccionada = computed(() => {
    return parametros.value.fecha
  })

  // Métodos principales
  const verificarDisponibilidad = async (veterinarioId, fecha, duracion = 30) => {
    if (!veterinarioId || !fecha) {
      limpiarDisponibilidad()
      return
    }

    loading.value = true
    error.value = ''

    try {
      console.log('Verificando disponibilidad:', { veterinarioId, fecha, duracion })

      const params = {
        veterinario_id: veterinarioId,
        fecha: fecha,
        duracion: duracion
      }

      const response = await api.get('/citas/disponibilidad', { params })
      
      if (response.data && response.data.success) {
        const data = response.data.data
        
        disponibilidad.value = data
        horariosDisponibles.value = data.horarios_disponibles || []
        proximasCitas.value = data.proximas_citas || []

        console.log('Disponibilidad obtenida:', {
          disponible: data.disponible,
          horarios: horariosDisponibles.value.length,
          citas: proximasCitas.value.length
        })
      } else {
        throw new Error(response.data?.message || 'Error en la respuesta')
      }
    } catch (err) {
      console.error('Error al verificar disponibilidad:', err)
      error.value = err.response?.data?.message || 'Error al verificar disponibilidad'
      limpiarDisponibilidad()
    } finally {
      loading.value = false
    }
  }

  const actualizarParametros = (nuevosParametros) => {
    parametros.value = { ...parametros.value, ...nuevosParametros }
  }

  const limpiarDisponibilidad = () => {
    disponibilidad.value = null
    horariosDisponibles.value = []
    proximasCitas.value = []
    error.value = ''
  }

  const reintentar = () => {
    const { veterinario_id, fecha, duracion } = parametros.value
    verificarDisponibilidad(veterinario_id, fecha, duracion)
  }

  // Métodos de utilidad
  const formatearHorario = (horario) => {
    if (!horario) return ''
    
    try {
      const [hora, minutos] = horario.split(':')
      const fecha = new Date()
      fecha.setHours(parseInt(hora), parseInt(minutos), 0, 0)
      
      return fecha.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      return horario
    }
  }

  const esHorarioDisponible = (horario) => {
    return horariosDisponibles.value.includes(horario)
  }

  const obtenerSiguienteHorarioDisponible = () => {
    if (horariosDisponibles.value.length > 0) {
      return horariosDisponibles.value[0]
    }
    return null
  }

  const contarHorariosEnRango = (horaInicio, horaFin) => {
    return horariosDisponibles.value.filter(horario => {
      return horario >= horaInicio && horario <= horaFin
    }).length
  }

  // Agrupar horarios por período del día
  const horariosPorPeriodo = computed(() => {
    const periodos = {
      manana: { titulo: 'Mañana', horarios: [], rango: '06:00-12:00' },
      tarde: { titulo: 'Tarde', horarios: [], rango: '12:00-18:00' },
      noche: { titulo: 'Noche', horarios: [], rango: '18:00-23:59' }
    }

    horariosDisponibles.value.forEach(horario => {
      const [hora] = horario.split(':').map(Number)
      
      if (hora >= 6 && hora < 12) {
        periodos.manana.horarios.push(horario)
      } else if (hora >= 12 && hora < 18) {
        periodos.tarde.horarios.push(horario)
      } else {
        periodos.noche.horarios.push(horario)
      }
    })

    // Filtrar períodos que tienen horarios
    return Object.entries(periodos)
      .filter(([_, periodo]) => periodo.horarios.length > 0)
      .map(([key, periodo]) => ({ key, ...periodo }))
  })

  // Watch para cambios automáticos
  watch(
    () => [parametros.value.veterinario_id, parametros.value.fecha, parametros.value.duracion],
    ([veterinarioId, fecha, duracion]) => {
      if (veterinarioId && fecha) {
        verificarDisponibilidad(veterinarioId, fecha, duracion)
      } else {
        limpiarDisponibilidad()
      }
    },
    { deep: true }
  )

  return {
    // Estado
    loading,
    error,
    disponibilidad,
    horariosDisponibles,
    proximasCitas,
    parametros,

    // Computadas
    estaDisponible,
    tieneHorarios,
    fechaSeleccionada,
    horariosPorPeriodo,

    // Métodos
    verificarDisponibilidad,
    actualizarParametros,
    limpiarDisponibilidad,
    reintentar,

    // Utilidades
    formatearHorario,
    esHorarioDisponible,
    obtenerSiguienteHorarioDisponible,
    contarHorariosEnRango
  }
}