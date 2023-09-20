<template>
  <div class="wrap-control">
    <div class="label">{{ config.title }}：</div>
    <div class="wrap-radio">
      <div v-for="(item, index) in list" :key="item.controlName" class="radio">
        <div :class="{ active: activeRadio === index }" class="wrap_circle" @click="changeRadio(index)">
          <div :class="{ active: activeRadio === index }" class="circle"></div>
        </div>
        <div :class="{ active: activeRadio === index }" class="text">{{ item.controlName }}</div>
      </div>
      <!-- <div class="radio" v-for="item in radioList" :key="item.label">
        <div :class="{ active: activeRadio === item.value }" class="wrap_circle" @click="changeRadio(item)">
          <div :class="{ active: activeRadio === item.value }" class="circle"></div>
        </div>
        <div :class="{ active: activeRadio === item.value }" class="text">{{ item.label }}</div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

// import { formatPrecision } from '@edoms/utils';
// import useApp from '../../useApp';
// import useIntervalAsync from '../../useIntervalAsync';
// import apiFactory from './api';
import { ControlModeList } from './type';

const props = defineProps<{
  config: ControlModeList;
}>();

// const radioList = ref([
//   { label: '人工直控', value: 0 },
//   { label: '人工策略控制', value: 1 },
//   { label: 'AI智能控制', value: 2 },
// ]);

const activeRadio = ref(0);

const changeRadio = (index: number) => {
  if (activeRadio.value === index) return;
  activeRadio.value = index;
};

const list = computed(() => props.config.controlMode);

// const intervalDelay = computed<number>(() => {
//   if (typeof props.config.intervalDelay !== 'number') {
//     return 10;
//   }
//   return props.config.intervalDelay;
// });
// const { request } = useApp(props);
// const { fetchRealData, fetchCurveData } = apiFactory(request);

// // 请求数据
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

onMounted(() => {});
</script>

<style lang="scss" scoped>
.wrap-control {
  min-width: 400px;
  min-height: 20px;
  width: 100%;
  height: 100%;
  // background: red;
  display: flex;
  align-items: center;
  .label {
    font-size: 14px;
    font-weight: bold;
    color: rgba($color: #ffffff, $alpha: 0.85);
  }
  .wrap-radio {
    display: flex;
    flex: 1;
    align-items: center;
    .radio {
      display: flex;
      align-items: center;
      &:not(:last-child) {
        margin-right: 10px;
      }
      // margin-right: 20px;
      .wrap_circle {
        min-width: 10px;
        min-height: 10px;
        margin-right: 10px;
        border-radius: 50%;
        border: 1px solid #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          border: 1px solid #00ff00;
        }
        .circle {
          min-width: 6px;
          min-height: 6px;
          border-radius: 50%;
          background: #ffffff;
          &.active {
            background: #00ff00;
          }
        }
      }
      .text {
        font-size: 14px;
        font-weight: bold;
        color: rgba($color: #ffffff, $alpha: 0.85);
        &.active {
          color: #00ff00;
        }
      }
    }
  }
}
</style>
