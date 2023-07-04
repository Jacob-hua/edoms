// import { App } from 'vue';

import EdomsForm from '@edoms/form';

import uiSelect from './fields/UISelect.vue';
import CodeEditor from './layouts/CodeEditor.vue';
import en from './locales/en';
import zhCN from './locales/zh-CN';
import { setConfig } from './utils/config';
import Editor from './Editor.vue';
import type { InstallOptions } from './type';

import './theme/index.scss';
// import i18n from './locales';
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
  install: (app: any, opt?: InstallOptions): void => {
    app.use(EdomsForm);
    if (app.__VUE_I18N__) {
      //将两个语言包合并
      app.__VUE_I18N__.global.messages.value.en = Object.assign(app.__VUE_I18N__.global.messages.value.en, en);
      app.__VUE_I18N__.global.messages.value.zh_CN = Object.assign(app.__VUE_I18N__.global.messages.value.zh_CN, zhCN);
    }
    console.log(zhCN);
    console.log(app.__VUE_I18N__);

    const option = Object.assign(defaultInstallOpt, opt || {});
    app.config.globalProperties.$EDOMS_EDITOR = option;
    setConfig(option);
    app.component('EdomsEditor', Editor);
    app.component('EdomsCodeEditor', CodeEditor);
    app.component('MFieldsUiSelect', uiSelect);
  },
};
