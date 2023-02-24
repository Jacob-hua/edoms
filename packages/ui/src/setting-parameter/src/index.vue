<template>
  <div class="setting">
    <BusinessCard title="设定参数" subtitle="SETTING PARAMETERS" min-width="392" min-height="160">
      <template #operation>
        <div :class="operatable" @click="handleShowMore">...</div>
      </template>
      <div class="setting-wrapper">
        <div
          v-for="(item, index) in initParameter"
          :key="index"
          class="parameter"
          @click="handleSettingParameter(item, index)"
        >
          <p class="value-wrapper">
            <span class="value overflow-ellipsis" :style="{ color: item.valueColor }" :title="item.value">{{
              item.value
            }}</span
            ><span class="unit">{{ item.unit }}</span>
          </p>
          <p class="label overflow-ellipsis">{{ item.name }}</p>
        </div>
      </div>
    </BusinessCard>
    <MoreParameters
      v-if="surplusParameterVisible"
      v-model:visible="surplusParameterVisible"
      :data="restParameter"
      @set-parameter="handleSetParameter"
    />
    <SettingDialog
      v-model:visible="settingDialogVisible"
      :parameter-data="parameter"
      @submit-parameter="submitParameter"
    ></SettingDialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';

import { elMessage } from '@edoms/design';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';

import MoreParameters from './component/MoreParameters.vue';
import SettingDialog from './component/SettingDialog.vue';
import apiFactory from './api';
import { FetchParametersReq, MParameterConfig, Parameter, UpdateParametersReq } from './type';

const props = defineProps<{
  config: MParameterConfig;
}>();

const { request, app, node } = useApp(props);

const targetType = String(node?.data.type);
const targetId = String(node?.data.id);
const applicationId = String(app?.config?.id);
const tenantId = String(app?.config?.tenantId);

const { fetchParametersData, updateParameterData } = apiFactory(request);

const parametersData = ref<Parameter[]>([]);
const parameter = reactive<Parameter>({
  name: '',
  value: '',
  unit: '',
  valueColor: '#00ff00',
});
const initParameter = ref<Parameter[]>([]);
const restParameter = ref<Parameter[]>([]);
const surplusParameterVisible = ref<boolean>(false);
const settingDialogVisible = ref<boolean>(false);

const parameterIndex = ref<number>(0);

const parameterConfig = computed<Parameter[]>(() => props.config.parameters ?? []);
const operatable = computed(() => (restParameter.value.length ? 'operation' : 'dis-operation'));

watch(
  () => props.config,
  ({ parameters, visibleNumber }) => {
    if (!parameters) return;
    parametersData.value = parameterConfig.value;
    if (parametersData.value.length > visibleNumber) {
      initParameter.value = parametersData.value?.slice(0, visibleNumber);
      restParameter.value = parametersData.value?.slice(visibleNumber);
    } else {
      initParameter.value = parametersData.value;
      restParameter.value = [];
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const fetchSettingData = async () => {
  const params: FetchParametersReq = {
    list: targetId,
    applicationId: applicationId,
    tenantId: tenantId,
  };
  const result = await fetchParametersData(params);
  if (!result || result.length <= 0) {
    return;
  }
  const targetComponent = result.filter(({ componentIdentify }) => componentIdentify === targetId).pop();
  if (!targetComponent || targetComponent.dataSetting.length <= 0) {
    return;
  }
  parametersData.value = targetComponent.dataSetting;
  initParameter.value = targetComponent.dataSetting?.slice(0, props.config.visibleNumber);
  restParameter.value = targetComponent.dataSetting?.slice(props.config.visibleNumber);
};

const setParameters = async () => {
  const params: UpdateParametersReq = [
    {
      componentType: targetType,
      componentIdentify: targetId,
      dataSetting: parametersData.value,
      applicationId: applicationId,
      tenantId: tenantId,
    },
  ];
  try {
    await updateParameterData(params);
    elMessage.success('设置成功');
    settingDialogVisible.value = false;
  } catch (e: any) {
    console.log(e);
  }
};

const handleSetParameter = (item: Parameter, index: number) => {
  parameter.name = item.name;
  parameter.unit = item.unit;
  parameter.value = item.value;
  parameter.valueColor = item.valueColor;
  parameterIndex.value = index + props.config.visibleNumber;
  settingDialogVisible.value = true;
};

const handleSettingParameter = (item: Parameter, index: number) => {
  parameter.name = item.name;
  parameter.unit = item.unit;
  parameter.value = item.value;
  parameter.valueColor = item.valueColor;
  parameterIndex.value = index;
  settingDialogVisible.value = true;
};

const submitParameter = async (value: Parameter) => {
  parametersData.value.splice(parameterIndex.value, 1, value);
  await setParameters();
  await fetchSettingData();
};

const handleShowMore = () => {
  // 没有更多数据时展开无法点击触发
  restParameter.value?.length && (surplusParameterVisible.value = true);
};
fetchSettingData();
</script>

<style lang="scss" scoped>
.setting {
  display: flex;

  .overflow-ellipsis {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .operation {
    font-size: 28px;
    cursor: pointer;
    position: relative;
    top: -10px;
    width: 20px;
    height: 20px;
    color: #ffffff85;
    text-align: center;
  }

  .dis-operation {
    font-size: 28px;
    position: relative;
    top: -10px;
    width: 20px;
    height: 20px;
    color: #ffffff45;
    text-align: center;
    cursor: default;
  }

  .setting-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    align-items: flex-start;
    height: 100%;

    .parameter {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 32px;
      padding: 8px;
      cursor: pointer;
      max-width: 120px;
      box-sizing: border-box;

      .value-wrapper {
        display: flex;
        margin-bottom: 4px;
        width: 100%;

        .value {
          font-weight: 500;
          font-size: 16px;
          color: lawngreen;
          margin-right: 8px;
        }
      }

      .label {
        margin: 0;
        padding: 0;
        font-size: 14px;
        text-align: center;
      }
    }
  }
}
</style>
