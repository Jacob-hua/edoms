<template>
  <div class="container">
    <el-tooltip popper-class="popper" :placement="placement" :content="content" :effect="effect">
      <span class="content">{{ content }}</span>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup name="LongText">
import { EffectType, PlacementType } from '@/components/type';
withDefaults(
  defineProps<{
    effect?: EffectType;
    content: string;
    contentStyle?: Record<string, any>;
    linesClamp?: number;
    placement?: PlacementType;
  }>(),
  {
    contentStyle: () => ({ width: '96px', color: '', fontSize: '16px' }),
    effect: () => 'dark',
    linesClamp: () => 1,
    placement: () => 'top',
  }
);
</script>

<style lang="scss">
.content {
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

.popper {
  position: relative !important;
  white-space: nowrap;
}
</style>
