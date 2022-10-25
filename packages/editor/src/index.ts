import { App } from 'vue';

import Code from './fields/Code.vue';
import CodeLink from './fields/CodeLink.vue';
import CodeSelect from './fields/CodeSelect.vue';
import uiSelect from './fields/UISelect.vue';
import CodeEditor from './layouts/CodeEditor.vue';
import { setConfig } from './utils/config';
import Editor from './Editor.vue';
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
export { default as codeBlockService } from './services/codeBlock';
export { default as ComponentListPanel } from './layouts/sidebar/ComponentListPanel.vue';
export { default as LayerPanel } from './layouts/sidebar/LayerPanel.vue';
export { default as CodeSelect } from './fields/CodeSelect.vue';
export { default as CodeBlockList } from './layouts/sidebar/code-block/CodeBlockList.vue';
export { default as PropsPanel } from './layouts/PropsPanel.vue';
export { default as ToolButton } from './components/ToolButton.vue';
export { default as ContentMenu } from './components/ContentMenu.vue';
export { default as Icon } from './components/Icon.vue';

const defaultInstallOpt: InstallOptions = {
  // @todo, 自定义图片上传方法等编辑器依赖的外部选项
};

export default {
  install: (app: App, opt?: InstallOptions): void => {
    const option = Object.assign(defaultInstallOpt, opt || {});

    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$EDOMS_EDITOR = option;
    setConfig(option);
    app.component(Editor.name, Editor);
    app.component('MFieldsUiSelect', uiSelect);
    app.component('MFieldsCodeLink', CodeLink);
    app.component('MFieldsVsCode', Code);
    app.component('EdomsCodeEditor', CodeEditor);
    app.component('MFieldsCodeSelect', CodeSelect);
  },
};
