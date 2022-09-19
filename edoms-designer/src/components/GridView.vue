<template>
  <GridGroup
    :spacing="spacing"
    :title-props="titleProps"
    :height="height"
    :data="data"
    :menus="menus"
    @load-more="loadMore"
  >
    <template #firstBox>
      <div class="slot-container" @click="add">
        <div class="app-add-box">
          <el-icon :size="55"><Plus /></el-icon>
        </div>
        <LongText
          :lines-clamp="titleProps.linesClamp"
          :content-style="{ ...titleProps.contentStyle }"
          :effect="titleProps.effect"
          :placement="titleProps.placement"
          content="新建应用"
        ></LongText>
      </div>
    </template>
    <template #iconSlot> <slot name="iconSlot"></slot></template>
  </GridGroup>
</template>

<script lang="ts">
import LongText from '@/components/LongText.vue'
import GridGroup from './GridGroup.vue'
import { defineComponent, PropType } from 'vue'
import { Menu, Space, TileProps } from './type'

export default defineComponent({
  components: { LongText, GridGroup },
  expose: [],
  props: {
    titleProps: {
      type: Object as PropType<TileProps>,
      default: () => ({
        effect: 'dark',
        contentStyle: {
          width: '96px',
          color: '',
          fontSize: '16px',
        },
        linesClamp: 1,
        placement: 'top',
      }),
    },
    menus: {
      type: Array as PropType<Array<Menu>>,
      required: true,
      default: () => [],
    },
    data: {
      type: Array as PropType<any>,
      default: () => [],
    },
    height: {
      type: String as PropType<string>,
      default: () => '',
    },
    spacing: {
      type: Object as PropType<Space>,
      default: () => ({
        horizontal: '15px',
        vertical: '20px',
      }),
    },
  },
  emits: ['loadMore', 'add'],
  setup(props, { emit }) {
    const loadMore = () => {
      emit('loadMore', props.data)
    }

    const add = () => {
      emit('add')
    }
    return {
      loadMore,
      add,
    }
  },
})
</script>

<style scoped lang="scss">
.app-add-box {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
}
.slot-container {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: v-bind('spacing.horizontal');
  margin-bottom: v-bind('spacing.vertical');
}
</style>
