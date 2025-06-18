// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importar vistas
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'

// Vistas de Propietarios
import PropietariosView from '../views/PropietariosView.vue'
import PropietarioDetalleView from '../views/PropietarioDetalleView.vue'
import PropietarioFormView from '../views/PropietarioFormView.vue'

// Vistas de Pacientes/Mascotas
import PacientesView from '../views/PacientesView.vue'
import PacienteDetalleView from '../views/PacienteDetalleView.vue'
// import PacienteFormView from '../views/PacienteFormView.vue'
// import PacienteHistorialView from '../views/PacienteHistorialView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { 
        requiresAuth: false,
        title: 'Inicio'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { 
        requiresAuth: false, 
        hideForAuth: true,
        title: 'Iniciar Sesión'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { 
        requiresAuth: false, 
        hideForAuth: true,
        title: 'Registrarse'
      }
    },

    // Rutas protegidas
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { 
        requiresAuth: true,
        title: 'Dashboard'
      }
    },

    // Rutas de Propietarios
    {
      path: '/propietarios',
      name: 'propietarios',
      component: PropietariosView,
      meta: { 
        requiresAuth: true,
        title: 'Propietarios'
      }
    },
    {
      path: '/propietarios/nuevo',
      name: 'propietario-nuevo',
      component: PropietarioFormView,
      meta: { 
        requiresAuth: true,
        title: 'Nuevo Propietario'
      }
    },
    {
      path: '/propietarios/:id',
      name: 'propietario-detalle',
      component: PropietarioDetalleView,
      meta: { 
        requiresAuth: true,
        title: 'Detalle Propietario'
      }
    },
    {
      path: '/propietarios/:id/editar',
      name: 'propietario-editar',
      component: PropietarioFormView,
      meta: { 
        requiresAuth: true,
        title: 'Editar Propietario'
      }
    },

    // Rutas de Pacientes/Mascotas
    {
      path: '/pacientes',
      name: 'pacientes',
      component: PacientesView,
      meta: { 
        requiresAuth: true,
        title: 'Mascotas'
      }
    },
    // {
    //   path: '/pacientes/nuevo',
    //   name: 'paciente-nuevo',
    //   component: PacienteFormView,
    //   meta: { 
    //     requiresAuth: true,
    //     title: 'Nueva Mascota'
    //   }
    // },
    {
      path: '/pacientes/:id',
      name: 'paciente-detalle',
      component: PacienteDetalleView,
      meta: { 
        requiresAuth: true,
        title: 'Detalle Mascota'
      }
    },
    // {
    //   path: '/pacientes/:id/editar',
    //   name: 'paciente-editar',
    //   component: PacienteFormView,
    //   meta: { 
    //     requiresAuth: true,
    //     title: 'Editar Mascota'
    //   }
    // },
    // {
    //   path: '/pacientes/:id/historial',
    //   name: 'paciente-historial',
    //   component: PacienteHistorialView,
    //   meta: { 
    //     requiresAuth: true,
    //     title: 'Historial Médico'
    //   }
    // },

    // Ruta por defecto - redirigir a dashboard si está autenticado, sino a login
    {
      path: '/app',
      redirect: (to) => {
        const authStore = useAuthStore()
        return authStore.isAuthenticated ? '/dashboard' : '/login'
      }
    },

    // Capturar rutas no encontradas
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: (to) => {
        const authStore = useAuthStore()
        return authStore.isAuthenticated ? '/dashboard' : '/'
      }
    }
  ],
  
  // Configuración adicional para scroll behavior
  scrollBehavior(to, from, savedPosition) {
    // Si hay una posición guardada (por ejemplo, volver atrás), usarla
    if (savedPosition) {
      return savedPosition
    }
    // Si hay un hash (anchor), navegar a él
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Por defecto, ir al top
    return { top: 0 }
  }
})

// Guard de navegación global mejorado
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Si está autenticado y trata de acceder a login/register
  if (to.meta.hideForAuth && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  // Si está autenticado pero no hay datos del usuario, cargarlos
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.error('Error al cargar usuario:', error)
      // Si falla la carga del usuario, cerrar sesión
      authStore.logout()
      next('/login')
      return
    }
  }

  // Establecer título de la página
  if (to.meta.title) {
    document.title = `${to.meta.title} - Sistema Veterinaria`
  } else {
    document.title = 'Sistema Veterinaria'
  }

  next()
})

// Guard después de navegación para analytics o logging
router.afterEach((to, from, failure) => {
  if (failure) {
    console.error('Error en navegación:', failure)
  }
})

export default router