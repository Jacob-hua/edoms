import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'

import 'element-plus/theme-chalk/index.css'

import Components from './component'
import Button from './button'
import Text from './text'

const app = createApp(App)
app.use(ElementPlus)

app.component(Components.name, Components)
app.component(Button.name, Button)
app.component(Text.name, Text)
app.mount('#app')
