import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'

import 'element-plus/theme-chalk/index.css'

import Components from './EdComponent'
import Button from './EdButton'
import Text from './EdText'

const app = createApp(App)
app.use(ElementPlus)

app.component(Components.name, Components)
app.component(Button.name, Button)
app.component(Text.name, Text)
app.mount('#app')
