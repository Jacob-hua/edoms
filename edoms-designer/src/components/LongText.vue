<template>
  <div class="container">
    <el-tooltip popper-class="popper" :placement="placement" :content="content" :effect="effect">
      <span class="content">{{ content }}</span>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup name="LongText">
export type EffectType = 'dark' | 'light';

export type PlacementType =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

withDefaults(
  defineProps<{
    effect?: EffectType;
    content: string;
    contentStyle?: Record<string, any>;
    linesClamp?: number;
    placement?: PlacementType;
  }>(),
  {
    contentStyle: () => ({ width: '96px', color: '', fontSize: '16px', textAlign: 'center' }),
    effect: () => 'dark',
    linesClamp: () => 1,
    placement: () => 'top',
  }
);
</script>

<style lang="scss" scoped>
.content {
  text-align: v-bind('contentStyle.textAlign');
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

.popper {
  position: relative !important;
  white-space: nowrap;
}
</style>
