import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import EdomsEditor from '@edoms/editor';

import 'element-plus/theme-chalk/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(EdomsEditor);
app.mount('#app');
