<template>
  <framework :code-options="codeOptions">
    <template #nav>
      <slot name="nav" :editor-service="editorService"><nav-menu :data="menu"></nav-menu></slot>
    </template>

    <template #sidebar>
      <slot name="sidebar" :editor-service="editorService">
        <sidebar :data="sidebar">
          <template #layer-panel-header>
            <slot name="layer-panel-header"></slot>
          </template>

          <template #layer-node-content="{ node, data }">
            <slot name="layer-node-content" :data="data" :node="node"></slot>
          </template>

          <template #component-list-panel-header>
            <slot name="component-list-panel-header"></slot>
          </template>

          <template #component-list-item="{ component }">
            <slot name="component-list-item" :component="component"></slot>
          </template>

          <template #code-block-panel-header>
            <slot name="code-block-panel-header"></slot>
          </template>

          <template #code-block-panel-tool="{ id, data }">
            <slot :id="id" name="code-block-panel-tool" :data="data"></slot>
          </template>

          <template #code-block-edit-panel-header="{ id }">
            <slot :id="id" name="code-block-edit-panel-header"></slot>
          </template>
        </sidebar>
      </slot>
    </template>

    <template #workspace>
      <slot name="workspace" :editor-service="editorService">
        <workspace @runtime-ready="$emit('runtime-ready')">
          <template #stage><slot name="stage"></slot></template>
          <template #workspace-content><slot name="workspace-content" :editor-service="editorService"></slot></template>
        </workspace>
      </slot>
    </template>

    <template #props-panel>
      <slot name="props-panel">
        <props-panel @mounted="(instance: any) => $emit('props-panel-mounted', instance)">
          <template #props-panel-header>
            <slot name="props-panel-header"></slot>
          </template>
        </props-panel>
      </slot>
    </template>

    <template #empty><slot name="empty" :editor-service="editorService"></slot></template>
  </framework>
</template>

<script lang="ts" setup>
import { onUnmounted, provide, reactive, toRaw, watch } from 'vue';

import { EventOption, MethodOption } from '@edoms/core';
import type { FormConfig } from '@edoms/form';
import type { MApp, MNode } from '@edoms/schema';
import type StageCore from '@edoms/stage';
import { CONTAINER_HIGHLIGHT_CLASS, ContainerHighlightType, MoveableOptions } from '@edoms/stage';

import Framework from './layouts/Framework.vue';
import NavMenu from './layouts/NavMenu.vue';
import PropsPanel from './layouts/PropsPanel.vue';
import Sidebar from './layouts/sidebar/Sidebar.vue';
import Workspace from './layouts/workspace/Workspace.vue';
import codeBlockService from './services/codeBlock';
import componentListService from './services/componentList';
import editorService from './services/editor';
import eventsService from './services/events';
import historyService from './services/history';
import propsService from './services/props';
import storageService from './services/storage';
import uiService from './services/ui';
import type { ComponentGroup, MenuBarData, MenuButton, MenuComponent, Request, Services, SideBarData } from './type';

const props = withDefaults(
  defineProps<{
    modelValue: MApp;
    componentGroupList?: ComponentGroup[];
    sidebar?: SideBarData;
    layerContentMenu?: (MenuButton | MenuComponent)[];
    stageContentMenu?: (MenuButton | MenuComponent)[];
    menu?: MenuBarData;
    render?: () => HTMLDivElement;
    runtimeUrl?: string;
    autoScrollIntoView?: boolean;
    propsConfigs?: Record<string, FormConfig>;
    propsValues?: Record<string, MNode>;
    eventMethodList?: Record<string | number | symbol, any>;
    moveableOptions?: MoveableOptions | ((core?: StageCore) => MoveableOptions);
    defaultSelected?: number | string;
    canSelect?: (el: HTMLElement) => boolean | Promise<boolean>;
    isContainer?: (el: HTMLElement) => boolean | Promise<boolean>;
    containerHighlightClassName?: string;
    containerHighlightDuration?: number;
    containerHighlightType?: ContainerHighlightType;
    stageRect?:
      | string
      | {
          width: number;
          height: number;
        };
    codeOptions?: Record<string | number | symbol, any>;
    updateDragEl?: (el: HTMLDivElement, target: HTMLElement) => void;
    request?: Request;
  }>(),
  {
    componentGroupList: () => [],
    layerContentMenu: () => [],
    stageContentMenu: () => [],
    menu: () => ({ left: [], right: [] }),
    propsConfigs: () => ({}),
    propsValues: () => ({}),
    eventMethodList: () => ({}),
    canSelect: (el: HTMLElement) => Boolean(el.id),
    isContainer: (el: HTMLElement) => el.classList?.contains('edoms-ui-container'),
    containerHighlightClassName: () => CONTAINER_HIGHLIGHT_CLASS,
    containerHighlightDuration: () => 800,
    containerHighlightType: () => ContainerHighlightType.DEFAULT,
    codeOptions: () => ({}),
  }
);

