import { createApp, defineAsyncComponent } from 'vue';

import Core from '@edoms/core';
import { getUrlParam, toLine } from '@edoms/utils';

import components from '../.edoms/async-comp-entry';
import plugins from '../.edoms/plugin-entry';

import request from './utils/request';
import AppComponent from './App.vue';
import { getLocalConfig } from './utils';

const edomsApp = createApp(AppComponent);

edomsApp.use(request);

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
  config: ((getUrlParam('localPreview') ? getLocalConfig() : window.edomsDSL) || [])[0] || {},
  curPage: getUrlParam('page'),
  requestConfig: {
    baseURL: '',
    timeout: 1000 * 10,
    retry: 2,
    retryDelay: 1000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  },
});

edomsApp.config.globalProperties.app = app;
edomsApp.provide('app', app);

edomsApp.mount('#app');
