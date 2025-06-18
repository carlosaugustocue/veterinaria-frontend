// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './styles/main.scss';


// Crear la aplicación
const app = createApp(App)

// Usar los plugins
app.use(createPinia())
app.use(router)
app.use(vuetify)

// Montar la aplicación
app.mount('#app')