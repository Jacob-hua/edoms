<template>
  <el-dialog
    v-model="dialogVisible"
    destroy-on-close
    class="pre-viewer"
    :title="$t('page.preview')"
    :width="stageRect.width"
  >
    <DSLPreview :height="stageRect.height" :content-id="contentId" :page-id="pageId" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { Id } from '@edoms/schema';

import DSLPreview from '@/components/DSLPreview.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    pageId?: string | Id;
    contentId?: string | null;
    stageRect: {
      width: number;
      height: number;
    };
  }>(),
  {
    pageId: '',
    width: '100%',
  }
);

const emit = defineEmits<{
  (emit: 'update:visible', value: boolean): void;
}>();

const dialogVisible = computed<boolean>({
  get: () => props.visible,
  set: (visible) => {
    emit('update:visible', visible);
  },
});
</script>
