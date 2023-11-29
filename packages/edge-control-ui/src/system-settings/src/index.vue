<template>
  <div class="sys-setting" contenteditable="true">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="392" min-height="160">
      <div class="title-operation">
        <div class="operation-font" @click="handlerToClick">{{ '...' }}</div>
      </div>
      <div class="card-list">
        <div v-for="(itm, index) in costList.slice(0, 3)" :key="index" class="card-item">
          <div class="tip-st">
            <span class="count-st">{{ itm.value || '0' }}</span>
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
              <span class="count-st">{{ itm.value || '0' }}</span>
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
import { computed, ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';
import useIntervalAsync from '../../useIntervalAsync';

import getApi from './api';
import { AnaItemConfigs, ExecuteComparsionData } from './type';

const props = defineProps<{
  config: AnaItemConfigs;
}>();

const { request } = useApp(props);

const { fetchExecuteApi } = getApi(request);

const isShow = ref<boolean>(false);

const costList = ref<ExecuteComparsionData[]>([]);

//点位属性
const costPropertys = computed(() => props.config.indicators?.map(({ property }: { property: string }) => property));

//点位名称
const costNames = computed(() => props.config.indicators?.map(({ label }: { label: string }) => label));

//轮询间隔
const intervalDelay = computed<number>(() =>
  typeof props.config.intervalDelay !== 'number' ? 10 : props.config.intervalDelay
);

const handlerToClick = () => (isShow.value = !isShow.value);

const getData = async () => {
  if (!costPropertys.value || costPropertys.value.length <= 0) return;
  const result = await fetchExecuteApi({
    apiCode: 'queryTplParamValue',
    requestParam: {
      codes: costPropertys.value.join(','),
      names: costNames.value.join(','),
    },
  });
  if (!result || result.length <= 0) return;
  costList.value = result;
};

useIntervalAsync(getData, intervalDelay.value);
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
    animation: setSt 0.1s linear forwards;
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
