<template>
  <div class="sys-setting" contenteditable="true">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="392" min-height="160">
      <div class="title-operation">
        <div class="operation-font" @click="handlerToClick">{{ '...' }}</div>
      </div>
      <div class="card-list">
        <div v-for="(itm, index) in costList.slice(0, 3)" :key="index" class="card-item">
          <div class="tip-st">
            <span class="count-st">{{ itm.value }}</span>
            <span class="unit-st">{{ itm.unit }}</span>
          </div>
          <span class="font-st">{{ itm.name }}</span>
        </div>
      </div>
      <div v-if="isShow" class="card-more">
        <div class="more-title" @click="handlerToClick">
          <div class="zh-font">{{ '<' }}</div>
          <span class="en-font">收起</span>
        </div>
        <div class="more-list">
          <div v-for="(itm, index) in costList.slice(3)" :key="index" class="card-item">
            <div class="tip-st">
              <span class="count-st">{{ itm.value }}</span>
              <span class="unit-st">{{ itm.unit }}</span>
            </div>
            <span class="font-st">{{ itm.name }}</span>
          </div>
        </div>
      </div>
    </BusinessCard>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';

import getApi from './api';
import { AnaItemConfigs } from './type';

const props = defineProps<{
  config: AnaItemConfigs;
}>();

const { request } = useApp(props);

const { fetchRealData } = getApi(request);

const isShow = ref<boolean>(false);

const costList = ref<Array<{ [key: string]: number | string }>>([
  // {
  //   name: '供水温度',
  //   value: '123',
  //   unit: '°C',
  //   id: '',
  // },
]);

const handlerToClick = () => {
  isShow.value = !isShow.value;
};

const getData = async () => {
  const codeList: string[] = [];
  props.config.indicators.forEach((itm: any) => {
    codeList.push(itm.property);
  });
  const result = await fetchRealData({
    dataCodes: codeList,
  });
  result.forEach((itm: any) => {
    costList.value.forEach((cost: any) => {
      if (itm.propCode === cost.id) {
        cost.value = itm.propVal;
      }
    });
  });
};

const setData = () => {
  const data: any[] = [];
  if (!props.config.indicators) return;
  props.config.indicators.forEach((itm: any) => {
    data.push({
      name: itm.label,
      value: '-',
      id: itm.property,
      unit: itm.unit,
    });
  });
  costList.value = data;
  getData();
};

watch(
  () => props.config.indicators,
  () => {
    setData();
  }
);

onMounted(() => {
  setData();
});
</script>

<style lang="scss" scoped>
@keyframes setSt {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
.sys-setting {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .title-operation {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    line-height: 20px;
    position: absolute;
    right: 20px;
    top: 11px;
    z-index: 9999;
    .zh-font {
      flex: 0 0 100px;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
    }
    .en-font {
      width: 100%;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.45);
      margin-left: 5px;
    }
    .operation-font {
      flex: 0 0 20px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      line-height: 20px;
    }
  }
  .card-list {
    width: 100%;
    height: 56px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    text-align: center;
    .card-item {
      width: 33%;
      height: 56px;
      .tip-st {
        width: 100%;
        height: 25px;
        line-height: 25px;
        text-align: center;
        .count-st {
          color: #00ff00;
          font-weight: 900;
          font-size: 14px;
        }
        .unit-st {
          color: rgba(255, 255, 255, 0.65);
          font-weight: 300;
          font-size: 12px;
          margin-left: 5px;
        }
      }
      .font-st {
        width: 100%;
        height: 25px;
        margin-top: 6px;
        color: rgba(255, 255, 255, 0.65);
        font-size: 14px;
      }
    }
  }
  .card-more {
    height: 200px;
    background-color: rgba(39, 45, 54, 0.8);
    border-radius: 8px;
    padding: 12px 10px 30px 10px;
    box-sizing: border-box;
    position: absolute;
    left: 102%;
    top: 0;
    animation: setSt 0.5s linear forwards;
    z-index: 1000;
    .more-title {
      width: 75px;
      height: 20px;
      display: flex;
      cursor: pointer;
      .zh-font {
        color: rgba(255, 255, 255, 0.65);
        font-size: 20px;
        transform-origin: center center;
        transform: scale(0.8, 1.5);
        font-weight: 100;
        cursor: pointer;
      }
      .en-font {
        color: rgba(255, 255, 255, 0.65);
        line-height: 20px;
        font-size: 16px;
        margin-left: 5px;
      }
    }
    .more-list {
      width: 100%;
      height: 130px;
      margin-top: 10px;
      overflow: hidden;
      overflow-y: auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .card-item {
        width: 33%;
        height: 56px;
        text-align: center;
        .tip-st {
          width: 100%;
          height: 25px;
          line-height: 25px;
          text-align: center;
          .count-st {
            color: #00ff00;
            font-weight: 900;
            font-size: 14px;
          }
          .unit-st {
            color: rgba(255, 255, 255, 0.65);
            font-weight: 300;
            font-size: 12px;
          }
        }
        .font-st {
          width: 100%;
          height: 25px;
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
        }
      }
    }
  }
}
</style>
