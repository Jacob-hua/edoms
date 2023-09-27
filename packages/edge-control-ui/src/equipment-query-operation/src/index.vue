<template>
  <BusinessCard :title="props.config.title" :subtitle="props.config.subTitle" min-width="522" min-height="261">
    <div class="wrap-body">
      <div class="device-type-box">
        <tab-scroll
          :list="deviceTypeList"
          :cur-code="curdeviceTypeCode"
          :count="4"
          :no-bg="true"
          @tab-change="typeChange"
        ></tab-scroll>
      </div>
      <div class="scroll-box">
        <tab-scroll :list="deviceList" :cur-code="curDeviceCode" @tab-change="tabScrollChange"></tab-scroll>
      </div>
      <div>
        <data-com :list="deviceRunParams" :is-wrap="true"></data-com>
      </div>
    </div>
  </BusinessCard>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';

import { formatPrecision } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import DataCom from './components/DataCom.vue';
import TabScroll from './components/TabScroll.vue';
import apiFactory from './api';
import { EqDataList } from './type';

// const defaultList = [
//   {
//     devType: 'waterChillingUnit',
//     devTypeName: '冷水机组',
//     devIns: [
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01ZLJ01003_MP0000000',
//         name: 'L-5基载主机',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01ZLJ01001_MP0000000',
//         name: 'L-1双工况主机',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01ZLJ01002_MP0000000',
//         name: 'L-2双工况主机',
//       },
//     ],
//   },
//   {
//     devType: 'chilledWaterPump',
//     devTypeName: '冷冻水泵',
//     devIns: [
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01012_MP0000000',
//         name: 'LB-1基载冷冻泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01013_MP0000000',
//         name: 'LB-2基载冷冻泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01014_MP0000000',
//         name: 'BB-1二次侧冷冻泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01015_MP0000000',
//         name: 'BB-2二次侧冷冻泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01016_MP0000000',
//         name: 'BB-B二次侧冷冻泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01017_MP0000000',
//         name: 'WB-1冷冻二级泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01018_MP0000000',
//         name: 'WB-2冷冻二级泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01019_MP0000000',
//         name: 'WB-3冷冻二级泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01020_MP0000000',
//         name: 'WB-4冷冻二级泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01021_MP0000000',
//         name: 'WB-5冷冻二级泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01022_MP0000000',
//         name: 'WB-6冷冻二级泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01023_MP0000000',
//         name: 'WB-7冷冻二级泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01024_MP0000000',
//         name: 'WB-8冷冻二级泵',
//       },
//     ],
//   },
//   {
//     devType: 'coolingWaterPump',
//     devTypeName: '冷却水泵',
//     devIns: [
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01002_MP0000000',
//         name: 'b-1冷却水泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01003_MP0000000',
//         name: 'b-2冷却水泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01004_MP0000000',
//         name: 'b-5冷却水泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LQB01003_MP0000000',
//         name: 'b-6冷却水泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01008_MP0000000',
//         name: 'b-B冷却水泵',
//       },
//     ],
//   },
//   {
//     devType: 'glyolPump',
//     devTypeName: '乙二醇泵',
//     devIns: [
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01009_MP0000000',
//         name: 'YB-1乙二醇泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01010_MP0000000',
//         name: 'YB-2乙二醇泵',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LDB01011_MP0000000',
//         name: 'YB-B乙二醇泵',
//       },
//     ],
//   },
//   {
//     devType: 'coolingTower',
//     devTypeName: '冷却塔',
//     devIns: [
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LQT01001_MP0000000',
//         name: '1#冷却塔',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LQT01002_MP0000000',
//         name: '2#冷却塔',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LQT01003_MP0000000',
//         name: '3#冷却塔',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01LQT01004_MP0000000',
//         name: '4#冷却塔',
//       },
//     ],
//   },
//   {
//     devType: 'iceStorageTank',
//     devTypeName: '蓄冰槽',
//     devIns: [
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01XBC01001_MP0000000',
//         name: '蓄冰槽',
//       },
//     ],
//   },
//   {
//     devType: 'exchanger',
//     devTypeName: '板换',
//     devIns: [
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01HRQ01001_MP0000000',
//         name: '1#板式换热器',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01HRQ01002_MP0000000',
//         name: '2#板式换热器',
//       },
//     ],
//   },
//   {
//     devType: 'controlValve',
//     devTypeName: '调节阀',
//     devIns: [
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01SDF01001_MP0000000',
//         name: 'V1',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01SDF01002_MP0000000',
//         name: 'V2',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01SDF01003_MP0000000',
//         name: 'V3',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01SDF01004_MP0000000',
//         name: 'V4',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01SDF01005_MP0000000',
//         name: 'V5',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01SDF01006_MP0000000',
//         name: 'V6',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01FA001005_MP0000000',
//         name: '南区旁通阀',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01FA001006_MP0000000',
//         name: '东区旁通阀',
//       },
//       {
//         tpl: 'PGY02014_SZL01001_STZL001001_U00000000_EQZL01FA001007_MP0000000',
//         name: '北区旁通阀',
//       },
//     ],
//   },
// ];

