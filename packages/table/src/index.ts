import { App } from 'vue';

import Table from './Table.vue';

export { default as EdomsTable } from './Table.vue';

export default {
  install(app: App) {
    app.component('EdomsTable', Table);
  },
};
