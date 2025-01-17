<template>
  <ElTabPane v-if="config" :name="config.text">
    <template #label>
      <div :key="config.text">
        <m-icon v-if="config.icon" :icon="config.icon"></m-icon>
        <div v-if="config.text" class="edoms-editor-tab-panel-title">{{ config.text }}</div>
      </div>
    </template>

    <component :is="config.component" v-bind="config.props || {}" v-on="config?.listeners || {}">
      <template v-if="data === 'component-list' || config.slots?.componentListPanelHeader" #component-list-panel-header>
        <slot v-if="data === 'component-list'" name="component-list-panel-header"></slot>
        <component v-else-if="config.slots?.componentListPanelHeader" :is="config.slots.componentListPanelHeader" />
      </template>

      <template
        v-if="data === 'component-list' || config.slots?.componentListItem"
        #component-list-item="{ component }"
      >
        <slot v-if="data === 'component-list'" name="component-list-item" :component="component"></slot>
        <component
          v-else-if="config.slots?.componentListItem"
          :is="config.slots.componentListItem"
          :component="component"
        />
      </template>

      <template v-if="data === 'layer' || config.slots?.layerPanelHeader" #layer-panel-header>
        <slot v-if="data === 'layer'" name="layer-panel-header"></slot>
        <component v-else-if="config.slots?.layerPanelHeader" :is="config.slots.layerPanelHeader" />
      </template>

      <template
        v-if="data === 'layer' || config.slots?.layerNodeContent"
        #layer-node-content="{ data: nodeData, node }"
      >
        <slot v-if="data === 'layer'" name="layer-node-content" :data="nodeData" :node="node"></slot>
        <component
          v-else-if="config.slots?.layerNodeContent"
          :is="config.slots.layerNodeContent"
          :data="nodeData"
          :node="node"
        />
      </template>
    </component>
  </ElTabPane>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Coin, Files } from '@element-plus/icons-vue';

import { ElTabPane } from '@edoms/design';

import MIcon from '../../components/Icon.vue';
import useI18n from '../../hooks/useI18n';
import { SideComponent, SideItem } from '../../type';

import ComponentListPanel from './ComponentListPanel.vue';
import LayerPanel from './LayerPanel.vue';
const { t } = useI18n();
const props = defineProps<{
  data?: SideItem;
}>();

const config = computed<SideComponent | undefined>(() => {
  if (typeof props.data !== 'string') {
    return props.data;
  }

  switch (props.data) {
    case 'component-list':
      return {
        type: 'component',
        icon: Coin,
        text: t('editor.组件'),
        component: ComponentListPanel,
        slots: {},
      };
    case 'layer':
      return {
        type: 'component',
        icon: Files,
        text: t('editor.已选组件'),
        component: LayerPanel,
        slots: {},
      };
    default:
      return undefined;
  }
});
</script>
