<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <v-card-title class="text-h4 text-center mb-4">
            🐾 Sistema Veterinaria
          </v-card-title>
          
          <v-card-text>
            <p class="text-center text-h6 mb-4">
              ¡Vuetify 3 configurado correctamente!
            </p>
            
            <!-- Botones de prueba -->
            <v-row class="mb-4" justify="center">
              <v-col cols="auto">
                <v-btn @click="showSuccess('¡Éxito!')" color="success">
                  <v-icon start>mdi-check</v-icon>
                  Éxito
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn @click="showError('¡Error!')" color="error">
                  <v-icon start>mdi-alert</v-icon>
                  Error
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn @click="showWarning('¡Advertencia!')" color="warning">
                  <v-icon start>mdi-alert-outline</v-icon>
                  Advertencia
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn @click="showInfo('¡Información!')" color="info">
                  <v-icon start>mdi-information</v-icon>
                  Info
                </v-btn>
              </v-col>
            </v-row>

            <!-- Card de prueba -->
            <v-card class="mb-4" color="primary" variant="tonal">
              <v-card-text>
                <v-icon size="large" class="mr-2">mdi-heart</v-icon>
                Esta es una tarjeta de prueba para verificar el tema de Vuetify
              </v-card-text>
            </v-card>

            <!-- Formulario de prueba -->
            <v-form class="mb-4">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Nombre"
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    label="Rol"
                    :items="['Administrador', 'Veterinario', 'Cliente']"
                    prepend-inner-icon="mdi-account-group"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>

            <!-- Información del sistema -->
            <v-alert
              type="info"
              variant="tonal"
              border="start"
            >
              <template #prepend>
                <v-icon>mdi-information</v-icon>
              </template>
              <div>
                <strong>Estado del Sistema:</strong>
                <ul class="mt-2">
                  <li>✅ Vue 3 configurado</li>
                  <li>✅ Vuetify 3 configurado</li>
                  <li>✅ Pinia store configurado</li>
                  <li>✅ Axios configurado</li>
                  <li>✅ Sistema de notificaciones funcionando</li>
                </ul>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications'

const { showSuccess, showError, showWarning, showInfo } = useNotifications()
</script>