<template>
  <div class="editor-app">
    <edoms-editor
      ref="editorRef"
      v-model="value"
      :menu="menu"
      :runtime-url="runtimeUrl"
      :props-configs="propsConfigs"
      :props-values="propsValues"
      :can-select="canSelect"
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

    <DSLPreviewDialog
      v-model:visible="previewDialogVisible"
      :stage-rect="stageRect"
      :application-id="contentState.applicationId"
      :application-name="contentState.applicationName"
      :page-id="contentState.pageId"
      :content-id="contentState.contentId"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Back, Coin, Connection, Document, Finished, PriceTag } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import serialize from 'serialize-javascript';

import { editorService, EdomsEditor, MenuBarData, MoveableOptions, RequestProps } from '@edoms/editor';
import type { Id, MApp, MContainer, MNode, MPage } from '@edoms/schema';
import { NodeType } from '@edoms/schema';
import StageCore from '@edoms/stage';
import { getByPath, isNumber } from '@edoms/utils';

import pageApi from '@/api/page';
import versionApi from '@/api/version';
import componentGroupList from '@/configs/componentGroupList';
import useAsyncLoadJS from '@/hooks/useAsyncLoadJS';
import useDownloadDSL from '@/hooks/useDownloadDSL';
import useModel from '@/hooks/useModel';
import useUpload from '@/hooks/useUpload';
import { generateEmptyAppDSL, generateEmptyPageDSL } from '@/util/dsl';

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

const previewDialogVisible = ref(false);

const value = ref<MApp | undefined>();

const defaultSelected = ref();

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
      text: '历史版本:',
      display: () => Boolean(contentState.versionId),
    },
    {
      type: 'text',
      text: contentState.pageName || contentState.versionName,
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
    {
      type: 'button',
      text: '发布',
      icon: Finished,
      handler: async () => {
        await publish();
        ElMessage.success('发布成功');
      },
    },
    {
      type: 'button',
      text: '保存版本',
      icon: PriceTag,
      handler: () => {
        ElMessageBox.prompt('请输入版本名称', '保存版本', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputErrorMessage: '请输入版本名称',
          inputValidator: (value) => {
            if (!value || value.trim().length < 1) {
              return false;
            }
            return true;
          },
        }).then(async ({ value }) => {
          await saveWithVersion(value.trim());
          ElMessage.success('保存版本成功');
        });
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
  applicationId: '',
  applicationName: '',
  pageId: route.query?.pageId as string,
  pageName: '',
  versionId: route.query?.versionId as string,
  versionName: '',
  contentId: '',
});

watch(
  () => ({ pageId: contentState.pageId, versionId: contentState.versionId }),
  async ({ pageId, versionId }) => {
    if (!pageId) {
      return;
    }
    if (versionId) {
      const versionInfo = await versionApi.getVersion({ versionId });
      contentState.versionName = versionInfo.name;
      contentState.contentId = versionInfo.editContentId;
    } else {
      const pageInfo = await pageApi.getPage({ pageId });
      contentState.applicationId = pageInfo.applicationId;
      contentState.applicationName = pageInfo.applicationName;
      contentState.contentId = pageInfo.editContentId ?? '';
      contentState.pageName = pageInfo.pageName;
    }
    const dsl = await calculateDSL();
    value.value = dsl;
    defaultSelected.value = pageId;
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

const handleRuntimeReady = () => {
  console.log('准备好了');
};

function goBack() {
  router.go(-1);
}

const { execute: downloadDslExecute } = useDownloadDSL();

async function calculateDSL(): Promise<MApp> {
  const dsl: MApp = generateEmptyAppDSL({
    applicationId: contentState.applicationId,
    applicationName: contentState.applicationName,
  });

  const emptyPageDsl: MPage = generateEmptyPageDSL({
    pageId: contentState.pageId,
    pageName: contentState.pageName,
  });
  if (contentState.contentId) {
    const remoteDsl = await downloadDslExecute(contentState.contentId);
    if (!remoteDsl) {
      dsl.items.push(emptyPageDsl);
    } else if (remoteDsl.type === NodeType.PAGE) {
      dsl.items.push(remoteDsl);
    } else {
      return remoteDsl;
    }
  } else {
    dsl.items.push(emptyPageDsl);
  }

  return dsl;
}

const { execute: uploadExecute } = useUpload();

async function uploadDsl(): Promise<string | null | undefined> {
  const pageDSL = serialize(toRaw(value.value?.items?.[0]), {
    space: 2,
    unsafe: true,
  }).replace(/"(\w+)":\s/g, '$1: ');

  return await uploadExecute(pageDSL, 'runtimeDSL', 'text/javascript', 'utf-8', staticResource.value?.join(','));
}

async function save() {
  const contentId = await uploadDsl();
  if (!contentId) {
    return;
  }
  contentState.contentId = contentId;
  if (contentState.versionId) {
    await versionApi.saveVersion({
      versionId: contentState.versionId,
      contentId,
    });
  } else {
    await pageApi.savePage({
      pageId: contentState.pageId,
      contentId,
    });
  }
  editorRef.value?.editorService.resetModifiedNodeId();
}

async function saveWithVersion(version: string) {
  const contentId = await uploadDsl();
  if (!contentId) {
    return;
  }
  await versionApi.saveWithVersion({
    pageId: contentState.pageId,
    contentId,
    name: version,
    description: '',
  });
}

async function publish() {
  const contentId = await uploadDsl();
  if (!contentId) {
    return;
  }
  contentState.contentId = contentId;
  if (contentState.versionId) {
    await versionApi.publishVersion({
      versionId: contentState.versionId,
      contentId,
    });
  } else {
    await pageApi.publishPage({
      pageId: contentState.pageId,
      contentId,
    });
  }
  editorRef.value?.editorService.resetModifiedNodeId();
  goBack();
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
