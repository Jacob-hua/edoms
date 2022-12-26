import { App } from 'vue';

import Charts from './Charts.vue';

export { default as EdomsCharts } from './Charts.vue';

export default {
  install: (app: App): void => {
    app.component('EdomsCharts', Charts);
  },
};
