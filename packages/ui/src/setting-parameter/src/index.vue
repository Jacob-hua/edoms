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
            <span class="value">{{ item.propValue }}</span
            ><span class="unit">{{ item.propUnit }}</span>
          </p>
          <p class="label">{{ item.propName }}</p>
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
import { computed, onMounted, reactive, ref, watch } from 'vue';

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
  propName: '',
  propValue: '',
  propUnit: '',
});
const initParameter = ref<Parameter[]>([]);
const restParameter = ref<Parameter[]>([]);
const surplusParameterVisible = ref<boolean>(false);
const settingDialogVisible = ref<boolean>(false);

const parameterIndex = ref<number>(0);

const operatable = computed(() => (restParameter.value.length ? 'operation' : 'dis-operation'));

watch(
  () => props.config,
  ({ parameters, visibleNumber }) => {
    initParameter.value = parameters?.slice(0, visibleNumber);
    restParameter.value = parameters?.slice(visibleNumber) ?? [];
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
  if (result.length <= 0) {
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
  parameter.propName = item.propName;
  parameter.propUnit = item.propUnit;
  parameter.propValue = item.propValue;
  parameterIndex.value = index + props.config.visibleNumber;
  settingDialogVisible.value = true;
};

const handleSettingParameter = (item: Parameter, index: number) => {
  parameter.propName = item.propName;
  parameter.propUnit = item.propUnit;
  parameter.propValue = item.propValue;
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

onMounted(async () => {
  await fetchSettingData();
});
</script>

<style lang="scss" scoped>
.setting {
  display: flex;

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
    justify-content: space-around;
    padding: 0 16px;
    .parameter {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: auto;
      margin-top: 32px;
      padding: 8px;
      cursor: pointer;

      .value-wrapper {
        margin-bottom: 4px;

        .value {
          font-weight: 500;
          font-size: 18px;
          color: lawngreen;
          margin-right: 8px;
        }
      }

      .label {
        margin: 0;
        padding: 0;
        width: 80px;
        font-size: 16px;
        text-align: center;
        height: 60px;
      }
    }
  }
}
</style>
