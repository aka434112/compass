import { createApp } from 'vue'
import {
  router,
  registerGlobalPlugin,
  loadVueI18nLocaleMessages,
} from './plugins'

import 'element-plus/dist/index.css'

import App from './App.vue'

const app = createApp(App)
const mountApp = async () => {
  await loadVueI18nLocaleMessages()
  registerGlobalPlugin(app)
  await router.isReady()
  app.mount('#app')
}

mountApp()
