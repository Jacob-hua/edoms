<template>
  <div class="edoms-editor-code-block-list">
    <slot name="code-block-panel-header">
      <div class="code-header-wrapper">
        <ElInput
          v-model="filterText"
          :class="[editable ? 'code-filter-input' : 'code-filter-input-no-btn']"
          size="small"
          placeholder="输入关键字进行过滤"
          clearable
          @input="filterTextChangeHandler"
        ></ElInput>
        <ElButton v-if="editable" class="create-code-button" type="primary" size="small" @click="createCodeBlock"
          >新增</ElButton
        >
      </div>
    </slot>

    <!-- 代码块列表 -->
    <ElTree
      v-if="!isEmpty(state.codeList)"
      ref="tree"
      node-key="id"
      empty-text="暂无代码块"
      :data="state.codeList"
      :highlight-current="true"
      :filter-node-method="filterNode"
      @node-click="toggleCombineRelation"
    >
      <template #default="{ data }">
        <div :id="data.id" class="list-container">
          <div class="list-item">
            <div class="code-name">{{ data.name }}（{{ data.id }}）</div>
            <!-- 右侧工具栏 -->
            <div class="right-tool">
              <ElTooltip effect="dark" :content="editable ? '编辑' : '查看'" placement="bottom">
                <Icon :icon="editable ? Edit : View" class="edit-icon" @click.stop="editCode(`${data.id}`)"></Icon>
              </ElTooltip>
              <ElTooltip
                v-if="state.bindComps[data.id] && state.bindComps[data.id].length > 0"
                effect="dark"
                content="查看绑定关系"
                placement="bottom"
              >
                <Icon :icon="Link" class="edit-icon" @click.stop="toggleCombineRelation(data)"></Icon>
              </ElTooltip>
              <ElTooltip v-if="editable" effect="dark" content="删除" placement="bottom">
                <Icon :icon="Close" class="edit-icon" @click.stop="deleteCode(`${data.id}`)"></Icon>
              </ElTooltip>
              <slot :id="data.id" name="code-block-panel-tool" :data="data.codeBlockContent"></slot>
            </div>
          </div>
          <!-- 展示代码块下绑定的组件 -->
          <div
            v-if="data.showRelation && state.bindComps[data.id] && state.bindComps[data.id].length > 0"
            class="code-comp-map-wrapper"
          >
            <svg class="arrow-left" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
              <path
                fill="currentColor"
                d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"
              ></path>
            </svg>
            <ElButton
              v-for="(comp, index) in state.bindComps[data.id]"
              :key="index"
              class="code-comp"
              size="small"
              :plain="true"
              @click.stop="selectComp(comp.id)"
              >{{ comp.name }}</ElButton
            >
          </div>
        </div>
      </template>
    </ElTree>

    <!-- 代码块编辑区 -->
    <code-block-editor>
      <template #code-block-edit-panel-header="{ id }">
        <slot :id="id" name="code-block-edit-panel-header"></slot>
      </template>
    </code-block-editor>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, reactive, ref, watch } from 'vue';
import { Close, Edit, Link, View } from '@element-plus/icons-vue';
import { forIn, isEmpty } from 'lodash-es';

import { ElButton, ElInput, elMessage, ElTooltip, ElTree } from '@edoms/design';
import { Id } from '@edoms/schema';
import StageCore from '@edoms/stage';

import Icon from '../../../components/Icon.vue';
import type { CodeBlockContent, CodeRelation, Services } from '../../../type';
import { CodeDeleteErrorType, CodeDslList, CodeEditorMode, ListRelationState } from '../../../type';

import codeBlockEditor from './CodeBlockEditor.vue';

const props = defineProps<{
  customError?: (id: string, errorType: CodeDeleteErrorType) => any;
}>();

const services = inject<Services>('services');

// 代码块列表
const state = reactive<ListRelationState>({
  codeList: [],
  bindComps: {},
});

const editable = computed(() => services?.codeBlockService.getEditStatus());

