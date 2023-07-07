<template>
  <div class="edoms-editor-empty-panel">
    <div class="edoms-editor-empty-content">
      <div class="edoms-editor-empty-button" @click="clickHandler">
        <div>
          <MIcon :icon="Plus"></MIcon>
        </div>
        <p>{{ $t('editor.新增页面') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, toRaw } from 'vue';
import { Plus } from '@element-plus/icons-vue';

import { NodeType } from '@edoms/schema';

import MIcon from '../components/Icon.vue';
import type { Services } from '../type';
import { generatePageNameByApp } from '../utils';

const services = inject<Services>('services');

const clickHandler = () => {
  const { editorService } = services || {};

  if (!editorService) return;

  editorService.add({
    type: NodeType.PAGE,
    name: generatePageNameByApp(toRaw(editorService.get('root'))),
  });
};
</script>
