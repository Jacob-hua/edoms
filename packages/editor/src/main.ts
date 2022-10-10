import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import EdomsComponents from '@edoms/components'

import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(EdomsComponents)
app.mount('#app')
