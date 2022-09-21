<template>
  <GridView
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
  </GridView>
</template>

<script lang="ts" setup name="GridGroup">
import LongText from '@/components/LongText.vue'
import GridView from './GridView.vue'
import { Menu, Space, TileProps } from './type'
const props = withDefaults(
  defineProps<{
    titleProps?: TileProps
    menus?: Array<Menu<any>>
    data?: Array<any>
    height?: string
    spacing?: Space
  }>(),
  {
    titleProps: () => ({
      effect: 'dark',
      contentStyle: {
        width: '96px',
        color: '',
        fontSize: '16px',
      },
      linesClamp: 1,
      placement: 'top',
    }),
    menus: () => [],
    data: () => [],
    height: () => '',
    spacing: () => ({
      horizontal: '15px',
      vertical: '20px',
    }),
  }
)
const emit = defineEmits<{
  (event: 'loadMore', data: Array<any>): void
  (event: 'add'): void
}>()
const loadMore = () => {
  emit('loadMore', props.data)
}

const add = () => {
  emit('add')
}
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
