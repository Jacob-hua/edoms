<template>
  <div class="editor-app">
    <edoms-editor
      ref="editor"
      v-model="value"
      :menu="menu"
      :runtime-url="runtimeUrl"
      :props-configs="propsConfigs"
      :props-values="propsValues"
      :event-method-list="eventMethodList"
      :component-group-list="componentGroupList"
      :default-selected="defaultSelected"
      :moveable-options="moveableOptions"
      :auto-scroll-into-view="true"
      :stage-rect="stageRect"
      :request="loadData"
      @runtime-ready="handleRuntimeReady"
    >
    </edoms-editor>

    <el-dialog
      v-model="previewVisible"
      destroy-on-close
      class="pre-viewer"
      title="预览"
      :width="stageRect && stageRect.width"
    >
      <iframe v-if="previewVisible" width="100%" :height="stageRect && stageRect.height" :src="previewUrl"></iframe>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import { Coin, Connection, Document } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import serialize from 'serialize-javascript';

import { editorService, EdomsEditor, MenuBarData, MoveableOptions, RequestProps } from '@edoms/editor';
import type { Id, MApp, MContainer, MNode } from '@edoms/schema';
import { NodeType } from '@edoms/schema';
import StageCore from '@edoms/stage';
import { asyncLoadJs, getByPath } from '@edoms/utils';

import { getPage } from '@/api/page';
import componentGroupList from '@/configs/componentGroupList';
import mockDSL from '@/configs/dsl';
import useModel from '@/hooks/useModel';
import useUpload from '@/hooks/useUpload';
import { generateDefaultDSL } from '@/util/dsl';

const { VITE_RUNTIME_PATH } = import.meta.env;

editorService.usePlugin({
  beforeDoAdd: (config: MNode, parent?: MContainer | null) => {
    if (config.type === 'overlay') {
      config.style = {
        ...config.style,
        left: 0,
        top: 0,
      };

      return [config, editorService.get('page')];
    }

    return [config, parent];
  },
});

const runtimeUrl = `${VITE_RUNTIME_PATH}/playground/index.html`;

const editor = ref<InstanceType<typeof EdomsEditor>>();

const previewVisible = ref(false);

const value = ref<MApp>(mockDSL);

const defaultSelected = ref(mockDSL.items[0].id);

const { propsConfigs, propsValues, eventMethodList } = loadUiScript();

const stageRect = ref({
  width: 1200,
  height: 950,
});

const previewUrl = computed(
  () => `${VITE_RUNTIME_PATH}/page/index.html?localPreview=1&page=${editor.value?.editorService.get('page').id}`
);

const menu: MenuBarData = {
  left: [
    {
      type: 'text',
      text: '页面名称',
    },
  ],
  center: ['delete', 'undo', 'redo', 'guides', 'rule', 'zoom'],
  right: [
    '/',
    {
      type: 'button',
      text: '预览',
      icon: Connection,
      handler: async (services) => {
        if (services?.editorService.get<Map<Id, Id>>('modifiedNodeIds').size > 0) {
          try {
            await ElMessageBox.confirm('有修改未保存，是否先保存再预览', '提示', {
              confirmButtonText: '保存并预览',
              cancelButtonText: '预览',
              type: 'warning',
            });
            save();
            ElMessage.success('保存成功');
          } catch (e) {
            console.error(e);
          }
        }
        previewVisible.value = true;
      },
    },
    {
      type: 'button',
      text: '保存',
      icon: Coin,
      handler: () => {
        save();
        ElMessage.success('保存成功');
      },
    },
    '/',
    {
      type: 'button',
      icon: Document,
      tooltip: '源码',
      handler: (service) => service?.uiService.set('showSrc', !service?.uiService.get('showSrc')),
    },
  ],
};

const loadData = async (props?: RequestProps): Promise<any> => {
  const { requestInstances, requestPoints } = useModel();
  if (!props) {
    return;
  }
  if (props.resourceId === 'dynamic-monitoring:instance') {
    return await requestInstances();
  }
  if (props.resourceId === 'dynamic-monitoring:point') {
    const prop = props.prop ?? '';
    const pathLastIndex = prop.lastIndexOf('.');
    const domainPath = prop.substring(0, pathLastIndex);
    const model = getByPath(props.formValue ?? {}, domainPath, '');

    if (model.instance[model.instance.length - 1] && model.instanceType && model.propertyType) {
      return await requestPoints({
        insId: model.instance[model.instance.length - 1],
        codeType: model.instanceType,
        propType: model.propertyType,
      });
    }
    return [];
  }
  return;
};

onBeforeMount(fetchPageInfo);

function handleRuntimeReady() {
  console.log('准备好了');
}

function loadUiScript() {
  const propsValues = ref<Record<string, any>>({});
  const propsConfigs = ref<Record<string, any>>({});
  const eventMethodList = ref<Record<string, any>>({});

  const { VITE_ENTRY_PATH } = import.meta.env;
  asyncLoadJs(`${VITE_ENTRY_PATH}/config/index.umd.js`).then(() => {
    propsConfigs.value = (globalThis as any).edomsPresetConfigs;
  });
  asyncLoadJs(`${VITE_ENTRY_PATH}/value/index.umd.js`).then(() => {
    propsValues.value = (globalThis as any).edomsPresetValues;
  });
  asyncLoadJs(`${VITE_ENTRY_PATH}/event/index.umd.js`).then(() => {
    eventMethodList.value = (globalThis as any).edomsPresetEvents;
  });

  return {
    propsValues,
    propsConfigs,
    eventMethodList,
  };
}

function moveableOptions(core?: StageCore): MoveableOptions {
  const options: MoveableOptions = {};
  const id = core?.dr?.target?.id;

  if (!id || !editor.value) return options;

  const node = editor.value.editorService.getNodeById(id);

  if (!node) return options;

  const isPage = node.type === NodeType.PAGE;

  options.draggable = !isPage;
  options.resizable = !isPage;
  options.rotatable = !isPage;

  return options;
}

async function fetchPageInfo() {
  const route = useRoute();
  const { applicationId, applicationName, editContentId, pageId, pageName } = await getPage({
    pageId: route.query.pageId as string,
  });
  if (!editContentId) {
    const dsl = generateDefaultDSL({
      applicationId,
      applicationName,
      pageId,
      pageName,
    });
    value.value = dsl;
    editor.value?.editorService.set('root', dsl);
    editor.value?.editorService.select(pageId);
  }
}

function save() {
  const dsl = serialize(toRaw(value.value), {
    space: 2,
    unsafe: true,
  }).replace(/"(\w+)":\s/g, '$1: ');
  useUpload(dsl, 'runtimeDSL', 'text/javascript', 'utf-8').execute();
  // localStorage.setItem('edomsDSL', dsl);
  editor.value?.editorService.resetModifiedNodeId();
}
</script>

<style lang="scss">
html {
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
  display: flex;
}

.editor-app {
  width: 100%;
  height: 100%;

  .edoms-editor {
    flex: 1;
    height: 100%;
  }

  .el-overlay-dialog {
    display: flex;
  }

  .pre-viewer {
    margin: auto;

    .el-dialog__body {
      padding: 0;
    }
  }

  .menu-left {
    .menu-item-text {
      margin-left: 10px;
    }
  }
}
</style>
