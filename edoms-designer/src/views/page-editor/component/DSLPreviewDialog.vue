<template>
  <el-dialog v-model="dialogVisible" destroy-on-close class="pre-viewer" title="预览" :width="width">
    <DSLPreview :height="stageRect.height" application-id="1" :content-id="contentId" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import DSLPreview from '@/components/DSLPreview.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    contentId: string;
    stageRect: {
      width: number;
      height: number;
    };
    width?: string;
  }>(),
  {
    width: '100%',
  }
);

const emit = defineEmits<{
  (emit: 'update:visible', visible: boolean): void;
}>();

const dialogVisible = computed<boolean>({
  get: () => props.visible,
  set: (visible) => {
    emit('update:visible', visible);
  },
});
</script>
