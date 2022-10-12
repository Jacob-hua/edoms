import { App } from 'vue';
import Editor from './Editor.vue';

export { default as EdomsEditor } from './Editor.vue';

export default {
  install: (app: App): void => {
    app.component(Editor.name, Editor);
  },
};
