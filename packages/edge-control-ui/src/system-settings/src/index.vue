<template>
  <div class="sys-setting" contenteditable="true">
    <div class="title-operation">
      <span class="zh-font">系统设定参数</span>
      <span class="en-font">SYSTEM SETTING PARAMETERS</span>
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

import { AnaItemConfigs } from './type';

const props = defineProps<{
  config: AnaItemConfigs;
}>();

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

const setDate = () => {
  const datas: any[] = [];
  props.config.indicators.forEach((itm: any) => {
    datas.push({
      name: itm.label,
      value: '-',
      id: itm.instance,
      unit: itm.unit,
    });
  });
  costList.value = datas;
};

watch(
  () => props.config.indicators,
  () => {
    setDate();
  }
);

onMounted(() => {
  setDate();
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
  background: rgba(39, 45, 54, 1);
  padding: 12px 16px;
  box-sizing: border-box;
  position: relative;
  .title-operation {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    line-height: 20px;
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
      line-height: 8px;
    }
  }
  .card-list {
    width: 100%;
    height: 56px;
    margin-top: 25px;
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
