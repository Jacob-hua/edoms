import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import EdomsComponents from '@edoms/components'

import 'element-plus/theme-chalk/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const edomsApp = createApp(App)
edomsApp.use(ElementPlus, {
  locale: zhCn,
})
edomsApp.use(EdomsComponents)
edomsApp.mount('#app')
