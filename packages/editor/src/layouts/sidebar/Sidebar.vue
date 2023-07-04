<template>
  <ElTabs
    v-if="data.type === 'tabs' && data.items.length"
    v-model="activeTabName"
    class="edoms-editor-sidebar"
    type="card"
    tab-position="left"
  >
    <tab-pane v-for="(item, index) in data.items" :key="index" :data="item">
      <template v-if="item === 'layer'" #layer-panel-header>
        <slot name="layer-panel-header"></slot>
      </template>

      <template v-if="item === 'layer'" #layer-node-content="{ node, data }">
        <slot name="layer-node-content" :data="data" :node="node"></slot>
      </template>

      <template v-if="item === 'component-list'" #component-list-panel-header>
        <slot name="component-list-panel-header"></slot>
      </template>

      <template v-if="item === 'component-list'" #component-list-item="{ component }">
        <slot name="component-list-item" :component="component"></slot>
      </template>

      <template v-if="item === 'code-block'" #code-block-panel-header>
        <slot name="code-block-panel-header"></slot>
      </template>

      <template v-if="item === 'code-block'" #code-block-panel-tool="{ id, data }">
        <slot :id="id" name="code-block-panel-tool" :data="data"></slot>
      </template>

      <template v-if="item === 'code-block'" #code-block-edit-panel-header="{ id }">
        <slot :id="id" name="code-block-edit-panel-header"></slot>
      </template>
    </tab-pane>
  </ElTabs>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { ElTabs } from '@edoms/design';

import { SideBarData } from '../../type';

import TabPane from './TabPane.vue';
const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    data?: SideBarData;
  }>(),
  {
    data: () => ({
      type: 'tabs',
      status: '组件',
      items: [
        'component-list',
        'layer',
        // 'code-block'
      ],
    }),
  }
);

const activeTabName = ref(t('editor.module'));

watch(
  () => props.data.status,
  () => {
    activeTabName.value = t('editor.module') || '0';
  }
);

defineExpose({
  activeTabName,
});
</script>