const emit = defineEmits<{
  (event: 'props-panel-mounted'): void;
  (event: 'update:modelValue', value: any): void;
  (event: 'runtime-ready'): void;
}>();

editorService.on('root-change', (value) => {
  const node = editorService.get<MNode | null>('node');
  const nodeId = node?.id || props.defaultSelected;
  if (nodeId && node !== value) {
    editorService.select(nodeId);
  } else {
    editorService.set('nodes', [value]);
  }

  emit('update:modelValue', toRaw(editorService.get('root')));
});

// 初始值变化，重新设置节点信息
watch(
  () => props.modelValue,
  (modelValue) => {
    editorService.set('root', modelValue);
  },
  {
    immediate: true,
  }
);

watch(
  () => props.componentGroupList,
  (componentGroupList) => componentListService.setList(componentGroupList),
  {
    immediate: true,
  }
);

watch(
  () => ({ configs: props.propsConfigs, request: props.request }),
  ({ configs, request }) => propsService.setPropsConfigs(configs, request),
  {
    immediate: true,
  }
);

watch(
  () => props.propsValues,
  (values) => propsService.setPropsValues(values),
  {
    immediate: true,
  }
);

watch(
  () => props.eventMethodList,
  (eventMethodList) => {
    const eventsList: Record<string, EventOption[]> = {};
    const methodsList: Record<string, MethodOption[]> = {};

    Object.keys(eventMethodList).forEach((type: string) => {
      eventsList[type] = eventMethodList[type].events;
      methodsList[type] = eventMethodList[type].methods;
    });

    eventsService.setEvents(eventsList);
    eventsService.setMethods(methodsList);
  },
  {
    immediate: true,
  }
);

watch(
  () => props.defaultSelected,
  (defaultSelected) => defaultSelected && editorService.select(defaultSelected),
  {
    immediate: true,
  }
);

watch(
  () => props.stageRect,
  (stageRect) => stageRect && uiService.set('stageRect', stageRect),
  {
    immediate: true,
  }
);
onUnmounted(() => {
  editorService.destroy();
  historyService.destroy();
  propsService.destroy();
  uiService.destroy();
  componentListService.destroy();
  storageService.destroy();
  codeBlockService.destroy();
});

const services: Services = {
  componentListService,
  eventsService,
  historyService,
  propsService,
  editorService,
  uiService,
  storageService,
  codeBlockService,
};

const stageOptions = reactive({
  runtimeUrl: props.runtimeUrl,
  autoScrollIntoView: props.autoScrollIntoView,
  render: props.render,
  moveableOptions: props.moveableOptions,
  canSelect: props.canSelect,
  updateDragEl: props.updateDragEl,
  isContainer: props.isContainer,
  containerHighlightClassName: props.containerHighlightClassName,
  containerHighlightDuration: props.containerHighlightDuration,
  containerHighlightType: props.containerHighlightType,
});

provide('services', services);
provide('stageOptions', stageOptions);
provide('layerContentMenu', props.layerContentMenu);
provide('stageContentMenu', props.stageContentMenu);
defineExpose(services);
</script>
