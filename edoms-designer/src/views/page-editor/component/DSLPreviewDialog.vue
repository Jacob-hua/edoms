<template>
  <el-dialog v-model="dialogVisible" destroy-on-close class="pre-viewer" title="预览" :width="stageRect.width">
    <DSLPreview
      :height="stageRect.height"
      :application-id="applicationId"
      :application-name="applicationName"
      :content-id="contentId"
      :page-id="pageId"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import DSLPreview from '@/components/DSLPreview.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    applicationId?: string;
    applicationName?: string;
    pageId?: string;
    contentId?: string | null | undefined;
    stageRect: {
      width: number;
      height: number;
    };
  }>(),
  {
    applicationId: '',
    applicationName: '',
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
