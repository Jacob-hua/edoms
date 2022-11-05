import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { createPinia } from 'pinia';

import ElDesign from '@edoms/design';
import EdomsEditor from '@edoms/editor';
import EdomsElementPlusAdapter from '@edoms/element-plus-adapter';
import EdomsForm from '@edoms/form';

console.log('EdomsElementPlusAdapter');
import JsonViewer from 'vue3-json-viewer';

import App from './App.vue';
import router from './router';

import './assets/style/main.css';
import 'element-plus/theme-chalk/index.css';
import '@edoms/editor/src/theme/index.scss';
import 'vue3-json-viewer/dist/index.css';
const app = createApp(App);
app.use(JsonViewer);
app.use(createPinia());
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElDesign, EdomsElementPlusAdapter);
app.use(EdomsEditor);
app.use(EdomsForm);
app.mount('#app');
