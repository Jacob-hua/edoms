<template>
  <div class="eq-control" contenteditable="false">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="392" min-height="300">
      <div class="title-operation">
        <!-- <span class="zh-font">设备实控</span>
        <span class="en-font">EQUIPMENT CONTROL</span> -->
        <div :class="['operation-font', ctIdx === 1 ? 'active' : '']" @click="handlerToClick(1)">正在运行</div>
        <div :class="['operation-font', ctIdx === 2 ? 'active' : '']" @click="handlerToClick(2)">即将运行</div>
      </div>
      <div class="table-list">
        <div class="table-title">
          <div v-for="(title, index) in titleList" :key="index" class="title-item">{{ title.key }}</div>
        </div>
        <div class="table-ct">
          <div v-for="(item, index) in tableList" :key="index" class="table-item">
            <div
              v-for="(title, s) in titleList"
              :key="s"
              class="col-item"
              @mouseenter="handlerToEnter($event, item[title.value] as string)"
              @mouseleave="handlerToLeave"
            >
              {{ item[title.value] }}
            </div>
          </div>
          <div v-show="!tableList.length" class="no-data">暂无数据</div>
        </div>
      </div>
    </BusinessCard>
    <div v-show="font.length > 8" class="font-witter" :style="{ left: styleList.left, top: styleList.top }">
      {{ font }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';

import getApi from './api';
import { AnaItemConfigs } from './type';

const props = defineProps<{
  config: AnaItemConfigs;
}>();

const ctIdx = ref<number>(1);

const { request } = useApp(props);

const { fetchRunningData, fetchTableDataList } = getApi(request);

const titleList = ref<Array<{ [key: string]: number | string }>>([
  { key: '设备', value: 'ct' },
  { key: '状态', value: 'at' },
  { key: '参数', value: 'st' },
]);

const font = ref<string>('');

const styleList = ref<{ [key: string]: string }>({
  left: '0px',
  top: '0px',
});

const nowList = ref<Array<{ [key: string]: number | string }>>([]);

const nextList = ref<Array<{ [key: string]: number | string }>>([]);

const tableList = ref<Array<{ [key: string]: number | string }>>([]);

const handlerToClick = (type: number) => {
  ctIdx.value = type;
  if (ctIdx.value === 1) {
    tableList.value = nowList.value;
  } else {
    tableList.value = nextList.value;
  }
};

const handlerToEnter = (e: MouseEvent, ls: string) => {
  const { left, top } = (e.target as Element)?.getBoundingClientRect();
  styleList.value = {
    left: left + 'px',
    top: top - 50 + 'px',
  };
  font.value = ls;
};

const handlerToLeave = () => {
  font.value = '';
  styleList.value = {
    left: '',
    top: '',
  };
};

const setData = (list: Array<any>, newV: Array<any>) => {
  list.forEach((itm: any) => {
    itm.devIns.forEach((dev: any) => {
      newV.push({
        ct: dev.name,
        at: dev.state ? dev.state : '-',
        st: (() => {
          if (!dev.stateOps) return '-:-';
          const list = dev.stateOps.map((state: any) => state.label);
          return list.join(':');
        })(),
      });
    });
  });
};

onMounted(async () => {
  const list = await fetchRunningData({}).catch((err: any) => {
    console.log(err);
  });
  if (!list || !list.length) return;
  const params = list.filter((itm: any) => itm.name === '设备实控接口')[0];
  if (!params) return;
  const { result } = await fetchTableDataList({
    apiCode: params.code,
    requestParam: {
      lockedOrNot: false,
    },
  }).catch((err: any) => {
    console.log(err);
  });
  setData(result.nowList, nowList.value);
  setData(result.nextList, nextList.value);
  tableList.value = nowList.value;
});
</script>

<style lang="scss" scoped>
.eq-control {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .font-witter {
    overflow: hidden;
    min-width: 100px;
    padding: 8px 10px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    color: #fff;
    text-align: center;
  }
  .title-operation {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    line-height: 20px;
    position: absolute;
    right: 20px;
    top: 5px;
    z-index: 9999;
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
    height: 280px;
    margin-top: 15px;
    padding: 0 10px;
    box-sizing: border-box;
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
      max-height: 240px;
      overflow: hidden;
      overflow-y: auto;
      border: 1px solid #464646;
      border-top: hidden;
      box-sizing: border-box;
      overflow-y: auto;
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:last-child {
            border-right: hidden;
          }
        }
      }
    }
  }
}
</style>
