<template>
    <v-app>
      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
        <v-list-item
          :prepend-avatar="userAvatar"
          :title="authStore.userName"
          :subtitle="authStore.userRole"
          nav
        >
          <template #append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>
  
        <v-divider></v-divider>
  
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            title="Dashboard"
            value="dashboard"
            :active="$route.name === 'dashboard'"
            @click="$router.push('/dashboard')"
          ></v-list-item>
  
          <v-list-item
            prepend-icon="mdi-account-group"
            title="Propietarios"
            value="propietarios"
            :active="$route.path.startsWith('/propietarios')"
            @click="$router.push('/propietarios')"
          ></v-list-item>
  
          <v-list-item
            prepend-icon="mdi-paw"
            title="Mascotas"
            value="pacientes"
            :active="$route.path.startsWith('/pacientes')"
            @click="$router.push('/pacientes')"
          ></v-list-item>
  
          <v-list-item
            prepend-icon="mdi-calendar-clock"
            title="Citas"
            value="citas"
            :active="$route.path.startsWith('/citas')"
            @click="navegarA('/citas')"
          ></v-list-item>
  
          <v-list-item
            prepend-icon="mdi-stethoscope"
            title="Consultas"
            value="consultas"
            :active="$route.path.startsWith('/consultas')"
            @click="navegarA('/consultas')"
          ></v-list-item>
  
          <v-list-item
            prepend-icon="mdi-prescription"
            title="Fórmulas"
            value="formulas"
            :active="$route.path.startsWith('/formulas')"
            @click="navegarA('/formulas')"
          ></v-list-item>
  
          <v-list-item
            prepend-icon="mdi-receipt"
            title="Facturas"
            value="facturas"
            :active="$route.path.startsWith('/facturas')"
            @click="navegarA('/facturas')"
          ></v-list-item>
  
          <v-list-group value="administracion">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-cog"
                title="Administración"
              ></v-list-item>
            </template>
  
            <v-list-item
              prepend-icon="mdi-doctor"
              title="Veterinarios"
              value="veterinarios"
              @click="navegarA('/veterinarios')"
            ></v-list-item>
  
            <v-list-item
              prepend-icon="mdi-chart-line"
              title="Reportes"
              value="reportes"
              @click="navegarA('/reportes')"
            ></v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
  
      <!-- App Bar -->
    
  
      <!-- Main Content -->
      <v-main>
        <v-container fluid>
          <!-- Header del Dashboard -->
          <v-row class="mb-4">
            <v-col cols="12">
              <h1 class="text-h4 font-weight-bold">
                Dashboard
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                Bienvenido al sistema de gestión veterinaria
              </p>
            </v-col>
          </v-row>
  
          <!-- Cards de estadísticas -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="3">
              <v-card color="primary" variant="flat" @click="$router.push('/pacientes')" class="cursor-pointer hover-lift">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-icon size="48" color="white" class="mr-3">mdi-paw</v-icon>
                    <div>
                      <div class="text-h4 text-white font-weight-bold">{{ stats.mascotas }}</div>
                      <div class="text-white">Mascotas</div>
                      <div class="text-caption text-white" style="opacity: 0.8">
                        +{{ stats.nuevasMascotasMes }} este mes
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <v-col cols="12" sm="6" md="3">
              <v-card color="success" variant="flat" @click="navegarA('/citas')" class="cursor-pointer hover-lift">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-icon size="48" color="white" class="mr-3">mdi-calendar-check</v-icon>
                    <div>
                      <div class="text-h4 text-white font-weight-bold">{{ stats.citasHoy }}</div>
                      <div class="text-white">Citas Hoy</div>
                      <div class="text-caption text-white" style="opacity: 0.8">
                        {{ stats.citasPendientes }} pendientes
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <v-col cols="12" sm="6" md="3">
              <v-card color="warning" variant="flat" @click="$router.push('/propietarios')" class="cursor-pointer hover-lift">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-icon size="48" color="white" class="mr-3">mdi-account-group</v-icon>
                    <div>
                      <div class="text-h4 text-white font-weight-bold">{{ stats.propietarios }}</div>
                      <div class="text-white">Propietarios</div>
                      <div class="text-caption text-white" style="opacity: 0.8">
                        {{ stats.propietariosActivos }} activos
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
  
            <v-col cols="12" sm="6" md="3">
              <v-card color="info" variant="flat" @click="navegarA('/facturas')" class="cursor-pointer hover-lift">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-icon size="48" color="white" class="mr-3">mdi-cash</v-icon>
                    <div>
                      <div class="text-h4 text-white font-weight-bold">${{ stats.ingresosMes }}</div>
                      <div class="text-white">Ingresos del Mes</div>
                      <div class="text-caption text-white" style="opacity: 0.8">
                        +{{ stats.crecimientoMes }}% vs mes anterior
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
  
          <!-- Contenido principal -->
          <v-row>
            <!-- Citas de hoy -->
            <v-col cols="12" lg="8">
              <v-card class="mb-4">
                <v-card-title class="d-flex justify-space-between align-center">
                  <div>
                    <v-icon class="mr-2">mdi-calendar-today</v-icon>
                    Citas de Hoy
                  </div>
                  <v-btn
                    size="small"
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    @click="navegarA('/citas/nueva')"
                  >
                    Nueva Cita
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="cita in citasHoy"
                      :key="cita.id"
                      class="cursor-pointer hover-item"
                      @click="navegarA(`/citas/${cita.id}`)"
                    >
                      <template #prepend>
                        <v-avatar :color="getColorEspecie(cita.especie)" class="mr-3">
                          <v-icon color="white">{{ getIconoEspecie(cita.especie) }}</v-icon>
                        </v-avatar>
                      </template>
                      
                      <v-list-item-title>{{ cita.paciente }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <div>{{ cita.hora }} - {{ cita.propietario }}</div>
                        <div class="text-caption">{{ cita.motivo }}</div>
                      </v-list-item-subtitle>
  
                      <template #append>
                        <div class="text-right">
                          <v-chip
                            :color="getEstadoColor(cita.estado)"
                            size="small"
                            class="mb-1"
                          >
                            {{ cita.estado }}
                          </v-chip>
                          <div class="text-caption text-medium-emphasis">
                            Dr. {{ cita.veterinario }}
                          </div>
                        </div>
                      </template>
                    </v-list-item>
                    
                    <v-list-item v-if="citasHoy.length === 0">
                      <v-list-item-title class="text-center text-medium-emphasis">
                        <v-icon class="mr-2">mdi-calendar-check</v-icon>
                        No hay citas programadas para hoy
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
  
            <!-- Panel lateral -->
            <v-col cols="12" lg="4">
              <!-- Mascotas recientes -->
              <v-card class="mb-4">
                <v-card-title class="d-flex justify-space-between align-center">
                  <div>
                    <v-icon class="mr-2">mdi-paw</v-icon>
                    Mascotas Recientes
                  </div>
                  <v-btn
                    size="small"
                    variant="text"
                    @click="$router.push('/pacientes')"
                  >
                    Ver todas
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="mascota in mascotasRecientes"
                      :key="mascota.id"
                      class="cursor-pointer hover-item"
                      @click="$router.push(`/pacientes/${mascota.id}`)"
                    >
                      <template #prepend>
                        <v-avatar :color="getColorEspecie(mascota.especie)" size="32">
                          <v-icon color="white" size="18">{{ getIconoEspecie(mascota.especie) }}</v-icon>
                        </v-avatar>
                      </template>
                      
                      <v-list-item-title class="text-body-2">{{ mascota.nombre }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption">
                        {{ mascota.especie }} - {{ mascota.propietario }}
                      </v-list-item-subtitle>
  
                      <template #append>
                        <div class="text-caption text-medium-emphasis">
                          {{ mascota.fechaRegistro }}
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
  
              <!-- Actividad reciente -->
              <v-card>
                <v-card-title>
                  <v-icon class="mr-2">mdi-history</v-icon>
                  Actividad Reciente
                </v-card-title>
                <v-card-text>
                  <v-timeline density="compact">
                    <v-timeline-item
                      v-for="actividad in actividadReciente"
                      :key="actividad.id"
                      :dot-color="actividad.color"
                      size="small"
                    >
                      <template #icon>
                        <v-icon size="small">{{ actividad.icon }}</v-icon>
                      </template>
                      <div>
                        <div class="text-body-2 font-weight-medium">{{ actividad.titulo }}</div>
                        <div class="text-caption text-medium-emphasis">{{ actividad.tiempo }}</div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
  
          <!-- Accesos rápidos -->
          <v-row class="mt-4">
            <v-col cols="12">
              <v-card>
                <v-card-title>
                  <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
                  Accesos Rápidos
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6" sm="4" md="2">
                      <v-btn
                        block
                        variant="outlined"
                        class="mb-2 quick-action-btn"
                        @click="$router.push('/propietarios/nuevo')"
                      >
                        <div class="text-center">
                          <v-icon class="mb-1" size="24">mdi-account-plus</v-icon>
                          <div class="text-caption">Nuevo<br>Propietario</div>
                        </div>
                      </v-btn>
                    </v-col>
                    <v-col cols="6" sm="4" md="2">
                      <v-btn
                        block
                        variant="outlined"
                        class="mb-2 quick-action-btn"
                        @click="$router.push('/pacientes/nuevo')"
                      >
                        <div class="text-center">
                          <v-icon class="mb-1" size="24">mdi-paw</v-icon>
                          <div class="text-caption">Nueva<br>Mascota</div>
                        </div>
                      </v-btn>
                    </v-col>
                    <v-col cols="6" sm="4" md="2">
                      <v-btn
                        block
                        variant="outlined"
                        class="mb-2 quick-action-btn"
                        @click="navegarA('/citas/nueva')"
                      >
                        <div class="text-center">
                          <v-icon class="mb-1" size="24">mdi-calendar-plus</v-icon>
                          <div class="text-caption">Nueva<br>Cita</div>
                        </div>
                      </v-btn>
                    </v-col>
                    <v-col cols="6" sm="4" md="2">
                      <v-btn
                        block
                        variant="outlined"
                        class="mb-2 quick-action-btn"
                        @click="navegarA('/consultas/nueva')"
                      >
                        <div class="text-center">
                          <v-icon class="mb-1" size="24">mdi-stethoscope</v-icon>
                          <div class="text-caption">Nueva<br>Consulta</div>
                        </div>
                      </v-btn>
                    </v-col>
                    <v-col cols="6" sm="4" md="2">
                      <v-btn
                        block
                        variant="outlined"
                        class="mb-2 quick-action-btn"
                        @click="navegarA('/formulas/nueva')"
                      >
                        <div class="text-center">
                          <v-icon class="mb-1" size="24">mdi-prescription</v-icon>
                          <div class="text-caption">Nueva<br>Fórmula</div>
                        </div>
                      </v-btn>
                    </v-col>
                    <v-col cols="6" sm="4" md="2">
                      <v-btn
                        block
                        variant="outlined"
                        class="mb-2 quick-action-btn"
                        @click="navegarA('/facturas/nueva')"
                      >
                        <div class="text-center">
                          <v-icon class="mb-1" size="24">mdi-receipt</v-icon>
                          <div class="text-caption">Nueva<br>Factura</div>
                        </div>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useNotifications } from '@/composables/useNotifications'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const { showSuccess, showInfo } = useNotifications()
  
  // Variables reactivas
  const drawer = ref(true)
  const rail = ref(false)
  
  // Datos de ejemplo (estos vendrían de la API)
  const stats = ref({
    mascotas: 127,
    nuevasMascotasMes: 12,
    citasHoy: 8,
    citasPendientes: 3,
    propietarios: 89,
    propietariosActivos: 84,
    ingresosMes: '2,450',
    crecimientoMes: 15
  })
  
  const citasHoy = ref([
    {
      id: 1,
      paciente: 'Max',
      propietario: 'Juan Pérez',
      hora: '09:00',
      estado: 'confirmada',
      motivo: 'Revisión general',
      veterinario: 'García',
      especie: 'Perro'
    },
    {
      id: 2,
      paciente: 'Luna',
      propietario: 'María García',
      hora: '10:30',
      estado: 'programada',
      motivo: 'Vacunación',
      veterinario: 'Rodríguez',
      especie: 'Gato'
    },
    {
      id: 3,
      paciente: 'Rocky',
      propietario: 'Carlos López',
      hora: '14:00',
      estado: 'programada',
      motivo: 'Control post-operatorio',
      veterinario: 'García',
      especie: 'Perro'
    },
    {
      id: 4,
      paciente: 'Whiskers',
      propietario: 'Ana Martínez',
      hora: '15:30',
      estado: 'pendiente',
      motivo: 'Consulta dermatológica',
      veterinario: 'Hernández',
      especie: 'Gato'
    }
  ])
  
  const mascotasRecientes = ref([
    {
      id: 1,
      nombre: 'Bella',
      especie: 'Perro',
      propietario: 'Laura Ramírez',
      fechaRegistro: 'Hoy'
    },
    {
      id: 2,
      nombre: 'Mimi',
      especie: 'Gato',
      propietario: 'Pedro Sánchez',
      fechaRegistro: 'Ayer'
    },
    {
      id: 3,
      nombre: 'Coco',
      especie: 'Ave',
      propietario: 'Roberto Torres',
      fechaRegistro: '2 días'
    },
    {
      id: 4,
      nombre: 'Toby',
      especie: 'Perro',
      propietario: 'María González',
      fechaRegistro: '3 días'
    }
  ])
  
  const actividadReciente = ref([
    {
      id: 1,
      titulo: 'Nueva cita programada - Max',
      tiempo: 'Hace 5 minutos',
      icon: 'mdi-calendar-plus',
      color: 'success'
    },
    {
      id: 2,
      titulo: 'Consulta completada - Luna',
      tiempo: 'Hace 1 hora',
      icon: 'mdi-stethoscope',
      color: 'primary'
    },
    {
      id: 3,
      titulo: 'Nuevo propietario registrado',
      tiempo: 'Hace 2 horas',
      icon: 'mdi-account-plus',
      color: 'info'
    },
    {
      id: 4,
      titulo: 'Mascota registrada - Bella',
      tiempo: 'Hace 3 horas',
      icon: 'mdi-paw',
      color: 'warning'
    },
    {
      id: 5,
      titulo: 'Factura generada #001',
      tiempo: 'Hace 4 horas',
      icon: 'mdi-receipt',
      color: 'secondary'
    }
  ])
  
  // Computed
  const userAvatar = computed(() => {
    return `https://ui-avatars.com/api/?name=${authStore.userName}&background=1976d2&color=fff`
  })
  
  // Métodos
  const getEstadoColor = (estado) => {
    const colores = {
      programada: 'info',
      confirmada: 'success',
      completada: 'primary',
      cancelada: 'error',
      pendiente: 'warning'
    }
    return colores[estado] || 'grey'
  }
  
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
  
  const navegarA = (ruta) => {
    showInfo(`Funcionalidad "${ruta}" próximamente disponible`)
  }
  
  const handleLogout = async () => {
    await authStore.logout()
    showSuccess('Sesión cerrada exitosamente')
    router.push('/login')
  }
  
  // Lifecycle
  onMounted(() => {
    console.log('Dashboard cargado para:', authStore.userName)
  })
  </script>
  
  <style scoped>
  .v-navigation-drawer {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .v-navigation-drawer .v-list-item {
    color: white;
  }
  
  .v-navigation-drawer .v-list-item--active {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  .hover-item:hover {
    background-color: rgba(var(--v-theme-primary), 0.04) !important;
  }
  
  .quick-action-btn {
    height: auto !important;
    padding: 16px 8px !important;
  }
  
  .quick-action-btn:hover {
    background-color: rgba(var(--v-theme-primary), 0.04) !important;
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }
  </style>