const props = defineProps<{
  config: EqDataList;
}>();
// // 一级菜单索引
// const fristIndex = ref<number>(0);
// // 二级菜单索引
// const secondIndex = ref<number>(0);
// // 当前点位code
// const dataCodes: string[] = [];
// // 当前点位对应数据
// const indicatorConfigs = computed<EqData[]>(
//   () =>
//     props.config.equipmentList.filter((item) => {
//       return item.group === props.config.typeGroups[fristIndex.value].group;
//     }) ?? []
// );

const intervalDelay = computed<number>(() => {
  if (typeof props.config.intervalDelay !== 'number') {
    return 60;
  }
  return props.config.intervalDelay;
});
const { request } = useApp(props);
const { fetchRealData } = apiFactory(request);

// const handlerToOperate = (itm: { [key: string]: any }, val: number) => {
//   if (val === fristIndex.value) return;
//   fristIndex.value = val;
//   secondIndex.value = 0;
//   updateParameterData();
// };
// const handlerToctIndex = (val: number) => {
//   secondIndex.value = val;
//   updateParameterData();
// };

// 请求数据
// const updateParameterData = async () => {
//   dataCodes.length = 0;
//   if (indicatorConfigs.value.length !== 0) {
//     indicatorConfigs.value.forEach((item: any) => {
//       if (item.pointList.length !== 0) {
//         item.pointList.forEach((params: { property: string }) => {
//           dataCodes.push(params.property);
//         });
//       }
//     });
//   }
//   if (dataCodes.length !== 0) {
//     const pointDataList = await fetchRealData({ dataCodes });
//     pointDataList.forEach((item) => {
//       indicatorConfigs.value[secondIndex.value].pointList?.forEach((element) => {
//         if (item.propCode === element.property) {
//           element.data = formatPrecision(Number(item.propVal), element.precision);
//         }
//       });
//     });
//   }
//   tableWrapper.value.changeType(indicatorConfigs.value, secondIndex.value);
// };
// useIntervalAsync(updateParameterData, intervalDelay.value);
// const deviceTypeList: any = ref([]);
const curdeviceTypeCode: any = ref(0);
const deviceList: any = ref([]);
const curDeviceCode = ref(0);
const deviceRunParams: any = ref([]);

// 当前点位对应数据
const deviceTypeList = computed<any>(() => {
  const arr: any = [];
  if (props.config.deviceGroup) {
    props.config.deviceGroup.map((item: any, index: number) => {
      arr.push({
        name: item.group,
        index,
      });
    });
  }
  return arr;
});

const typeChange = (item: any) => {
  curdeviceTypeCode.value = item;
  // deviceList.value = props.config.deviceGroup[curdeviceTypeCode.value].nameGroup.map((e: any) => e.deviceName);
  curDeviceCode.value = 0;
  getDeviceList();
  // getDeviceRunParams();
  // getDeviceList();
};
const getDeviceList = () => {
  const deviceGroup: any = props.config.deviceGroup ? props.config.deviceGroup[curdeviceTypeCode.value]?.nameGroup : [];
  const arr: any = [];
  if (deviceGroup.length > 0) {
    deviceGroup.forEach((item: any, index: number) => {
      arr.push({
        name: item.deviceName,
        index,
      });
    });

    deviceList.value = arr;
    getDeviceRunParams();
  }

  // for (const item of deviceTypeList.value) {
  //   if (item.devType === curdeviceTypeCode.value) {
  //     deviceList.value = item.devIns;
  //     curDeviceCode.value = deviceList.value[0].tpl;
  //     // getDeviceRunParams();
  //   }
  // }
};

