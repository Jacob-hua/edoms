<template>
  <div class="eq-control" contenteditable="false">
    <div class="title-operation">
      <span class="zh-font">设备实控</span>
      <span class="en-font">EQUIPMENT CONTROL</span>
      <div :class="['operation-font', ctIdx === 1 ? 'active' : '']" @click="handlerToClick(1)">正在运行</div>
      <div :class="['operation-font', ctIdx === 2 ? 'active' : '']" @click="handlerToClick(2)">即将运行</div>
    </div>
    <div class="table-list">
      <div class="table-title">
        <div v-for="(title, index) in titleList" :key="index" class="title-item">{{ title.key }}</div>
      </div>
      <div class="table-ct">
        <div v-for="(item, index) in tableList" :key="index" class="table-item">
          <div v-for="(title, s) in titleList" :key="s" class="col-item">{{ item[title.value] }}</div>
        </div>
        <div v-show="!tableList.length" class="no-data">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import useApp from '../../useApp';

import getApi from './api';
import { AnaItemConfigs } from './type';

const props = defineProps<{
  config: AnaItemConfigs;
}>();

const ctIdx = ref<number>(1);

const { request } = useApp(props);

const { fetchRunningData } = getApi(request);

const titleList = ref<Array<{ [key: string]: number | string }>>([
  { key: '设备', value: 'ct' },
  { key: '状态', value: 'at' },
  { key: '参数', value: 'st' },
]);

const tableList = ref<Array<{ [key: string]: number | string }>>([
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
  { ct: '制冷站', at: '123', st: '12:21' },
]);

const handlerToClick = (type: number) => {
  ctIdx.value = type;
  if (ctIdx.value === 1) {
    tableList.value = [
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
      { ct: '制冷站', at: '123', st: '12:21' },
    ];
  } else {
    tableList.value = [];
  }
};

onMounted(async () => {
  fetchRunningData({}).then((res: any) => {
    console.log(res);
    // if () {}
  });
});
</script>

<style lang="scss" scoped>
.eq-control {
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
      flex: 0 0 70px;
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
      flex: 0 0 58px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
      cursor: pointer;
      margin-left: 10px;
      &.active {
        color: #1b9aff;
        border-bottom: 3px solid #1b9aff;
        box-sizing: border-box;
      }
    }
  }
  .table-list {
    width: 100%;
    height: 480px;
    margin-top: 15px;
    .table-title {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      border: 1px solid #464646;
      display: flex;
      background: #333c50;
      .title-item {
        width: 33.333%;
        height: 40px;
        border-right: 1px solid #464646;
        line-height: 40px;
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
        &:last-child {
          border-right: hidden;
        }
      }
    }
    .table-ct {
      width: 100%;
      max-height: 440px;
      overflow: hidden;
      overflow-y: auto;
      border: 1px solid #464646;
      border-top: hidden;
      box-sizing: border-box;
      .no-data {
        width: 100%;
        padding: 20px 0;
        box-sizing: border-box;
        text-align: center;
        color: rgba(255, 255, 255, 0.65);
        font-size: 14px;
      }
      .table-item {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        border-bottom: 1px solid #464646;
        display: flex;
        &:last-child {
          border-bottom: hidden;
        }
        .col-item {
          width: 33.333%;
          height: 40px;
          border-right: 1px solid #464646;
          line-height: 40px;
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          &:last-child {
            border-right: hidden;
          }
        }
      }
    }
  }
}
</style>
