import { App } from 'vue';
import Editor from './Editor.vue';
import Workshop from './components/Workshop.vue';

console.log(Workshop.name);
export { default as EdomsEditor } from './Editor.vue';
console.log(Editor.name);

export default {
  install: (app: App): void => {
    app.component(Editor.name, Editor);
  },
};
