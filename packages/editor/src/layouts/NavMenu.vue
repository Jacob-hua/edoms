<template>
  <div class="m-editor-nav-menu" :style="{ height: `${height}px` }">
    <div v-for="key in keys" :key="key" :class="`menu-${key}`" :style="`width: ${columnWidth?.[key]}px`">
      <ToolButton v-for="(item, index) in data[key]" :key="index" :data="item"></ToolButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType } from 'vue';

import ToolButton from '@editor/components/ToolButton.vue';
import { GetColumnWidth, MenuBarData, Services } from '../type';

export default defineComponent({
  name: 'NavMenu',
  expose: [],
  components: { ToolButton },

  props: {
    data: {
      type: Object as PropType<MenuBarData>,
      default: () => ({}),
    },

    height: {
      type: Number,
    },
  },

  setup(props) {
    const services = inject<Services>('services');

    return {
      keys: computed(() => Object.keys(props.data) as Array<keyof MenuBarData>),

      columnWidth: computed(() => services?.uiService.get<GetColumnWidth>('columnWidth')),
    };
  },
});
</script>
