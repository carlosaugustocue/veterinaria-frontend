<template>
    <v-container fluid>
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center mb-2">
            <v-btn
              icon
              variant="text"
              @click="$router.back()"
              class="mr-2"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div>
              <h1 class="text-h4 font-weight-bold">
                {{ esEdicion ? 'Editar Propietario' : 'Nuevo Propietario' }}
              </h1>
              <v-breadcrumbs
                :items="breadcrumbs"
                density="compact"
                class="pa-0"
              ></v-breadcrumbs>
            </div>
          </div>
        </v-col>
      </v-row>
  
      <!-- Formulario -->
      <v-form ref="formulario" v-model="valido" @submit.prevent="guardarPropietario">
        <v-row>
          <!-- Información del Usuario -->
          <v-col cols="12" lg="6">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-account</v-icon>
                Información Personal
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.usuario.nombre"
                      label="Nombre *"
                      prepend-inner-icon="mdi-account"
                      :rules="reglasNombre"
                      :error-messages="errores.nombre"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.usuario.apellido"
                      label="Apellido *"
                      prepend-inner-icon="mdi-account"
                      :rules="reglasNombre"
                      :error-messages="errores.apellido"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.usuario.cedula"
                      label="Cédula *"
                      prepend-inner-icon="mdi-card-account-details"
                      :rules="reglasCedula"
                      :error-messages="errores.cedula"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="form.usuario.sexo"
                      label="Sexo *"
                      :items="opcionesSexo"
                      prepend-inner-icon="mdi-human-male-female"
                      :rules="reglasRequerido"
                      :error-messages="errores.sexo"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.usuario.fecha_nacimiento"
                      label="Fecha de Nacimiento *"
                      type="date"
                      prepend-inner-icon="mdi-calendar"
                      :rules="reglasRequerido"
                      :error-messages="errores.fecha_nacimiento"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.usuario.telefono"
                      label="Teléfono *"
                      prepend-inner-icon="mdi-phone"
                      :rules="reglasTelefono"
                      :error-messages="errores.telefono"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.usuario.email"
                      label="Correo Electrónico *"
                      type="email"
                      prepend-inner-icon="mdi-email"
                      :rules="reglasEmail"
                      :error-messages="errores.email"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.usuario.direccion"
                      label="Dirección *"
                      prepend-inner-icon="mdi-map-marker"
                      :rules="reglasRequerido"
                      :error-messages="errores.direccion"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.usuario.ciudad"
                      label="Ciudad *"
                      prepend-inner-icon="mdi-city"
                      :rules="reglasRequerido"
                      :error-messages="errores.ciudad"
                      required
                    ></v-text-field>
                  </v-col>
  
                  <!-- Contraseña solo para nuevos usuarios -->
                  <template v-if="!esEdicion">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.usuario.password"
                        label="Contraseña *"
                        :type="mostrarPassword ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock"
                        :append-inner-icon="mostrarPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="mostrarPassword = !mostrarPassword"
                        :rules="reglasPassword"
                        :error-messages="errores.password"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.usuario.password_confirmation"
                        label="Confirmar Contraseña *"
                        :type="mostrarPasswordConfirm ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock-check"
                        :append-inner-icon="mostrarPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="mostrarPasswordConfirm = !mostrarPasswordConfirm"
                        :rules="reglasPasswordConfirm"
                        :error-messages="errores.password_confirmation"
                        required
                      ></v-text-field>
                    </v-col>
                  </template>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
  
          <!-- Información del Propietario -->
          <v-col cols="12" lg="6">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-cog</v-icon>
                Configuración del Propietario
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.propietario.ocupacion"
                      label="Ocupación"
                      prepend-inner-icon="mdi-briefcase"
                      :error-messages="errores.ocupacion"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12">
                    <v-select
                      v-model="form.propietario.preferencia_contacto"
                      label="Preferencia de Contacto *"
                      :items="opcionesContacto"
                      prepend-inner-icon="mdi-contact-mail"
                      :rules="reglasRequerido"
                      :error-messages="errores.preferencia_contacto"
                      required
                    ></v-select>
                  </v-col>
  
                  <v-col cols="12">
                    <v-switch
                      v-model="form.propietario.acepta_promociones"
                      label="Acepta recibir promociones y ofertas"
                      color="primary"
                      :error-messages="errores.acepta_promociones"
                    ></v-switch>
                  </v-col>
  
                  <v-col cols="12">
                    <v-switch
                      v-model="form.propietario.acepta_recordatorios"
                      label="Acepta recibir recordatorios de citas"
                      color="primary"
                      :error-messages="errores.acepta_recordatorios"
                    ></v-switch>
                  </v-col>
  
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.propietario.limite_credito"
                      label="Límite de Crédito"
                      type="number"
                      prepend-inner-icon="mdi-credit-card"
                      :error-messages="errores.limite_credito"
                      step="0.01"
                      min="0"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12">
                    <v-textarea
                      v-model="form.propietario.observaciones"
                      label="Observaciones"
                      prepend-inner-icon="mdi-note-text"
                      rows="3"
                      :error-messages="errores.observaciones"
                    ></v-textarea>
                  </v-col>
  
                  <!-- Contacto de Emergencia -->
                  <v-col cols="12">
                    <h4 class="text-h6 mb-2">Contacto de Emergencia</h4>
                  </v-col>
  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.propietario.contacto_emergencia_nombre"
                      label="Nombre del Contacto"
                      prepend-inner-icon="mdi-account-alert"
                      :error-messages="errores.contacto_emergencia_nombre"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.propietario.contacto_emergencia_telefono"
                      label="Teléfono del Contacto"
                      prepend-inner-icon="mdi-phone-alert"
                      :error-messages="errores.contacto_emergencia_telefono"
                    ></v-text-field>
                  </v-col>
  
                  <v-col cols="12">
                    <v-select
                      v-model="form.propietario.contacto_emergencia_relacion"
                      label="Relación"
                      :items="opcionesRelacion"
                      prepend-inner-icon="mdi-account-heart"
                      :error-messages="errores.contacto_emergencia_relacion"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Mostrar errores del servidor -->
        <v-row v-if="Object.keys(erroresServidor).length > 0">
          <v-col cols="12">
            <v-alert
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <div class="font-weight-bold mb-2">Errores de validación:</div>
              <ul>
                <li v-for="(errores, campo) in erroresServidor" :key="campo">
                  <strong>{{ getNombreCampo(campo) }}:</strong> {{ errores.join(', ') }}
                </li>
              </ul>
            </v-alert>
          </v-col>
        </v-row>
  
        <!-- Botones de acción -->
        <v-row>
          <v-col cols="12" class="d-flex justify-end gap-2">
            <v-btn
              variant="outlined"
              @click="$router.back()"
              :disabled="cargando"
            >
              Cancelar
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :loading="cargando"
              :disabled="!valido || cargando"
            >
              <v-icon start>{{ esEdicion ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
              {{ esEdicion ? 'Guardar Cambios' : 'Crear Propietario' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { usePropietariosStore } from '@/stores/propietarios'
  import { useNotifications } from '@/composables/useNotifications'
  
  const route = useRoute()
  const router = useRouter()
  const propietariosStore = usePropietariosStore()
  const { showSuccess, showError } = useNotifications()
  
  // Estado local
  const valido = ref(false)
  const cargando = ref(false)
  const mostrarPassword = ref(false)
  const mostrarPasswordConfirm = ref(false)
  const formulario = ref(null)
  const erroresServidor = ref({})
  
  // Verificar si es edición
  const esEdicion = computed(() => !!route.params.id)
  
  // Breadcrumbs
  const breadcrumbs = computed(() => {
    const items = [
      { title: 'Propietarios', href: '/propietarios' }
    ]
    
    if (esEdicion.value) {
      items.push(
        { title: form.usuario.nombre || 'Propietario', href: `/propietarios/${route.params.id}` },
        { title: 'Editar', disabled: true }
      )
    } else {
      items.push({ title: 'Nuevo', disabled: true })
    }
    
    return items
  })
  
  // Formulario reactivo
  const form = reactive({
    usuario: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      password_confirmation: '',
      telefono: '',
      cedula: '',
      direccion: '',
      ciudad: '',
      fecha_nacimiento: '',
      sexo: '',
      role: 'cliente'
    },
    propietario: {
      ocupacion: '',
      preferencia_contacto: 'email',
      acepta_promociones: true,
      acepta_recordatorios: true,
      limite_credito: '0.00',
      observaciones: '',
      contacto_emergencia_nombre: '',
      contacto_emergencia_telefono: '',
      contacto_emergencia_relacion: ''
    }
  })
  
  // Errores del formulario
  const errores = reactive({
    nombre: [],
    apellido: [],
    email: [],
    password: [],
    password_confirmation: [],
    telefono: [],
    cedula: [],
    direccion: [],
    ciudad: [],
    fecha_nacimiento: [],
    sexo: [],
    ocupacion: [],
    preferencia_contacto: [],
    acepta_promociones: [],
    acepta_recordatorios: [],
    limite_credito: [],
    observaciones: [],
    contacto_emergencia_nombre: [],
    contacto_emergencia_telefono: [],
    contacto_emergencia_relacion: []
  })
  
  // Opciones para selects
  const opcionesSexo = [
    { title: 'Masculino', value: 'M' },
    { title: 'Femenino', value: 'F' }
  ]
  
  const opcionesContacto = [
    { title: 'Email', value: 'email' },
    { title: 'Teléfono', value: 'telefono' },
    { title: 'WhatsApp', value: 'whatsapp' },
    { title: 'SMS', value: 'sms' }
  ]
  
  const opcionesRelacion = [
    { title: 'Familiar', value: 'familiar' },
    { title: 'Amigo', value: 'amigo' },
    { title: 'Pareja', value: 'pareja' },
    { title: 'Vecino', value: 'vecino' },
    { title: 'Compañero de trabajo', value: 'companero_trabajo' },
    { title: 'Otro', value: 'otro' }
  ]
  
  // Reglas de validación
  const reglasRequerido = [
    (v) => !!v || 'Este campo es requerido'
  ]
  
  const reglasNombre = [
    (v) => !!v || 'Este campo es requerido',
    (v) => (v && v.length >= 2) || 'Debe tener al menos 2 caracteres'
  ]
  
  const reglasEmail = [
    (v) => !!v || 'El correo electrónico es requerido',
    (v) => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
  ]
  
  const reglasPassword = [
    (v) => !!v || 'La contraseña es requerida',
    (v) => (v && v.length >= 8) || 'La contraseña debe tener al menos 8 caracteres'
  ]
  
  const reglasPasswordConfirm = [
    (v) => !!v || 'Confirmar contraseña es requerido',
    (v) => v === form.usuario.password || 'Las contraseñas no coinciden'
  ]
  
  const reglasTelefono = [
    (v) => !!v || 'El teléfono es requerido',
    (v) => (v && v.length >= 10) || 'El teléfono debe tener al menos 10 dígitos'
  ]
  
  const reglasCedula = [
    (v) => !!v || 'La cédula es requerida',
    (v) => (v && v.length >= 6) || 'La cédula debe tener al menos 6 caracteres'
  ]
  
  // Métodos
  const getNombreCampo = (campo) => {
    const nombres = {
      nombre: 'Nombre',
      apellido: 'Apellido',
      email: 'Email',
      password: 'Contraseña',
      password_confirmation: 'Confirmación de contraseña',
      telefono: 'Teléfono',
      cedula: 'Cédula',
      direccion: 'Dirección',
      ciudad: 'Ciudad',
      fecha_nacimiento: 'Fecha de nacimiento',
      sexo: 'Sexo',
      ocupacion: 'Ocupación',
      preferencia_contacto: 'Preferencia de contacto',
      limite_credito: 'Límite de crédito',
      observaciones: 'Observaciones',
      contacto_emergencia_nombre: 'Nombre contacto emergencia',
      contacto_emergencia_telefono: 'Teléfono contacto emergencia',
      contacto_emergencia_relacion: 'Relación contacto emergencia'
    }
    return nombres[campo] || campo
  }
  
  const limpiarErrores = () => {
    Object.keys(errores).forEach(key => {
      errores[key] = []
    })
    erroresServidor.value = {}
  }
  
  const cargarPropietario = async () => {
    if (!esEdicion.value) return
    
    cargando.value = true
    try {
      const result = await propietariosStore.fetchPropietario(route.params.id)
      if (result.success) {
        const propietario = result.data
        
        // Cargar datos del usuario
        form.usuario.nombre = propietario.nombre_completo.split(' ')[0] || ''
        form.usuario.apellido = propietario.nombre_completo.split(' ').slice(1).join(' ') || ''
        form.usuario.email = propietario.email || ''
        form.usuario.telefono = propietario.telefono || ''
        form.usuario.direccion = propietario.direccion || ''
        form.usuario.ciudad = propietario.ciudad || ''
        // No cargamos contraseña en edición
        
        // Cargar datos del propietario
        form.propietario.ocupacion = propietario.ocupacion || ''
        form.propietario.preferencia_contacto = propietario.preferencia_contacto || 'email'
        form.propietario.acepta_promociones = propietario.acepta_promociones
        form.propietario.acepta_recordatorios = propietario.acepta_recordatorios
        form.propietario.limite_credito = propietario.limite_credito || '0.00'
        form.propietario.observaciones = propietario.observaciones || ''
        form.propietario.contacto_emergencia_nombre = propietario.contacto_emergencia_nombre || ''
        form.propietario.contacto_emergencia_telefono = propietario.contacto_emergencia_telefono || ''
        form.propietario.contacto_emergencia_relacion = propietario.contacto_emergencia_relacion || ''
      } else {
        showError(result.message)
      }
    } catch (error) {
      showError('Error al cargar el propietario')
    } finally {
      cargando.value = false
    }
  }
  
  const guardarPropietario = async () => {
    if (!valido.value) return
    
    cargando.value = true
    limpiarErrores()
    
    try {
      let result
      
      if (esEdicion.value) {
        // Actualizar propietario existente
        const datosActualizacion = {
          usuario: {
            nombre: form.usuario.nombre,
            apellido: form.usuario.apellido,
            email: form.usuario.email,
            telefono: form.usuario.telefono,
            direccion: form.usuario.direccion,
            ciudad: form.usuario.ciudad
          },
          propietario: form.propietario
        }
        
        result = await propietariosStore.actualizarPropietario(route.params.id, datosActualizacion)
      } else {
        // Crear nuevo propietario
        result = await propietariosStore.crearPropietario(form.usuario, form.propietario)
      }
      
      if (result.success) {
        showSuccess(esEdicion.value ? 'Propietario actualizado correctamente' : 'Propietario creado correctamente')
        router.push('/propietarios')
      } else {
        if (result.errors) {
          erroresServidor.value = result.errors
          // Asignar errores específicos de cada campo
          Object.keys(result.errors).forEach(key => {
            if (errores.hasOwnProperty(key)) {
              errores[key] = result.errors[key]
            }
          })
        } else {
          showError(result.message)
        }
      }
    } catch (error) {
      console.error('Error al guardar propietario:', error.response?.data)
      
      if (error.response?.status === 422) {
        const responseErrors = error.response.data.errors
        if (responseErrors) {
          erroresServidor.value = responseErrors
          Object.keys(responseErrors).forEach(key => {
            if (errores.hasOwnProperty(key)) {
              errores[key] = responseErrors[key]
            }
          })
        }
      } else {
        showError('Error al guardar el propietario. Inténtalo de nuevo.')
      }
    } finally {
      cargando.value = false
    }
  }
  
  // Lifecycle
  onMounted(() => {
    if (esEdicion.value) {
      cargarPropietario()
    }
  })
  </script>
  
  <style scoped>
  .v-card {
    height: fit-content;
  }
  </style>