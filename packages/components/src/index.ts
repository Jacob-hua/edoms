import Page from './page';
import Button from './button';
import Text from './text';
import { App } from 'vue';

export default {
  install: (app: App): void => {
    app.component(Page.name, Page);
    app.component(Button.name, Button);
    app.component(Text.name, Text);
  },
};
