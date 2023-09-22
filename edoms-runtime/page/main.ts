import { createApp, defineAsyncComponent } from 'vue';
import GmctEditor from '@gmct/editor';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import Core from '@edoms/core';
import ElDesign from '@edoms/design';
import EdomsElementPlusAdapter from '@edoms/element-plus-adapter';
import { toLine } from '@edoms/utils';

import components from '../.edoms/async-comp-entry';
import plugins from '../.edoms/plugin-entry';

import request from './utils/request';
import AppComponent from './App.vue';

import 'element-plus/theme-chalk/index.css';

const edomsApp = createApp(AppComponent);

edomsApp.use(request);

edomsApp.use(ElementPlus, {
  locale: zhCn,
});
edomsApp.use(ElDesign, EdomsElementPlusAdapter);
edomsApp.use(GmctEditor);

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

const app = new Core({
  designWidth,
});

edomsApp.config.globalProperties.app = app;
edomsApp.provide('app', app);

edomsApp.mount('#app');
