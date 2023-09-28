<template>
  <div class="cost-comparsion">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="392" min-height="160">
      <div class="title-operation">
        <!-- <span class="zh-font">费用对比</span>
        <span class="en-font">COST COMPARSION</span> -->
        <div class="operation-font" @click="handlerToClick">{{ '>' }}</div>
      </div>
      <div class="card-list">
        <div class="left-card">
          <div class="icon-font">
            <div class="icon-wp"></div>
            <div class="font-wp">优化前</div>
          </div>
          <div class="count-font">
            <div class="count-wp">{{ cft[0] && cft[0].value }} {{ cft[0] && cft[0].unit }}</div>
            <div class="font-wp">{{ cft[0] && cft[0].name }}</div>
          </div>
        </div>
        <div class="right-card">
          <div class="icon-font">
            <div class="icon-wp"></div>
            <div class="font-wp">优化后</div>
          </div>
          <div class="count-font">
            <div class="count-wp">{{ cft[1] && cft[1].value }} {{ cft[1] && cft[1].unit }}</div>
            <div class="font-wp">{{ cft[1] && cft[1].name }}</div>
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

const emit = defineEmits<{
  (event: 'openDetail'): void;
}>();

const { request } = useApp(props);

const { fetchRealData } = getApi(request);

const cft = ref<
  Array<{
    name: string;
    unit: string;
    id: string;
    value: any;
  }>
>([
  {
    name: '',
    unit: '',
    id: '',
    value: '-',
  },
  {
    name: '',
    unit: '',
    id: '',
    value: '-',
  },
]);

// const costList = ref<Array<number | string>>(['-', '-']);

const handlerToClick = () => {
  emit('openDetail');
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
    cft.value.forEach((cost: any) => {
      if (itm.propCode === cost.id) {
        cost.value = itm.propVal;
      }
    });
  });
};

const setDate = () => {
  const datas: any[] = [];
  if (!props.config.indicators) return;

  props.config.indicators.forEach((itm: any) => {
    datas.push({
      name: itm.label,
      value: '-',
      id: itm.property,
      unit: itm.unit,
    });
  });
  cft.value = datas;
  getData();
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
.cost-comparsion {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .title-operation {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    line-height: 20px;
    position: absolute;
    right: 20px;
    top: 16px;
    z-index: 9999;
    .zh-font {
      flex: 0 0 75px;
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
      flex: 0 0 16px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 20px;
      transform-origin: center center;
      transform: scale(0.8, 1.5);
      font-weight: 100;
      cursor: pointer;
    }
  }
  .card-list {
    width: 100%;
    height: calc(100% - 24px - 25px);
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;
    .left-card {
      width: 48%;
      height: 76px;
      border-left: 3px solid #1b9aff;
      box-sizing: border-box;
      background: rgba(27, 154, 255, 0.1);
      padding: 10px 5px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .icon-font {
        width: 40%;
        height: 56px;
        .icon-wp {
          width: 100%;
          height: 30px;
          background-image: url('./assets/icon-bf.png');
          background-repeat: no-repeat;
          background-size: 30px 30px;
          background-position: center center;
        }
        .font-wp {
          width: 100%;
          height: 20px;
          line-height: 20px;
          text-align: center;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
        }
      }
      .count-font {
        width: 55%;
        height: 56px;
        .count-wp {
          width: 100%;
          line-height: 20px;
          height: 30px;
          color: #1b9aff;
        }
        .font-wp {
          width: 100%;
          height: 20px;
          line-height: 20px;
          text-align: center;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
        }
      }
    }
    .right-card {
      width: 48%;
      height: 76px;
      border-left: 3px solid #0f0;
      box-sizing: border-box;
      background: rgba(0, 255, 0, 0.05);
      padding: 10px 5px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .icon-font {
        width: 40%;
        height: 56px;
        .icon-wp {
          width: 100%;
          height: 30px;
          background-image: url('./assets/icon-at.jpg');
          background-repeat: no-repeat;
          background-size: 30px 30px;
          background-position: center center;
        }
        .font-wp {
          width: 100%;
          height: 20px;
          line-height: 20px;
          text-align: center;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
        }
      }
      .count-font {
        width: 55%;
        height: 56px;
        .count-wp {
          width: 100%;
          line-height: 20px;
          height: 30px;
          color: #0f0;
        }
        .font-wp {
          width: 100%;
          height: 20px;
          line-height: 20px;
          text-align: center;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 14px;
        }
      }
    }
  }
}
</style>
