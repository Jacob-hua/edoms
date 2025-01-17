import { createApp } from 'vue';
import GmctEditor from '@gmct/editor';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import { toLine } from '@edoms/utils';

import App from './App.vue';

import '@gmct/editor/dist/style.css';
import 'element-plus/theme-chalk/index.css';

Promise.all([import('../.edoms/comp-entry'), import('../.edoms/plugin-entry')]).then(([components, plugins]) => {
  const edomsApp = createApp(App);

  edomsApp.use(ElementPlus, {
    locale: zhCn,
  });
  edomsApp.use(GmctEditor);

  Object.entries(components.default).forEach(([type, component]: [string, any]) => {
    edomsApp.component(`edoms-ui-${toLine(type)}`, component);
  });

  Object.values(plugins.default).forEach((plugin: any) => {
    edomsApp.use(plugin);
  });
  edomsApp.mount('#app');
});
