import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import EdComponents from '@edoms/components'

import './assets/main.css'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

const { component, button, page } = EdComponents
app.use(ElementPlus)
app.component(component.name, component)
app.component(button.name, button)
app.component(page.name, page)
app.mount('#app')
