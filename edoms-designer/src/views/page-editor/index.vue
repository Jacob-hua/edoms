<template>
  <div class="editor-app">
    <edoms-editor
      ref="editorRef"
      v-model="dsl"
      :default-selected="defaultSelected"
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
      :upload-preview-file="uploadPreviewFile"
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
import { storeToRefs } from 'pinia';
import serialize from 'serialize-javascript';

import { editorService, EdomsEditor, MenuBarData, MoveableOptions, Request, RequestProps } from '@edoms/editor';
import type { Id, MApp, MContainer, MNode, MPage } from '@edoms/schema';
import { NodeType } from '@edoms/schema';
import StageCore from '@edoms/stage';
import { getByPath, isNumber } from '@edoms/utils';

// import applicationApi, { SaveParametrReq } from '@/api/application';
import versionApi, { ParameterList } from '@/api/version';
import componentGroupList from '@/configs/componentGroupList';
import useAsyncLoadJS from '@/hooks/useAsyncLoadJS';
import useDownloadDSL from '@/hooks/useDownloadDSL';
import useModel from '@/hooks/useModel';
import useUpload from '@/hooks/useUpload';
import useAccountStore from '@/store/account';
import { generateDefaultDSL } from '@/util/dsl';

import DSLPreviewDialog from './component/DSLPreviewDialog.vue';

const { VITE_RUNTIME_PATH, VITE_ENTRY_PATH, VITE_FILE_PREVIEW_URL } = import.meta.env;

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
  beforeDoRemove: (config: MNode, parent?: MContainer | null) => {
    staticResource.value.delete(config.id);
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

const defaultSelected = ref<Id>(route.query.pageId as Id);

const propsValues = ref<Record<string, any>>({});

const propsConfigs = ref<Record<string, any>>({});

const eventMethodList = ref<Record<string, any>>({});

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

const staticResource = ref<Map<Id, string>>(new Map());

const menu = computed<MenuBarData>(() => ({
  left: [
    {
      type: 'button',
      icon: Back,
      handler: async (services) => {
        if (services?.editorService.get<Map<Id, Id>>('modifiedNodeIds').size > 0) {
          try {
            await ElMessageBox.confirm('有修改未保存，是否仍要退出？', '提示', {
              confirmButtonText: '退出',
              cancelButtonText: '取消',
              type: 'warning',
            });
            goBack();
          } catch (e) {
            console.error(e);
          }
        } else {
          goBack();
        }
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
              cancelButtonText: '取消',
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
      handler: async (services) => {
        if (services?.editorService.get<Map<Id, Id>>('modifiedNodeIds').size > 0) {
          await save();
          ElMessage.success('保存成功');
        } else {
          ElMessage.warning('当前无修改，无需保存');
        }
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
    !defaultSelected.value && (defaultSelected.value = dsl.value.items?.[0].id);
    if (dsl.value.referenceResource) {
      for (const [id, value] of Object.entries(dsl.value.referenceResource)) {
        staticResource.value.set(id, value);
      }
    }
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

const instances = ref<any[]>([]);

requestInstances().then((data) => (instances.value = data));

const uploadPreviewFile: string = VITE_FILE_PREVIEW_URL;

const loadData = ref<Request>(() => {});

watch(
  () => instances.value,
  (instances) => {
    loadData.value = async (props?: RequestProps): Promise<any> => {
      if (!props) {
        return;
      }
      const [component, parameter] = props.resourceId?.split(':');
      if (parameter === 'instance') {
        return instances;
      }
      if (parameter === 'point') {
        const prop = props.prop ?? '';
        let model: any = {
          instance: [],
          instanceType: undefined,
          instanceName: undefined,
          propertyType: undefined,
        };
        if (
          [
            'dynamic-monitoring',
            'system-operation-parameters',
            'global-schematic',
            'running-parameters',
            'global-schematic-chart',
            'multiple-energy-monitoring',
            'charts',
            'equipment-condition',
            'system-cumulative-data',
            'equipment-operating-parameter',
            'economic-indicators',
            'operational-analysis',
            'energy-monitoring',
            'suspended-window',
            'intelligence-report-heat',
            // 'intelligence-report',
          ].includes(component)
        ) {
          const pathLastIndex = prop.lastIndexOf('.');
          const domainPath = prop.substring(0, pathLastIndex);
          model = getByPath(props.formValue ?? {}, domainPath, '');
        }
        if (['energy-efficiency-monitoring'].includes(component)) {
          model = props.formValue;
        }
        if (model.instance[model.instance.length - 1] && model.instanceType && model.propertyType) {
          return await requestPoints({
            insDataCode: model.instance[model.instance.length - 1],
            codeType: model.instanceType,
            propType: model.propertyType,
          });
        }
        return [];
      }
      if (parameter === 'upload') {
        const { execute: fileUploadExecute } = useUpload();
        const result = await fileUploadExecute(props.data as File, props.data?.name, props.data?.type);
        result && staticResource.value.set(props.formValue?.id, result);
        return result;
      }
      return;
    };
  }
);

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

const { currentTenant } = storeToRefs(useAccountStore());

async function calculateDSL(): Promise<MApp> {
  if (contentState.contentId) {
    return await downloadDslExecute(contentState.contentId);
  }

  return generateDefaultDSL({
    applicationId: contentState.applicationId,
    applicationName: contentState.applicationName,
    tenantId: currentTenant.value?.tenantId,
  });
}

const { execute: uploadExecute } = useUpload();

async function uploadDsl(): Promise<string | null | undefined> {
  const rawDSL = toRaw(dsl.value);
  if (rawDSL) {
    const referenceResource = Array.from(staticResource.value.entries()).reduce(
      (referenceResource, [id, value]) => ({ ...referenceResource, [id]: value }),
      {}
    );
    rawDSL.referenceResource = referenceResource;
  }
  const DSL = serialize(rawDSL, {
    space: 2,
    unsafe: true,
  }).replace(/"(\w+)":\s/g, '$1: ');

  return await uploadExecute(
    DSL,
    `dsl.js`,
    'text/javascript',
    'utf-8',
    Array.from(staticResource.value.values()).join(',')
  );
}

const getParameterConfig = () => {
  const components = editorService.state.page?.items;
  const list: ParameterList[] = [];
  components?.forEach((item) => {
    if (item.type === 'setting-parameter') {
      console.log(item.parameters, 111111111);
      if (!item.parameters || item.parameters.length <= 0) return;
      list.push({
        componentType: String(item.type),
        componentIdentify: String(item.id),
        dataList: item.parameters,
      });
    }
  });
  return list;
};

async function save() {
  const contentId = await uploadDsl();
  if (!contentId) {
    return;
  }
  contentState.contentId = contentId;
  const list = getParameterConfig();
  const param = list.length
    ? {
        applicationId: contentState.applicationId,
        versionId: contentState.versionId,
        contentId,
        list,
      }
    : {
        applicationId: contentState.applicationId,
        versionId: contentState.versionId,
        contentId,
      };
  await versionApi.updateContent(param);
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