const tabScrollChange = (item: any) => {
  curDeviceCode.value = item;
  getDeviceRunParams();
  // deviceRunParams.value = props.config.deviceGroup[curdeviceTypeCode.value].nameGroup[curDeviceCode.value].propGroup;
  // console.log('33333333333', deviceRunParams.value);
  // getDeviceRunParams();
};
const getDeviceRunParams = () => {
  const propGroup: any = props.config.deviceGroup[curdeviceTypeCode.value]?.nameGroup[curDeviceCode.value]?.propGroup;
  const dataCodes: string[] = propGroup.map((item: any) => item.property);
  if (dataCodes.length === 0) return;
  updateRealData();
  // const arr: any = [];
  // propGroup.forEach((item: any) => {
  //   arr.push({
  //     name: item.label,
  //     value: '',
  //     unit: item.unit,
  //   });
  // });
  // deviceRunParams.value = arr;
  // const res = await queryTplParamValue({ tplCode: curDeviceCode.value });
  // if (res?.result?.length) {
  //   deviceRunParams.value = res.result;
  // }
};

const updateRealData = async () => {
  const propGroup: any = props.config.deviceGroup
    ? props.config.deviceGroup[curdeviceTypeCode.value]?.nameGroup[curDeviceCode.value]?.propGroup
    : [];

  const dataCodes: string[] = propGroup.map((item: any): string => item.property);
  const arr: any = [];
  propGroup.forEach((item: any) => {
    arr.push({
      name: item.label,
      value: '',
      unit: item.unit,
      property: item.property,
    });
  });
  deviceRunParams.value = arr;
  if (dataCodes.length === 0) {
    return;
  }

  const result = await fetchRealData({ dataCodes });
  result.forEach(({ propVal, propCode }) => {
    const targetIndexs: number[] = [];
    deviceRunParams.value.forEach((item: any, index: number) => {
      if (propCode === item.property) {
        targetIndexs.push(index);
      }
    });
    if (targetIndexs.length <= 0) {
      return;
    }
    targetIndexs.forEach((targetIndex) => {
      const indicatorConfig = propGroup[targetIndex];
      const indicator = deviceRunParams.value[targetIndex];
      indicator.value = isNaN(Number(propVal)) ? propVal : formatPrecision(Number(propVal), indicatorConfig.precision);
      indicator.propCode = propCode;
      indicator.precision = indicatorConfig.precision;
      indicator.unit = indicatorConfig.unit;
    });
    // indicatorConfigs.value.forEach(({ property }, index) => {
    //   if (property === propCode) {
    //     targetIndexs.push(index);
    //   }
    // });
    // if (targetIndexs.length <= 0) {
    //   return;
    // }
    // targetIndexs.forEach((targetIndex) => {
    //   const indicatorConfig = indicatorConfigs.value[targetIndex];
    //   const indicator = indicators.value[targetIndex];
    //   indicator.parameter = isNaN(Number(propVal))
    //     ? propVal
    //     : formatPrecision(Number(propVal), indicatorConfig.precision);
    //   indicator.propCode = propCode;
    //   indicator.precision = indicatorConfig.precision;
    //   indicator.unit = indicatorConfig.unit;
    // });
  });
};

useIntervalAsync(updateRealData, intervalDelay.value);

watch(
  () => props.config.deviceGroup,
  () => {
    getDeviceList();
    // deviceList.value = newConfig[curdeviceTypeCode.value].nameGroup.map((e: any) => e.deviceName);
    // getDeviceRunParams();
    // deviceRunParams.value = newConfig[curdeviceTypeCode.value].nameGroup[curDeviceCode.value].propGroup;

    // deviceTypeList.value = newConfig.deviceGroup.map((item: any) => item.group);
  },
  { immediate: true }
);

// const getDeviceTypeList = async () => {
//   deviceTypeList.value = defaultList;
//   curdeviceTypeCode.value = deviceTypeList.value[0].devType;
//   const res = await fetchCurveData({
//     apiCode: 'eqRunningName',
//     requestParam: {
//       tplCode: 'devTypeTpl',
//     },
//   });

//   console.log(res);
//   // const res = await getTplAPI({ tplCode: 'devTypeTpl' });
//   // if (res?.result) {
//   //   const list = JSON.parse(res.result.tplContent);
//   //   deviceTypeList.value = list;
//   //   curdeviceTypeCode.value = deviceTypeList.value[0].devType;
//   //   getDeviceList();
//   // }
// };

onMounted(() => {
  // getDeviceTypeList();
  // getDeviceRunParams();
});
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
