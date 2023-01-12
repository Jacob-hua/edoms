<template>
  <div class="edoms-editor">
    <slot name="nav" class="edoms-editor-nav-menu"></slot>

    <edoms-code-editor
      v-if="showSrc"
      class="edoms-editor-content"
      :init-values="root"
      :options="codeOptions"
      @save="saveCode"
    ></edoms-code-editor>

    <Layout
      v-else
      v-model:left="columnWidth.left"
      v-model:right="columnWidth.right"
      v-loading="loading"
      element-loading-text="页面加载中..."
      class="edoms-editor-content"
      left-class="edoms-editor-framework-left"
      center-class="edoms-editor-framework-center"
      right-class="edoms-editor-framework-right"
      :min-left="45"
      :min-right="1"
      @change="columnWidthChange"
    >
      <template #left>
        <slot name="sidebar"></slot>
      </template>

      <template #center>
        <slot v-if="pageLength > 0" name="workspace"></slot>
        <slot v-else name="empty">
          <AddPageBox></AddPageBox>
        </slot>
      </template>

      <template v-if="pageLength > 0 && nodes.length === 1" #right>
        <ElScrollbar>
          <slot name="props-panel"></slot>
        </ElScrollbar>
      </template>
    </Layout>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue';

import { ElScrollbar } from '@edoms/design';
import type { MApp } from '@edoms/schema';

import { GetColumnWidth, Services } from '../type';

import AddPageBox from './AddPageBox.vue';
import Layout from './Layout.vue';

const DEFAULT_LEFT_COLUMN_WIDTH = 310;
const DEFAULT_RIGHT_COLUMN_WIDTH = 480;

withDefaults(
  defineProps<{
    codeOptions?: Record<string, any>;
  }>(),
  {
    codeOptions: () => ({}),
  }
);

const { editorService, uiService } = inject<Services>('services') || {};

const loading = ref<boolean>(false);

const root = computed(() => editorService?.get<MApp>('root'));
const nodes = computed(() => editorService?.get<Node[]>('nodes') || []);

const pageLength = computed(() => editorService?.get<number>('pageLength') || 0);
const showSrc = computed(() => uiService?.get<boolean>('showSrc'));

const LEFT_COLUMN_WIDTH_STORAGE_KEY = '$EdomsEditorLeftColumnWidthData';
const RIGHT_COLUMN_WIDTH_STORAGE_KEY = '$EdomsEditorRightColumnWidthData';

const leftColumnWidthCacheData = Number(globalThis.localStorage.getItem(LEFT_COLUMN_WIDTH_STORAGE_KEY));
const RightColumnWidthCacheData = Number(globalThis.localStorage.getItem(RIGHT_COLUMN_WIDTH_STORAGE_KEY));

const columnWidth = ref<Partial<GetColumnWidth>>({
  left: leftColumnWidthCacheData,
  center: 0,
  right: RightColumnWidthCacheData,
});

editorService?.on('runtime-ready', (value: boolean) => {
  loading.value = !value;
});

watch(
  () => showSrc.value,
  (showSrc) => {
    if (!showSrc) {
      loading.value = true;
    }
  }
);

watch(
  pageLength,
  (length) => {
    const left = columnWidth.value.left || DEFAULT_LEFT_COLUMN_WIDTH;

    columnWidth.value.left = left;

    if (length <= 0) {
      columnWidth.value.right = undefined;
      columnWidth.value.center = globalThis.document.body.clientWidth - left;
    } else {
      const right = columnWidth.value.right || RightColumnWidthCacheData || DEFAULT_RIGHT_COLUMN_WIDTH;
      columnWidth.value.right = right;
      columnWidth.value.center = globalThis.document.body.clientWidth - left - right;
    }

    uiService?.set('columnWidth', columnWidth);
  },
  {
    immediate: true,
  }
);

watch(
  () => columnWidth.value.right,
  (right) => {
    if (typeof right === 'undefined') return;
    globalThis.localStorage.setItem(RIGHT_COLUMN_WIDTH_STORAGE_KEY, `${right}`);
  }
);

watch(
  () => columnWidth.value.left,
  (left) => {
    globalThis.localStorage.setItem(LEFT_COLUMN_WIDTH_STORAGE_KEY, `${left}`);
  }
);

const columnWidthChange = (columnWidth: GetColumnWidth) => {
  uiService?.set('columnWidth', columnWidth);
};

const saveCode = (value: string) => {
  try {
    // eslint-disable-next-line no-eval
    editorService?.set('root', eval(value));
  } catch (e: any) {
    console.error(e);
  }
};
</script>
