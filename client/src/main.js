// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { VueReCaptcha } from 'vue-recaptcha-v3'

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(VueReCaptcha, {
    siteKey: 'TU_SITE_KEY',          // reemplaza con tu site key
    loaderOptions: {
      autoHideBadge: false,          // ahora el badge será visible
      hideOnError: false
    }
  })
  .mount('#app')