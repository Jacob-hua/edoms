<template>
  <div class="editor-app">
    <edoms-editor
      ref="editorRef"
      v-model="dsl"
      :menu="menu"
      :runtime-url="runtimeUrl"
      :props-configs="propsConfigs"
      :props-values="propsValues"
      :can-select="canSelect"
      :event-method-list="eventMethodList"
      :component-group-list="componentGroupList"
      :moveable-options="moveableOptions"
      :auto-scroll-into-view="true"
      :stage-rect="stageRect"
      :request="loadData"
    >
    </edoms-editor>

    <DSLPreviewDialog
      v-model:visible="previewDialogVisible"
      :stage-rect="stageRect"
      :content-id="contentState.contentId"
      :page-id="previewPageId"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Back, Coin, Connection, Document } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import serialize from 'serialize-javascript';

import { editorService, EdomsEditor, MenuBarData, MoveableOptions, RequestProps } from '@edoms/editor';
import type { Id, MApp, MContainer, MNode, MPage } from '@edoms/schema';
import { NodeType } from '@edoms/schema';
import StageCore from '@edoms/stage';
import { getByPath, isNumber } from '@edoms/utils';

import versionApi from '@/api/version';
import componentGroupList from '@/configs/componentGroupList';
import useAsyncLoadJS from '@/hooks/useAsyncLoadJS';
import useDownloadDSL from '@/hooks/useDownloadDSL';
import useModel from '@/hooks/useModel';
import useUpload from '@/hooks/useUpload';
import { generateDefaultDSL } from '@/util/dsl';

import DSLPreviewDialog from './component/DSLPreviewDialog.vue';

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

const router = useRouter();

const route = useRoute();

const stageRect = ref({
  width: 1920,
  height: 1080,
});

const runtimeUrl = `${VITE_RUNTIME_PATH}/playground/index.html`;

const idPrefix = 'edoms';

const editorRef = ref<InstanceType<typeof EdomsEditor>>();

const previewDialogVisible = ref<boolean>(false);

const previewPageId = ref<Id>();

const dsl = ref<MApp | undefined>();

const propsValues = ref<Record<string, any>>({});

const propsConfigs = ref<Record<string, any>>({});

const eventMethodList = ref<Record<string, any>>({});

const { VITE_ENTRY_PATH } = import.meta.env;

useAsyncLoadJS(
  [
    `${VITE_ENTRY_PATH}/config/index.umd.js`,
    `${VITE_ENTRY_PATH}/value/index.umd.js`,
    `${VITE_ENTRY_PATH}/event/index.umd.js`,
  ],
  () => {
    propsConfigs.value = (globalThis as any).edomsPresetConfigs;
    propsValues.value = (globalThis as any).edomsPresetValues;
    eventMethodList.value = (globalThis as any).edomsPresetEvents;
  }
).execute();

const staticResource = ref<string[]>([]);

const menu = computed<MenuBarData>(() => ({
  left: [
    {
      type: 'button',
      icon: Back,
      handler: () => {
        goBack();
      },
    },
    '/',
    {
      type: 'text',
      text: `${contentState.applicationName}（${contentState.versionName}）`,
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
            await ElMessageBox.confirm('有修改未保存，是否先保存再预览？', '提示', {
              confirmButtonText: '保存并预览',
              cancelButtonText: '预览',
              type: 'warning',
            });
            save();
            ElMessage.success('保存成功');
          } catch (e) {
            console.error(e);
            return;
          }
        }
        previewPageId.value = services?.editorService.get<MPage>('page').id;
        previewDialogVisible.value = true;
      },
    },
    {
      type: 'button',
      text: '保存',
      icon: Coin,
      handler: async () => {
        await save();
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
}));

const contentState = reactive({
  applicationId: route.query?.applicationId as string,
  applicationName: '',
  versionId: route.query?.versionId as string,
  versionName: '',
  contentId: '',
});

watch(
  () => ({ versionId: contentState.versionId }),
  async ({ versionId }) => {
    try {
      const { contentId, applicationId, applicationName, name } = await versionApi.getVersion({
        versionId,
      });
      contentState.contentId = contentId ?? '';
      contentState.versionName = name;
      contentState.applicationId = applicationId;
      contentState.applicationName = applicationName;
    } catch (error) {
      router.replace('/');
      return;
    }
    dsl.value = await calculateDSL();
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.uiService.set('showSrc', false);
    editorRef.value.propsService.setIdPrefix(idPrefix);
  }
});

const moveableOptions = (core?: StageCore): MoveableOptions => {
  const options: MoveableOptions = {};
  const id = core?.dr?.target?.id;

  if (!id || !editorRef.value) return options;

  const node = editorRef.value.editorService.getNodeById(id);

  if (!node) return options;

  const isPage = node.type === NodeType.PAGE;

  options.draggable = !isPage;
  options.resizable = !isPage;
  options.rotatable = !isPage;

  return options;
};

const canSelect = (el: HTMLElement): boolean => {
  if (!el.id) {
    return false;
  }
  return el.id.startsWith(idPrefix) || isNumber(el.id);
};

const { requestInstances, requestPoints } = useModel();

const loadData = async (props?: RequestProps): Promise<any> => {
  if (!props) {
    return;
  }
  const [component, parameter] = props.resourceId?.split(':');
  if (parameter === 'instance') {
    return await requestInstances();
  }
  if (parameter === 'point') {
    const prop = props.prop ?? '';
    let model: any = {
      instance: [],
      instanceType: undefined,
      propertyType: undefined,
    };
    if (
      ['dynamic-monitoring', 'system-operation-parameters', 'global-schematic', 'running-parameters'].includes(
        component
      )
    ) {
      const pathLastIndex = prop.lastIndexOf('.');
      const domainPath = prop.substring(0, pathLastIndex);
      model = getByPath(props.formValue ?? {}, domainPath, '');
    }

    if (model.instance[model.instance.length - 1] && model.instanceType && model.propertyType) {
      return await requestPoints({
        insId: model.instance[model.instance.length - 1],
        codeType: model.instanceType,
        propType: model.propertyType,
      });
    }
    return [];
  }
  if (parameter === 'upload') {
    const { execute: fileUploadExecute } = useUpload();
    const result = await fileUploadExecute(props.data as File, props.data?.name, props.data?.type);
    result && staticResource.value?.push(result);
    return result;
  }
  return;
};

function goBack() {
  router.push({
    path: '/page',
    query: {
      applicationId: contentState.applicationId,
      contentId: contentState.contentId,
    },
  });
}

const { execute: downloadDslExecute } = useDownloadDSL();

async function calculateDSL(): Promise<MApp> {
  if (contentState.contentId) {
    return await downloadDslExecute(contentState.contentId);
  }

  return generateDefaultDSL({
    applicationId: contentState.applicationId,
    applicationName: contentState.applicationName,
  });
}

const { execute: uploadExecute } = useUpload();

async function uploadDsl(): Promise<string | null | undefined> {
  const pageDSL = serialize(toRaw(dsl.value), {
    space: 2,
    unsafe: true,
  }).replace(/"(\w+)":\s/g, '$1: ');

  return await uploadExecute(pageDSL, `dsl.js`, 'text/javascript', 'utf-8', staticResource.value?.join(','));
}

async function save() {
  const contentId = await uploadDsl();
  if (!contentId) {
    return;
  }
  contentState.contentId = contentId;
  await versionApi.updateContent({
    applicationId: contentState.applicationId,
    versionId: contentState.versionId,
    contentId,
  });
  editorRef.value?.editorService.resetModifiedNodeId();
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
