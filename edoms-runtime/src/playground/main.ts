import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';

import 'element-plus/theme-chalk/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// ! 这里的加载必须是异步的才行，否则会导致元数据无法加载
import('@edoms/components').then((entry) => {
  const edomsApp = createApp(App);
  edomsApp.use(ElementPlus, {
    locale: zhCn,
  });
  edomsApp.use(entry.default);
  edomsApp.mount('#app');
});
