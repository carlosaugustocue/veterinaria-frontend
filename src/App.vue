<template>
  <v-app>
    <div class="page-container">
    <!-- Header Principal -->
    <v-app-bar 
      app 
      color="white" 
      elevation="1" 
      height="70"
      class="header-bar"
    >
      <v-container fluid class="d-flex align-center pa-0">
        <v-row no-gutters class="align-center">
          <!-- Logo y nombre -->
          <v-col cols="auto" class="d-flex align-center">
            <v-avatar 
              size="48" 
              color="primary" 
              class="mr-3"
              @click="$router.push('/dashboard')"
              style="cursor: pointer;"
            >
              <v-icon color="white" size="28">mdi-paw</v-icon>
            </v-avatar>
            <div 
              @click="$router.push('/dashboard')"
              style="cursor: pointer;"
            >
              <h2 class="text-h5 font-weight-bold primary--text mb-0">
                VetHumboldt
              </h2>
              <div class="text-caption text-medium-emphasis">
                Gestión Profesional Veterinaria
              </div>
            </div>
          </v-col>

          <!-- Navegación central -->
          <v-col class="d-flex justify-center">
            <v-tabs 
              v-model="activeTab" 
              color="primary" 
              class="header-tabs"
              show-arrows
            >
              <v-tab 
                value="dashboard"
                @click="$router.push('/dashboard')"
                :class="{ 'v-tab--active': $route.path === '/dashboard' }"
              >
                <v-icon class="mr-2">mdi-view-dashboard</v-icon>
                Dashboard
              </v-tab>
              
              <v-tab 
                value="propietarios"
                @click="$router.push('/propietarios')"
                :class="{ 'v-tab--active': $route.path.startsWith('/propietarios') }"
              >
                <v-icon class="mr-2">mdi-account-group</v-icon>
                Propietarios
              </v-tab>
              
              <v-tab 
                value="pacientes"
                @click="$router.push('/pacientes')"
                :class="{ 'v-tab--active': $route.path.startsWith('/pacientes') }"
              >
                <v-icon class="mr-2">mdi-paw</v-icon>
                Mascotas
              </v-tab>
              
              <v-tab 
                value="citas"
                @click="$router.push('/citas')"
                :class="{ 'v-tab--active': $route.path.startsWith('/citas') }"
              >
                <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                Citas
              </v-tab>
              
              <v-tab 
                value="consultas"
                @click="navegarProximamente('/consultas')"
                :class="{ 'v-tab--active': $route.path.startsWith('/consultas') }"
              >
                <v-icon class="mr-2">mdi-stethoscope</v-icon>
                Consultas
              </v-tab>
              <v-tab 
                value="consultas"
                @click="$router.push('/citas/disponibilidad')"
                :class="{ 'v-tab--active': $route.path.startsWith('/consultas') }"
              >
                <v-icon class="mr-2">mdi-alert-circle</v-icon>
                Test disponibilidad
              </v-tab>
            </v-tabs>
          </v-col>

          <!-- Acciones del usuario -->
          <v-col cols="auto" class="d-flex align-center">
            <!-- Notificaciones -->
            <v-btn 
              icon 
              variant="text" 
              class="mr-2"
              @click="toggleNotifications"
            >
              <v-badge 
                :content="notificationsCount" 
                :model-value="notificationsCount > 0"
                color="error"
              >
                <v-icon>mdi-bell-outline</v-icon>
              </v-badge>
            </v-btn>

            <!-- Búsqueda rápida -->
            <v-btn 
              icon 
              variant="text" 
              class="mr-2"
              @click="toggleSearch"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <!-- Menú de usuario -->
            <v-menu offset-y>
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  class="user-menu-btn"
                >
                  <v-avatar size="32" class="mr-2">
                    <v-img :src="userAvatar"></v-img>
                  </v-avatar>
                  <div class="d-none d-sm-block text-left">
                    <div class="text-body-2 font-weight-medium">{{ authStore.userName }}</div>
                    <div class="text-caption text-medium-emphasis">{{ authStore.userRole }}</div>
                  </div>
                  <v-icon class="ml-2">mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <v-list class="user-dropdown">
                <v-list-item @click="irAPerfil">
                  <template #prepend>
                    <v-icon>mdi-account</v-icon>
                  </template>
                  <v-list-item-title>Mi Perfil</v-list-item-title>
                </v-list-item>
                
                <v-list-item @click="irAConfiguracion">
                  <template #prepend>
                    <v-icon>mdi-cog</v-icon>
                  </template>
                  <v-list-item-title>Configuración</v-list-item-title>
                </v-list-item>
                
                <v-divider></v-divider>
                
                <v-list-item @click="handleLogout" class="logout-item">
                  <template #prepend>
                    <v-icon color="error">mdi-logout</v-icon>
                  </template>
                  <v-list-item-title class="text-error">Cerrar Sesión</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Búsqueda rápida (drawer) -->
    <v-navigation-drawer
      v-model="searchDrawer"
      temporary
      location="top"
      height="300"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="searchQuery"
              placeholder="Buscar propietarios, mascotas, citas..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              autofocus
              @input="realizarBusqueda"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="searchResults.length > 0">
          <v-col cols="12">
            <v-list>
              <v-list-item
                v-for="result in searchResults"
                :key="result.id"
                @click="irAResultado(result)"
              >
                <template #prepend>
                  <v-icon :color="result.color">{{ result.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ result.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ result.subtitle }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main class="main-content">
      <router-view />
    </v-main>

    <!-- Footer profesional -->
    <v-footer class="footer-section">
      <v-container>
        <v-row>
          <!-- Logo y descripción -->
          <v-col cols="12" md="4" class="mb-4">
            <div class="d-flex align-center mb-3">
              <v-avatar size="40" color="primary" class="mr-3">
                <v-icon color="white" size="24">mdi-paw</v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold">Sistema Veterinaria</h3>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Cuidando la salud y el bienestar de tus mascotas con los mejores 
              profesionales y servicios veterinarios especializados.
            </p>
            
            <!-- Redes sociales -->
            <div class="d-flex">
              <v-btn 
                icon 
                variant="text" 
                size="small" 
                class="mr-2"
                @click="abrirRedSocial('facebook')"
              >
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn 
                icon 
                variant="text" 
                size="small" 
                class="mr-2"
                @click="abrirRedSocial('instagram')"
              >
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
              <v-btn 
                icon 
                variant="text" 
                size="small"
                @click="abrirRedSocial('twitter')"
              >
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
            </div>
          </v-col>

          <!-- Enlaces rápidos -->
          <v-col cols="12" sm="6" md="2" class="mb-4">
            <h4 class="text-h6 font-weight-bold mb-3">Enlaces Rápidos</h4>
            <v-list density="compact" class="footer-links">
              <v-list-item @click="$router.push('/dashboard')" class="pa-1">
                <v-list-item-title class="text-body-2">Dashboard</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$router.push('/propietarios')" class="pa-1">
                <v-list-item-title class="text-body-2">Propietarios</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$router.push('/pacientes')" class="pa-1">
                <v-list-item-title class="text-body-2">Mascotas</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navegarProximamente('/citas')" class="pa-1">
                <v-list-item-title class="text-body-2">Citas</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- Servicios -->
          <v-col cols="12" sm="6" md="2" class="mb-4">
            <h4 class="text-h6 font-weight-bold mb-3">Servicios</h4>
            <v-list density="compact" class="footer-links">
              <v-list-item @click="navegarProximamente('/servicios/consultas')" class="pa-1">
                <v-list-item-title class="text-body-2">Consultas</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navegarProximamente('/servicios/vacunacion')" class="pa-1">
                <v-list-item-title class="text-body-2">Vacunación</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navegarProximamente('/servicios/cirugia')" class="pa-1">
                <v-list-item-title class="text-body-2">Cirugía</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navegarProximamente('/servicios/laboratorio')" class="pa-1">
                <v-list-item-title class="text-body-2">Laboratorio</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- Especialidades -->
          <v-col cols="12" sm="6" md="2" class="mb-4">
            <h4 class="text-h6 font-weight-bold mb-3">Especialidades</h4>
            <v-list density="compact" class="footer-links">
              <v-list-item @click="navegarProximamente('/especialidades/medicina-interna')" class="pa-1">
                <v-list-item-title class="text-body-2">Medicina Interna</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navegarProximamente('/especialidades/dermatologia')" class="pa-1">
                <v-list-item-title class="text-body-2">Dermatología</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navegarProximamente('/especialidades/cardiologia')" class="pa-1">
                <v-list-item-title class="text-body-2">Cardiología</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navegarProximamente('/especialidades/oftalmologia')" class="pa-1">
                <v-list-item-title class="text-body-2">Oftalmología</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- Contacto -->
          <v-col cols="12" md="2" class="mb-4">
            <h4 class="text-h6 font-weight-bold mb-3">Contacto</h4>
            <div class="contact-info">
              <div class="d-flex align-center mb-2">
                <v-icon size="18" class="mr-2 text-medium-emphasis">mdi-map-marker</v-icon>
                <span class="text-body-2">Cl. 6 Nte. #14-26, Armenia, Quindío</span>
              </div>
              <div class="d-flex align-center mb-2">
                <v-icon size="18" class="mr-2 text-medium-emphasis">mdi-phone</v-icon>
                <span class="text-body-2">311 2324283</span>
              </div>
              <div class="d-flex align-center mb-2">
                <v-icon size="18" class="mr-2 text-medium-emphasis">mdi-email</v-icon>
                <span class="text-body-2">vethumboldt@cue.edu.co</span>
              </div>
              <div class="d-flex align-start">
                <v-icon size="18" class="mr-2 mt-1 text-medium-emphasis">mdi-clock</v-icon>
                <div class="text-body-2">
                  <div>Lun-Vie: 8am-6pm</div>
                  <div>Sáb: 8am-2pm</div>
                  <div>Dom: Emergencias</div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Copyright -->
        <v-divider class="mt-4 mb-4"></v-divider>
        <v-row>
          <v-col cols="12" md="6">
            <p class="text-body-2 text-medium-emphasis mb-0">
              © {{ currentYear }} Sistema Veterinaria. Todos los derechos reservados.
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-md-end">
            <v-btn 
              variant="text" 
              size="small" 
              class="mr-4"
              @click="navegarProximamente('/terminos')"
            >
              Términos y Condiciones
            </v-btn>
            <v-btn 
              variant="text" 
              size="small"
              @click="navegarProximamente('/privacidad')"
            >
              Política de Privacidad
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Snackbar global para notificaciones -->
    <!-- <v-snackbar
      v-model="notification.show"
      :color="notification.color"
      :timeout="notification.timeout"
      location="top right"
      variant="flat"
    >
      {{ notification.message }}
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          @click="hideNotification"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar> -->
  </div class="page-container">
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { notification, hideNotification, showInfo, showSuccess } = useNotifications()

// Variables reactivas
const activeTab = ref('dashboard')
const searchDrawer = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const notificationsCount = ref(3)

// Computed
const userAvatar = computed(() => {
  return `https://ui-avatars.com/api/?name=${authStore.userName}&background=1976d2&color=fff`
})

const currentYear = computed(() => {
  return new Date().getFullYear()
})

// Métodos
const toggleNotifications = () => {
  showInfo('Panel de notificaciones próximamente disponible')
}

const toggleSearch = () => {
  searchDrawer.value = !searchDrawer.value
  if (searchDrawer.value) {
    searchQuery.value = ''
    searchResults.value = []
  }
}

const realizarBusqueda = () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  
  // Simulación de resultados de búsqueda
  searchResults.value = [
    {
      id: 1,
      title: 'Max - Labrador',
      subtitle: 'Propietario: Juan Pérez',
      icon: 'mdi-paw',
      color: 'primary',
      type: 'paciente',
      route: '/pacientes/1'
    },
    {
      id: 2,
      title: 'María González',
      subtitle: 'Propietario - 2 mascotas',
      icon: 'mdi-account',
      color: 'success',
      type: 'propietario',
      route: '/propietarios/1'
    }
  ].filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

const irAResultado = (result) => {
  router.push(result.route)
  searchDrawer.value = false
}

const navegarProximamente = (ruta) => {
  showInfo(`Funcionalidad "${ruta}" próximamente disponible`)
}

const irAPerfil = () => {
  showInfo('Mi Perfil próximamente disponible')
}

const irAConfiguracion = () => {
  showInfo('Configuración próximamente disponible')
}

const abrirRedSocial = (red) => {
  showInfo(`Enlace a ${red} próximamente disponible`)
}

const handleLogout = async () => {
  await authStore.logout()
  showSuccess('Sesión cerrada exitosamente')
  router.push('/login')
}

// Lifecycle
onMounted(() => {
  // Establecer tab activo basado en la ruta actual
  if (route.path.startsWith('/propietarios')) {
    activeTab.value = 'propietarios'
  } else if (route.path.startsWith('/pacientes')) {
    activeTab.value = 'pacientes'
  } else if (route.path.startsWith('/citas')) {
    activeTab.value = 'citas'
  } else if (route.path.startsWith('/consultas')) {
    activeTab.value = 'consultas'
  } else {
    activeTab.value = 'dashboard'
  }
})
</script>

<style scoped>
.header-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.header-tabs :deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
}

.user-menu-btn {
  padding: 8px 12px !important;
  height: auto !important;
}

.user-dropdown {
  min-width: 200px;
}

.logout-item:hover {
  background-color: rgba(244, 67, 54, 0.08) !important;
}

.main-content {
  min-height: calc(100vh - 70px - 200px); /* Header height - Footer height */
}

.footer-section {
  background-color: #f8f9fa !important;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding: 40px 0 20px 0;
}

.footer-links :deep(.v-list-item) {
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer-links :deep(.v-list-item:hover) {
  color: rgb(var(--v-theme-primary)) !important;
}

.contact-info {
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .header-tabs {
    display: none;
  }
  
  .user-menu-btn :deep(.d-sm-block) {
    display: none !important;
  }
}

/* Smooth transitions */
.v-app-bar {
  transition: all 0.3s ease;
}

.v-footer {
  transition: all 0.3s ease;
}
</style>