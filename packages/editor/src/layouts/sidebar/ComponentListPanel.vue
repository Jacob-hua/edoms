<template>
  <ElScrollbar>
    <slot name="component-list-panel-header"></slot>

    <ElCollapse class="ui-component-panel" :model-value="collapseValue">
      <ElInput
        v-model="searchText"
        :placeholder="t('editor.rules.请输入组件名称')"
        class="search-input"
        size="small"
        clearable
        :prefix-icon="Search"
      />
      <template v-for="(group, index) in list">
        <ElCollapseItem v-if="group.items && group.items.length" :key="index" :name="`${index}`">
          <template #title><MIcon :icon="Grid"></MIcon>{{ group.title }}</template>
          <div
            v-for="item in group.items"
            :key="item.type"
            class="component-item"
            draggable="true"
            @click="appendComponent(item)"
            @dragstart="dragstartHandler(item, $event)"
            @dragend="dragendHandler"
            @drag="dragHandler"
          >
            <slot name="component-list-item" :component="item">
              <MIcon :icon="item.icon"></MIcon>

              <ElTooltip effect="dark" placement="bottom" :content="item.text">
                <span>{{ item.text }}</span>
              </ElTooltip>
            </slot>
          </div>
        </ElCollapseItem>
      </template>
    </ElCollapse>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { Grid, Search } from '@element-plus/icons-vue';
import serialize from 'serialize-javascript';

import { ElCollapse, ElCollapseItem, ElInput, ElScrollbar, ElTooltip } from '@edoms/design';
import type StageCore from '@edoms/stage';
import { removeClassNameByClassName } from '@edoms/utils';

import MIcon from '../../components/Icon.vue';
import useI18n from '../../hooks/useI18n';
import type { ComponentGroup, ComponentItem, Services, StageOptions } from '../../type';
const { t } = useI18n();

const searchText = ref('');
const services = inject<Services>('services');
const stageOptions = inject<StageOptions>('stageOptions');

const stage = computed(() => services?.editorService.get<StageCore>('stage'));
const list = computed(() =>
  services?.componentListService.getList().map((group: ComponentGroup) => ({
    ...group,
    items: group.items.filter((item: ComponentItem) => item.text.includes(searchText.value)),
  }))
);
const collapseValue = computed(() =>
  Array(list.value?.length)
    .fill(1)
    .map((x, i) => `${i}`)
);

let timeout: NodeJS.Timeout | undefined;
let clientX: number;
let clientY: number;

const appendComponent = ({ text, type, data = {} }: ComponentItem): void => {
  services?.editorService.add({
    name: text,
    type,
    ...data,
  });
};

const dragstartHandler = ({ text, type, data = {} }: ComponentItem, e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'data',
      serialize({
        name: text,
        type,
        ...data,
      }).replace(/"(\w+)":\s/g, '$1: ')
    );
  }
};

const dragendHandler = () => {
  if (timeout) {
    globalThis.clearTimeout(timeout);
    timeout = undefined;
  }
  const doc = stage.value?.renderer.contentWindow?.document;
  if (doc && stageOptions) {
    removeClassNameByClassName(doc, stageOptions.containerHighlightClassName);
  }
  clientX = 0;
  clientY = 0;
};

const dragHandler = (e: DragEvent) => {
  if (e.clientX !== clientX || e.clientY !== clientY) {
    clientX = e.clientX;
    clientY = e.clientY;
    if (timeout) {
      globalThis.clearTimeout(timeout);
      timeout = undefined;
    }
    return;
  }

  if (timeout || !stage.value) return;

  timeout = stage.value.getAddContainerHighlightClassNameTimeout(e);
};
</script>
