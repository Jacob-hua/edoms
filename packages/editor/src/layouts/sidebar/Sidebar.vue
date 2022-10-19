<template>
  <el-tabs
    v-if="data.type === 'tabs' && data.items.length"
    v-model="activeTabName"
    class="m-editor-sidebar"
    type="card"
    tab-position="left"
  >
    <TabPane v-for="(item, index) in data.items" :key="index" :data="item">
      <template #layer-panel-header v-if="item === 'layer'">
        <slot name="layer-panel-header"></slot>
      </template>

      <template #component-list-panel-header v-if="item === 'component-list'">
        <slot name="component-list-panel-header"></slot>
      </template>
    </TabPane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { SideBarData } from '../../type';

import TabPane from './TabPane.vue';

export default defineComponent({
  name: 'MSidebar',
  components: { TabPane },
  expose: [],

  props: {
    data: {
      type: Object as PropType<SideBarData>,
      default: () => ({ type: 'tabs', status: '组件', items: ['component-list', 'layer'] }),
    },
  },

  setup(props) {
    const activeTabName = ref(props.data?.status);

    watch(
      () => props.data?.status,
      (status) => {
        activeTabName.value = status || '0';
      }
    );

    return {
      activeTabName,
    };
  },
});
</script>
