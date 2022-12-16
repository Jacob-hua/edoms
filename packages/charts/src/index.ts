import { App } from 'vue';

import Charts from './Charts.vue';

export default {
  install: (app: App): void => {
    app.component('Charts', Charts);
  },
};
