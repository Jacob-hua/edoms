<template>
  <div class="container">
    <el-tooltip popper-class="popperStyle" :placement="placement" :content="content" :effect="effect">
      <span class="text-hidden">{{ content }}</span>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { EffectType, PlacementType } from '@/components/type'

export default defineComponent({
  name: 'LongText',
  expose: [],
  props: {
    effect: {
      type: String as PropType<EffectType>,
      default: () => 'dark',
    },
    content: {
      type: String as PropType<string>,
      required: true,
    },
    contentStyle: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({
        width: '96px',
        color: '',
        fontSize: '16px',
      }),
    },
    linesClamp: {
      type: Number as PropType<number>,
      default: () => 1,
    },
    placement: {
      type: String as PropType<PlacementType>,
      default: () => 'top',
    },
  },
})
</script>

<style lang="scss">
.text-hidden {
  text-align: center;
  width: v-bind('contentStyle.width');
  color: v-bind('contentStyle.color');
  font-size: v-bind('contentStyle.fontSize');
  margin-bottom: v-bind('contentStyle.marginBottom');
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: v-bind(linesClamp);
  overflow: hidden;
  word-break: break-all;
}
.popperStyle {
  position: relative !important;
  white-space: nowrap;
}
</style>
