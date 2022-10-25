<template>
  <ElDialog
    v-model="isShowCodeBlockEditor"
    class="code-editor-dialog"
    :title="currentTitle"
    :fullscreen="true"
    :before-close="saveAndClose"
    :append-to-body="true"
  >
    <layout v-model:left="left" :min-left="45" class="code-editor-layout">
      <!-- 左侧列表 -->
      <template v-if="mode === CodeEditorMode.LIST" #left>
        <ElTree
          v-if="!isEmpty(state.codeList)"
          class="side-tree"
          node-key="id"
          empty-text="暂无代码块"
          :data="state.codeList"
          :highlight-current="true"
          :current-node-key="state.codeList[0].id"
          @node-click="selectHandler"
        >
          <template #default="{ data }">
            <div :id="data.id" class="list-container">
              <div class="list-item">
                <div class="code-name">{{ data.name }}（{{ data.id }}）</div>
              </div>
            </div>
          </template>
        </ElTree>
      </template>
      <!-- 右侧区域 -->
      <template #center>
        <div
          v-if="!isEmpty(codeConfig)"
          :class="[
            mode === CodeEditorMode.LIST
              ? 'm-editor-code-block-editor-panel-list-mode'
              : 'm-editor-code-block-editor-panel',
          ]"
        >
          <slot :id="id" name="code-block-edit-panel-header"></slot>
          <ElCard shadow="never">
            <template #header>
              <div class="code-name-wrapper">
                <div class="code-name-label">代码块名称</div>
                <ElInput v-if="codeConfig" v-model="codeConfig.name" class="code-name-input" :disabled="!editable" />
              </div>
            </template>
            <div class="m-editor-wrapper">
              <edoms-code-editor
                v-if="codeConfig"
                ref="codeEditor"
                class="m-editor-container"
                :init-values="`${codeConfig.content}`"
                :options="{
                  tabSize: 2,
                  fontSize: 16,
                  formatOnPaste: true,
                  readOnly: !editable,
                }"
                @save="saveCode"
              ></edoms-code-editor>
              <div v-if="editable" class="m-editor-content-bottom">
                <ElButton type="primary" class="button" @click="saveCode">保存</ElButton>
                <ElButton type="primary" class="button" @click="saveAndClose">关闭</ElButton>
              </div>
              <div v-else class="m-editor-content-bottom">
                <ElButton type="primary" class="button" @click="saveAndClose">关闭</ElButton>
              </div>
            </div>
          </ElCard>
        </div>
      </template>
    </layout>
  </ElDialog>
</template>

<script lang="ts" setup>
import { computed, inject, reactive, ref, watchEffect } from 'vue';
import { forIn, isEmpty } from 'lodash-es';
import type * as monaco from 'monaco-editor';

import { ElButton, ElCard, ElDialog, ElInput, elMessage, ElTree } from '@edoms/design';

import type { CodeBlockContent, CodeDslList, ListState, Services } from '../../../type';
import { CodeEditorMode } from '../../../type';
import EdomsCodeEditor from '../../CodeEditor.vue';
import Layout from '../../Layout.vue';

const services = inject<Services>('services');

const codeEditor = ref<InstanceType<typeof EdomsCodeEditor>>();
const left = ref(200);
const currentTitle = ref('');
// 编辑器当前需展示的代码块内容
const codeConfig = ref<CodeBlockContent | null>(null);
// select选择的内容(ListState)
const state = reactive<ListState>({
  codeList: [],
});

// 是否展示代码编辑区
const isShowCodeBlockEditor = computed(
  () => (codeConfig.value && services?.codeBlockService.getCodeEditorShowStatus()) || false
);
const mode = computed(() => services?.codeBlockService.getMode());
const id = computed(() => services?.codeBlockService.getId() || '');
const editable = computed(() => services?.codeBlockService.getEditStatus());
// 当前选中组件绑定的代码块id数组
const selectedIds = computed(() => services?.codeBlockService.getCombineIds() || []);

watchEffect(async () => {
  codeConfig.value = (await services?.codeBlockService.getCodeContentById(id.value)) || null;
});

watchEffect(async () => {
  const codeDsl = (await services?.codeBlockService.getCodeDslByIds(selectedIds.value)) || null;
  if (!codeDsl) return;
  state.codeList = [];
  forIn(codeDsl, (value: CodeBlockContent, key: string) => {
    state.codeList.push({
      id: key,
      name: value.name,
    });
  });
  currentTitle.value = state.codeList[0]?.name || '';
});

// 保存代码
const saveCode = async (): Promise<boolean> => {
  if (!codeEditor.value || !codeConfig.value || !editable.value) return true;

  try {
    // 代码内容
    const codeContent = (codeEditor.value.getEditor() as monaco.editor.IStandaloneCodeEditor)?.getValue();
    /* eslint no-eval: "off" */
    codeConfig.value.content = eval(codeContent);
  } catch (e: any) {
    elMessage.error(e.stack);
    return false;
  }
  // 存入dsl
  await services?.codeBlockService.setCodeDslById(id.value, {
    name: codeConfig.value.name,
    content: codeConfig.value.content,
  });
  elMessage.success('代码保存成功');
  return true;
};

// 保存并关闭
const saveAndClose = async () => {
  const saveRes = await saveCode();
  if (saveRes) {
    await services?.codeBlockService.setCodeEditorShowStatus(false);
  }
};

const selectHandler = (data: CodeDslList) => {
  services?.codeBlockService.setId(data.id);
  currentTitle.value = data.name;
};
</script>
