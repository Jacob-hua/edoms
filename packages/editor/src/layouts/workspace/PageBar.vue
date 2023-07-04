<template>
  <PageBarScrollContainer>
    <div
      v-for="item in (root && root.items) || []"
      :key="item.key"
      class="edoms-editor-page-bar-item"
      :class="{ active: page?.id === item.id }"
      @click="switchPage(item)"
    >
      <div class="edoms-editor-page-bar-title">
        <slot name="page-bar-title" :page="item">
          <ElTooltip effect="dark" placement="top-start" :content="item.name">
            <span>{{ item.name || item.id }}</span>
          </ElTooltip>
        </slot>
      </div>

      <ElPopover popper-class="page-bar-popover" placement="top" :width="160" trigger="hover">
        <div>
          <slot name="page-bar-popover" :page="item">
            <ToolButton
              :data="{
                type: 'button',
                text: $t('editor.rename'),
                icon: Edit,
                handler: () => rename(item),
              }"
            ></ToolButton>
            <ToolButton
              :data="{
                type: 'button',
                text: $t('editor.copy'),
                icon: DocumentCopy,
                handler: () => copy(item),
              }"
            ></ToolButton>
            <ToolButton
              :data="{
                type: 'button',
                text: $t('editor.delete'),
                icon: Delete,
                handler: () => remove(item),
              }"
            ></ToolButton>
          </slot>
        </div>
        <template #reference>
          <ElIcon class="edoms-editor-page-bar-menu-icon">
            <CaretBottom></CaretBottom>
          </ElIcon>
        </template>
      </ElPopover>
    </div>
  </PageBarScrollContainer>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { CaretBottom, Delete, DocumentCopy, Edit } from '@element-plus/icons-vue';

import { ElIcon, elMessageBox, ElPopover, ElTooltip } from '@edoms/design';
import type { MApp, MPage } from '@edoms/schema';

import ToolButton from '../../components/ToolButton.vue';
import useI18n from '../../hooks/useI18n';
import type { Services } from '../../type';

import PageBarScrollContainer from './PageBarScrollContainer.vue';
const { t } = useI18n();
const services = inject<Services>('services');
const editorService = services?.editorService;

const root = computed(() => editorService?.get<MApp>('root'));

const page = computed(() => editorService?.get('page'));

const switchPage = (page: MPage) => {
  editorService?.select(page);
};

const copy = (node: MPage) => {
  node && editorService?.copy(node);
  editorService?.paste({
    left: 0,
    top: 0,
  });
};

const rename = (node: MPage) => {
  elMessageBox
    .prompt(`${t('editor.rename')}${node.name}`, t('editor.tip'), {
      confirmButtonText: t('editor.confirm'),
      cancelButtonText: t('editor.cancel'),
      inputValue: node.name,
      inputPattern: /\S/,
      inputErrorMessage: t('editor.rules.noPageName'),
      closeOnClickModal: false,
    })
    .then(({ value }) => {
      editorService?.update({ ...node, name: String.prototype.trim.call(value) });
    });
};

const remove = (node: MPage) => {
  editorService?.remove(node);
};
</script>
