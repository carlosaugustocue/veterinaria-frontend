<template>
    <v-app>
      <v-main>
        <v-container fluid class="fill-height">
          <v-row align="center" justify="center" class="fill-height">
            <v-col cols="12" sm="10" md="8" lg="6">
              <v-card class="elevation-8 rounded-lg">
                <!-- Header -->
                <v-card-title class="text-center pa-6 bg-primary">
                  <div class="w-100">
                    <v-icon size="48" color="white" class="mb-2">mdi-paw</v-icon>
                    <h2 class="text-white">VetHumboldt</h2>
                    <p class="text-white text-body-2 mb-0">Crear Cuenta</p>
                  </div>
                </v-card-title>
  
                <!-- Formulario -->
                <v-card-text class="pa-6">
                  <v-form ref="registerForm" v-model="valid" @submit.prevent="handleRegister">
                    <v-row>
                      <!-- Información Personal -->
                      <v-col cols="12">
                        <h3 class="text-h6 mb-3">Información Personal</h3>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.nombre"
                          label="Nombre *"
                          prepend-inner-icon="mdi-account"
                          :rules="nameRules"
                          :error-messages="errors.nombre"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.apellido"
                          label="Apellido *"
                          prepend-inner-icon="mdi-account"
                          :rules="nameRules"
                          :error-messages="errors.apellido"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.cedula"
                          label="Cédula *"
                          prepend-inner-icon="mdi-card-account-details"
                          :rules="cedulaRules"
                          :error-messages="errors.cedula"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.telefono"
                          label="Teléfono *"
                          prepend-inner-icon="mdi-phone"
                          :rules="phoneRules"
                          :error-messages="errors.telefono"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.fecha_nacimiento"
                          label="Fecha de Nacimiento *"
                          type="date"
                          prepend-inner-icon="mdi-calendar"
                          :rules="dateRules"
                          :error-messages="errors.fecha_nacimiento"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="form.sexo"
                          label="Sexo *"
                          :items="sexoOptions"
                          prepend-inner-icon="mdi-human-male-female"
                          :rules="requiredRules"
                          :error-messages="errors.sexo"
                          required
                        ></v-select>
                      </v-col>
  
                      <!-- Información de Contacto -->
                      <v-col cols="12">
                        <h3 class="text-h6 mb-3 mt-4">Información de Contacto</h3>
                      </v-col>
  
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.email"
                          label="Correo Electrónico *"
                          type="email"
                          prepend-inner-icon="mdi-email"
                          :rules="emailRules"
                          :error-messages="errors.email"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.direccion"
                          label="Dirección *"
                          prepend-inner-icon="mdi-map-marker"
                          :rules="requiredRules"
                          :error-messages="errors.direccion"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.ciudad"
                          label="Ciudad *"
                          prepend-inner-icon="mdi-city"
                          :rules="requiredRules"
                          :error-messages="errors.ciudad"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <!-- Contraseña -->
                      <v-col cols="12">
                        <h3 class="text-h6 mb-3 mt-4">Seguridad</h3>
                      </v-col>
  
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.password"
                          label="Contraseña *"
                          :type="showPassword ? 'text' : 'password'"
                          prepend-inner-icon="mdi-lock"
                          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append-inner="showPassword = !showPassword"
                          :rules="passwordRules"
                          :error-messages="errors.password"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.password_confirmation"
                          label="Confirmar Contraseña *"
                          :type="showPasswordConfirm ? 'text' : 'password'"
                          prepend-inner-icon="mdi-lock-check"
                          :append-inner-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
                          :rules="passwordConfirmRules"
                          :error-messages="errors.password_confirmation"
                          required
                        ></v-text-field>
                      </v-col>
  
                      <!-- Rol (fijo como cliente) -->
                      <v-col cols="12">
                        <v-select
                          v-model="form.role"
                          label="Tipo de Cuenta"
                          :items="roleOptions"
                          prepend-inner-icon="mdi-account-group"
                          readonly
                          hint="Los nuevos usuarios se registran como clientes"
                        ></v-select>
                      </v-col>
                    </v-row>
  
                    <!-- Mostrar errores detallados -->
                    <v-alert
                      v-if="Object.keys(serverErrors).length > 0"
                      type="error"
                      variant="tonal"
                      class="mb-4"
                    >
                      <div class="font-weight-bold mb-2">Errores de validación:</div>
                      <ul>
                        <li v-for="(errors, field) in serverErrors" :key="field">
                          <strong>{{ getFieldName(field) }}:</strong> {{ errors.join(', ') }}
                        </li>
                      </ul>
                    </v-alert>
  
                    <!-- Mostrar error general -->
                    <v-alert
                      v-if="generalError && Object.keys(serverErrors).length === 0"
                      type="error"
                      variant="tonal"
                      class="mb-4"
                    >
                      {{ generalError }}
                    </v-alert>
  
                    <v-btn
                      type="submit"
                      block
                      size="large"
                      :loading="loading"
                      :disabled="!valid || loading"
                      class="mb-4"
                    >
                      <v-icon start>mdi-account-plus</v-icon>
                      Crear Cuenta
                    </v-btn>
                  </v-form>
  
                  <!-- Divider -->
                  <v-divider class="my-4"></v-divider>
  
                  <!-- Link de login -->
                  <div class="text-center">
                    <p class="text-body-2 mb-2">¿Ya tienes una cuenta?</p>
                    <v-btn
                      variant="text"
                      color="primary"
                      @click="$router.push('/login')"
                    >
                      Iniciar Sesión
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useNotifications } from '@/composables/useNotifications'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const { showSuccess, showError } = useNotifications()
  
  // Referencias reactivas
  const valid = ref(false)
  const loading = ref(false)
  const showPassword = ref(false)
  const showPasswordConfirm = ref(false)
  const registerForm = ref(null)
  const generalError = ref('')
  const serverErrors = ref({})
  
  // Formulario reactivo
  const form = reactive({
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
  })
  
  // Errores del servidor
  const errors = reactive({
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
    sexo: []
  })
  
  // ✅ CORREGIDO: Usar valores que coincidan con la API
  const sexoOptions = [
    { title: 'Masculino', value: 'M' },  
    { title: 'Femenino', value: 'F' }     
    // { title: 'Otro', value: 'otro' }     
  ]
  
  const roleOptions = [
    { title: 'Cliente', value: 'cliente' }
  ]
  
  // Reglas de validación
  const requiredRules = [
    (v) => !!v || 'Este campo es requerido'
  ]
  
  const nameRules = [
    (v) => !!v || 'Este campo es requerido',
    (v) => (v && v.length >= 2) || 'Debe tener al menos 2 caracteres'
  ]
  
  const emailRules = [
    (v) => !!v || 'El correo electrónico es requerido',
    (v) => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
  ]
  
  const passwordRules = [
    (v) => !!v || 'La contraseña es requerida',
    (v) => (v && v.length >= 8) || 'La contraseña debe tener al menos 8 caracteres'
  ]
  
  const passwordConfirmRules = [
    (v) => !!v || 'Confirmar contraseña es requerido',
    (v) => v === form.password || 'Las contraseñas no coinciden'
  ]
  
  const phoneRules = [
    (v) => !!v || 'El teléfono es requerido',
    (v) => (v && v.length >= 10) || 'El teléfono debe tener al menos 10 dígitos'
  ]
  
  const cedulaRules = [
    (v) => !!v || 'La cédula es requerida',
    (v) => (v && v.length >= 6) || 'La cédula debe tener al menos 6 caracteres'
  ]
  
  const dateRules = [
    (v) => !!v || 'La fecha de nacimiento es requerida'
  ]
  
  // Nombres de campos para mostrar errores
  const getFieldName = (field) => {
    const names = {
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
      role: 'Rol'
    }
    return names[field] || field
  }
  
  // Limpiar errores
  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      errors[key] = []
    })
    generalError.value = ''
    serverErrors.value = {}
  }
  
  // Manejar registro
  const handleRegister = async () => {
    if (!valid.value) return
    
    loading.value = true
    clearErrors()
    
    try {
      console.log('✅ Enviando datos CORREGIDOS a la API:', form) // Para debug
      
      const result = await authStore.register(form)
      
      if (result.success) {
        showSuccess(`¡Cuenta creada exitosamente! Bienvenido ${authStore.userName}`)
        router.push('/dashboard')
      } else {
        if (result.errors) {
          serverErrors.value = result.errors
          // También asignar errores específicos de cada campo
          Object.keys(result.errors).forEach(key => {
            if (errors.hasOwnProperty(key)) {
              errors[key] = result.errors[key]
            }
          })
        } else {
          generalError.value = result.message || 'Error al crear la cuenta'
        }
      }
    } catch (error) {
      console.error('❌ Error completo en registro:', error.response?.data) // Para debug
      
      // Manejar errores de validación del servidor
      if (error.response?.status === 422) {
        const responseErrors = error.response.data.errors
        if (responseErrors) {
          serverErrors.value = responseErrors
          Object.keys(responseErrors).forEach(key => {
            if (errors.hasOwnProperty(key)) {
              errors[key] = responseErrors[key]
            }
          })
        }
      } else {
        generalError.value = error.response?.data?.message || 'Error al crear la cuenta. Inténtalo de nuevo.'
      }
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .fill-height {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .v-card {
    max-width: 100%;
  }
  </style>