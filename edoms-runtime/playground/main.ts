import { createApp } from 'vue';

import { toLine } from '@edoms/utils';

import App from './App.vue';

Promise.all([import('../.edoms/comp-entry'), import('../.edoms/plugin-entry')]).then(([components, plugins]) => {
  const edomsApp = createApp(App);

  Object.entries(components.default).forEach(([type, component]: [string, any]) => {
    edomsApp.component(`edoms-ui-${toLine(type)}`, component);
  });

  Object.values(plugins.default).forEach((plugin: any) => {
    edomsApp.use(plugin);
  });

  edomsApp.mount('#app');
});
