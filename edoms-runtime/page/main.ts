import { createApp, defineAsyncComponent } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import Core from '@edoms/core';
import ElDesign from '@edoms/design';
import EdomsElementPlusAdapter from '@edoms/element-plus-adapter';
import { getUrlParam, toLine } from '@edoms/utils';

import components from '../.edoms/async-comp-entry';
import plugins from '../.edoms/plugin-entry';

import request from './utils/request';
import AppComponent from './App.vue';
import { getLocalConfig } from './utils';

const edomsApp = createApp(AppComponent);

edomsApp.use(request);

edomsApp.use(ElementPlus, {
  locale: zhCn,
});
edomsApp.use(ElDesign, EdomsElementPlusAdapter);

Object.entries(components).forEach(([type, component]: [string, any]) => {
  edomsApp.component(
    `edoms-ui-${toLine(type)}`,
    defineAsyncComponent(() => component)
  );
});

Object.values(plugins).forEach((plugin: any) => {
  edomsApp.use(plugin);
});

const designWidth = document.documentElement.getBoundingClientRect().width;

window.addEventListener('message', (event) => {
  console.log('我收到了', event);
});

const app = new Core({
  designWidth,
  config: ((getUrlParam('localPreview') ? getLocalConfig() : window.edomsDSL) || [])[0] || {},
  curPage: getUrlParam('page'),
});

edomsApp.config.globalProperties.app = app;
edomsApp.provide('app', app);

edomsApp.mount('#app');