// 根据代码块ID获取其绑定的组件信息
const getBindCompsByCodeId = (codeId: string, codeBlockContent: CodeBlockContent) => {
  if (isEmpty(codeBlockContent) || isEmpty(codeBlockContent.comps)) {
    state.bindComps[codeId] = [];
    return;
  }
  const compsField = codeBlockContent.comps as CodeRelation;
  const bindCompIds = Object.keys(compsField);
  const bindCompsFiltered = bindCompIds.filter((compId) => !isEmpty(compsField[compId]));
  const compsInfo = bindCompsFiltered.map((compId) => ({
    id: compId,
    name: getCompName(compId),
  }));
  state.bindComps[codeId] = compsInfo;
};

// 初始化代码块列表
const initList = async () => {
  const codeDsl = (await services?.codeBlockService.getCodeDsl()) || null;
  if (!codeDsl) return;
  state.codeList = [];
  forIn(codeDsl, (value: CodeBlockContent, codeId: string) => {
    getBindCompsByCodeId(codeId, value);
    state.codeList.push({
      id: codeId,
      name: value.name,
      codeBlockContent: value,
      showRelation: true,
    });
  });
};

watch(
  () => services?.codeBlockService.getCodeDsl(),
  () => {
    initList();
  },
  {
    immediate: true,
    deep: true,
  }
);

// 监听组件名称修改，更新到代码块列表
watch(
  () => services?.editorService.get('node'),
  (curNode) => {
    if (!curNode?.id) return;
    forIn(state.bindComps, (bindCompInfo) => {
      bindCompInfo.forEach((comp) => {
        if (comp.id === curNode.id) {
          comp.name = curNode.name;
        }
      });
    });
  }
);

// 新增代码块
const createCodeBlock = async () => {
  const { codeBlockService } = services || {};
  if (!codeBlockService) {
    elMessage.error('新增代码块失败');
    return;
  }
  const codeConfig: CodeBlockContent = {
    name: '代码块',
    content: `() => {\n  // place your code here\n}`,
  };
  await codeBlockService.setMode(CodeEditorMode.EDITOR);
  const id = await codeBlockService.getUniqueId();
  await codeBlockService.setCodeDslById(id, codeConfig);
  codeBlockService.setCodeEditorContent(true, id);
};

// 编辑代码块
const editCode = async (key: string) => {
  await services?.codeBlockService.setMode(CodeEditorMode.EDITOR);
  services?.codeBlockService.setCodeEditorContent(true, key);
};

// 删除代码块
const deleteCode = (key: string) => {
  const existBinds = !!(state.bindComps[key]?.length > 0);
  const undeleteableList = services?.codeBlockService.getUndeletableList() || [];
  if (!existBinds && !undeleteableList.includes(key)) {
    // 无绑定关系，且不在不可删除列表中
    services?.codeBlockService.deleteCodeDslByIds([key]);
  } else {
    if (typeof props.customError === 'function') {
      props.customError(key, existBinds ? CodeDeleteErrorType.BIND : CodeDeleteErrorType.UNDELETEABLE);
    } else {
      elMessage.error('代码块删除失败');
    }
  }
};

const filterText = ref('');
const tree = ref();

const filterNode = (value: string, data: CodeDslList): boolean => {
  if (!value) {
    return true;
  }
  return `${data.name}${data.id}`.indexOf(value) !== -1;
};

const filterTextChangeHandler = (val: string) => {
  tree.value?.filter(val);
};

// 展示/隐藏组件绑定关系
const toggleCombineRelation = (data: CodeDslList) => {
  const { id } = data;
  const currentCode = state.codeList.find((item) => item.id === id);
  if (!currentCode) return;
  currentCode.showRelation = !currentCode?.showRelation;
};

// 获取组件名称展示到tag上
const getCompName = (compId: Id): string => {
  const node = services?.editorService.getNodeById(compId);
  return node?.name || String(compId);
};

// todo 功能暂时隐藏
// 解除绑定
// const unbind = async (compId: Id, codeId: string) => {
//   const res = await services?.codeBlockService.unbind(compId, codeId, codeHooks);
//   if (res) {
//     ElMessage.success('绑定关系解除成功');
//   } else {
//     ElMessage.error('绑定关系解除失败');
//   }
// };

// 选中组件
const selectComp = (compId: Id) => {
  const stage = services?.editorService.get<StageCore | null>('stage');
  services?.editorService.select(compId);
  stage?.select(compId);
};
</script>
