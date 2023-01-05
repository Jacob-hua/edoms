import { createApp } from 'vue';
import JsonViewer from 'vue3-json-viewer';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import ElDesign from '@edoms/design';
import EdomsEditor from '@edoms/editor';
import EdomsElementPlusAdapter from '@edoms/element-plus-adapter';

import App from './App.vue';
import router from './router';

import './assets/style/main.css';
import 'element-plus/theme-chalk/index.css';
import '@edoms/editor/src/theme/index.scss';
import 'vue3-json-viewer/dist/index.css';

// @ts-ignore
globalThis.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new JsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HtmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker();
    }
    return new EditorWorker();
  },
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(JsonViewer);
app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElDesign, EdomsElementPlusAdapter);
app.use(EdomsEditor);
app.mount('#app');
