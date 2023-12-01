<template>
  <BusinessCard :title="props.config.title" :subtitle="props.config.subTitle" min-width="392" min-height="261">
    <div class="wrap-body">
      <div class="device-type-box">
        <tab-scroll
          :list="deviceTypeList"
          :cur-code="currentFirstIndex"
          :count="4"
          :no-bg="true"
          @tab-change="changeFirstTab"
        ></tab-scroll>
      </div>
      <div class="scroll-box">
        <tab-scroll :list="deviceList" :cur-code="currentSecondIndex" @tab-change="changeSecondTab"></tab-scroll>
      </div>
      <div>
        <data-com :list="deviceRunParams" :is-wrap="true"></data-com>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import DataCom from './components/DataCom.vue';
import TabScroll from './components/TabScroll.vue';
import apiFactory from './api';
import { EqDataList } from './type';

const props = defineProps<{
  config: EqDataList;
}>();

const { request } = useApp(props);
const { fetchExecuteApi } = apiFactory(request);

//轮询间隔
const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

/*
组装tabs数据
*/
const deviceTypeList = ref();

//first tabs
const currentFirstIndex = ref(0);
const deviceList = ref();

const changeFirstTab = (index: number) => {
  currentFirstIndex.value = index;
  deviceList.value = deviceTypeList.value?.[currentFirstIndex.value]?.nameGroup?.map((item: any, index: number) => {
    return {
      ...item,
      name: item.deviceName,
      index,
    };
  });
  changeSecondTab(0);
};

//second tabs
const currentSecondIndex = ref(0);
const deviceRunParams = ref();

const instacePropertys = computed(() => deviceRunParams.value?.map(({ property }: { property: string }) => property));
const instaceNames = computed(() => deviceRunParams.value?.map(({ label }: { label: string }) => label));

const changeSecondTab = (index: number) => {
  currentSecondIndex.value = index;
  deviceRunParams.value = deviceList.value?.[currentSecondIndex.value].propGroup?.map(
    (item: { label: string; unit: string }) => {
      return {
        ...item,
        name: item.label,
        value: '',
        unit: item.unit,
      };
    }
  );
};

const getDeviceList = () => {
  const deviceGroup = props.config.deviceGroup || [];
  deviceTypeList.value = deviceGroup.map((item, index) => {
    return {
      ...item,
      name: item.group,
      index,
    };
  });
  changeFirstTab(currentFirstIndex.value);
};

//更新数据
const updateRealData = async () => {
  if (!instacePropertys.value || instacePropertys.value.length <= 0) return;
  const requestParam = {
    codes: instacePropertys.value.join(','),
    names: instaceNames.value.join(','),
  };
  const result = await fetchExecuteApi({
    apiCode: 'queryTplParamValue',
    requestParam,
  });

  if (!result || result.length <= 0) return;
  result.forEach((item) => {
    deviceRunParams.value.forEach(
      (device: { property: string; value: number | string; unit: string; name: string; precision: string }) => {
        if (item.code === device.property) {
          const realValue = item.value;
          device.value = isNaN(Number(realValue)) ? realValue : formatPrecision(Number(realValue), device.precision);
          device.name = item.name ? item.name : device.name;
          device.unit = item.unit ? item.unit : device.unit;
        }
      }
    );
  });
};

watch(
  () => props.config.deviceGroup,
  () => {
    getDeviceList();
  },
  { immediate: true }
);

watch(
  () => instacePropertys.value,
  () => {
    updateRealData();
  },
  { immediate: true }
);

useIntervalAsync(updateRealData, intervalDelay.value);
</script>

<style lang="scss" scoped>
.wrap-body {
  width: 100%;
  height: 200px;
  background-color: #272d36;
  .device-type-box {
    width: 100%;
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 14px;
    color: rgba(#fff, 0.65);
    display: flex;
    > div {
      flex: 1;
      text-align: center;
      cursor: pointer;
    }
    .active-type {
      color: #1b9aff;
      border-bottom: 2px solid #1b9aff;
    }
  }
  .scroll-box {
    display: flex;
    width: 100%;
    height: 24px;
    margin: 10px 0;
  }
  @keyframes bling {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 0.25;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  .wrap-list {
    width: 100%;
    height: 160px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    .list {
      height: 50%;
      position: relative;
      img {
        margin-top: 46px;
        margin-left: 27px;
        width: 85px;
        height: 20px;
      }
      .wrap-val {
        position: absolute;
        width: 100%;
        top: 24px;
        height: 22px;
        display: flex;
        justify-content: center;

        .val {
          font-size: 22px;
          font-family: Source Han Sans SC VF;
          font-weight: bold;
          color: #ffffff;
          margin-right: 4px;
        }
        .unit {
          font-size: 12px;
          font-family: Source Han Sans SC VF;
          font-weight: 400;
          color: #9fc2ea;
          line-height: 32px;
        }
      }
      .label {
        position: absolute;
        top: 60px;
        left: 20px;
        width: 100px;
        height: 14px;
        //   display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-family: Source Han Sans SC VF;
        font-weight: 400;
        color: #9fc2ea;
        line-height: 14px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}
</style>
