<template>
    <v-app>
      <v-main>
        <v-container fluid class="fill-height">
          <v-row align="center" justify="center" class="fill-height">
            <v-col cols="12" sm="8" md="6" lg="4">
              <v-card class="elevation-8 rounded-lg">
                <!-- Header -->
                <v-card-title class="text-center pa-6 bg-primary">
                  <div class="w-100">
                    <v-icon size="48" color="white" class="mb-2">mdi-paw</v-icon>
                    <h2 class="text-white">VetHumboltd</h2>
                    <p class="text-white text-body-2 mb-0">Iniciar Sesión</p>
                  </div>
                </v-card-title>
  
                <!-- Formulario -->
                <v-card-text class="pa-6">
                  <v-form ref="loginForm" v-model="valid" @submit.prevent="handleLogin">
                    <v-text-field
                      v-model="form.email"
                      label="Correo Electrónico"
                      type="email"
                      prepend-inner-icon="mdi-email"
                      :rules="emailRules"
                      :error-messages="errors.email"
                      class="mb-3"
                      required
                    ></v-text-field>
  
                    <v-text-field
                      v-model="form.password"
                      label="Contraseña"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock"
                      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="showPassword = !showPassword"
                      :rules="passwordRules"
                      :error-messages="errors.password"
                      class="mb-3"
                      required
                    ></v-text-field>
  
                    <!-- Mostrar errores detallados -->
                    <v-alert
                      v-if="Object.keys(serverErrors).length > 0"
                      type="error"
                      variant="tonal"
                      class="mb-4"
                    >
                      <div class="font-weight-bold mb-2">Errores:</div>
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
                      <v-icon start>mdi-login</v-icon>
                      Iniciar Sesión
                    </v-btn>
                  </v-form>
  
                  <!-- Divider -->
                  <v-divider class="my-4"></v-divider>
  
                  <!-- Link de registro -->
                  <div class="text-center">
                    <p class="text-body-2 mb-2">¿No tienes una cuenta?</p>
                    <v-btn
                      variant="text"
                      color="primary"
                      @click="$router.push('/register')"
                    >
                      Crear Cuenta
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
  const loginForm = ref(null)
  const generalError = ref('')
  const serverErrors = ref({})
  
  // Formulario reactivo
  const form = reactive({
    email: '',
    password: ''
  })
  
  // Errores del servidor
  const errors = reactive({
    email: [],
    password: []
  })
  
  // Reglas de validación
  const emailRules = [
    (v) => !!v || 'El correo electrónico es requerido',
    (v) => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
  ]
  
  const passwordRules = [
    (v) => !!v || 'La contraseña es requerida',
    (v) => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres'
  ]
  
  // Nombres de campos para mostrar errores
  const getFieldName = (field) => {
    const names = {
      email: 'Email',
      password: 'Contraseña'
    }
    return names[field] || field
  }
  
  // Limpiar errores
  const clearErrors = () => {
    errors.email = []
    errors.password = []
    generalError.value = ''
    serverErrors.value = {}
  }
  
  // Manejar login
  const handleLogin = async () => {
    if (!valid.value) return
    
    loading.value = true
    clearErrors()
    
    try {
      console.log('Enviando datos de login:', form) // Para debug
      
      const result = await authStore.login({
        email: form.email,
        password: form.password
      })
      
      if (result.success) {
        showSuccess(`¡Bienvenido ${authStore.userName}!`)
        router.push('/dashboard')
      } else {
        generalError.value = result.message
      }
    } catch (error) {
      console.error('Error en login:', error.response?.data) // Para debug
      
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
      } else if (error.response?.status === 401) {
        generalError.value = 'Credenciales incorrectas'
      } else {
        generalError.value = error.response?.data?.message || 'Error al iniciar sesión. Inténtalo de nuevo.'
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