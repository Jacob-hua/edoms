import { App } from 'vue';

import EdomsForm from '@edoms/form';

import uiSelect from './fields/UISelect.vue';
import { i18nInstance } from './hooks/useI18n';
import CodeEditor from './layouts/CodeEditor.vue';
import { setConfig } from './utils/config';
import Editor from './Editor.vue';
import languages from './locales';
import type { InstallOptions } from './type';

import './theme/index.scss';
export type { MoveableOptions } from '@edoms/stage';
export * from './type';
export * from './utils';
export { default as EdomsEditor } from './Editor.vue';
export { default as EdomsCodeEditor } from './layouts/CodeEditor.vue';
export { default as editorService } from './services/editor';
export { default as propsService } from './services/props';
export { default as historyService } from './services/history';
export { default as storageService } from './services/storage';
export { default as eventsService } from './services/events';
export { default as uiService } from './services/ui';
export { default as ComponentListPanel } from './layouts/sidebar/ComponentListPanel.vue';
export { default as LayerPanel } from './layouts/sidebar/LayerPanel.vue';
export { default as PropsPanel } from './layouts/PropsPanel.vue';
export { default as ToolButton } from './components/ToolButton.vue';
export { default as ContentMenu } from './components/ContentMenu.vue';
export { default as Icon } from './components/Icon.vue';

const defaultInstallOpt: InstallOptions = {
  // @todo, 自定义图片上传方法等编辑器依赖的外部选项
};

export default {
  install: (app: App, opt?: InstallOptions): void => {
    app.use(EdomsForm);
    if (Reflect.has(app.config.globalProperties, '$i18n')) {
      i18nInstance.value = Reflect.get(app, '__VUE_I18N__');

      //将两个语言包合并
      Object.entries(languages).forEach(([lang, message]) => {
        i18nInstance.value?.global.mergeLocaleMessage(lang, message);
      });

      console.log('===>', app, i18nInstance.value);
    }

    const option = Object.assign(defaultInstallOpt, opt || {});
    app.config.globalProperties.$EDOMS_EDITOR = option;
    setConfig(option);
    app.component('EdomsEditor', Editor);
    app.component('EdomsCodeEditor', CodeEditor);
    app.component('MFieldsUiSelect', uiSelect);
  },
};
