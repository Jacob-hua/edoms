<template>
  <div class="cost-comparsion">
    <BusinessCard :title="config.title" :subtitle="config.subTitle" min-width="392" min-height="160">
      <div class="title-operation">
        <!-- <span class="zh-font">费用对比</span>
        <span class="en-font">COST COMPARSION</span> -->
        <div class="operation-font">{{ '>' }}</div>
      </div>
      <div class="card-list">
        <div class="left-card">
          <div class="icon-font">
            <div class="icon-wp"></div>
            <div class="font-wp">优化前</div>
          </div>
          <div class="count-font">
            <div class="count-wp">{{ beforecostInfo.value }} {{ beforecostInfo.unit }}</div>
            <div class="font-wp">{{ beforecostInfo.label }}</div>
          </div>
        </div>
        <div class="right-card">
          <div class="icon-font">
            <div class="icon-wp"></div>
            <div class="font-wp">优化后</div>
          </div>
          <div class="count-font">
            <div class="count-wp">{{ aftercostInfo.value }} {{ aftercostInfo.unit }}</div>
            <div class="font-wp">{{ aftercostInfo.label }}</div>
          </div>
        </div>
      </div>
    </BusinessCard>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { formatDate } from '@edoms/utils';

import BusinessCard from '../../BusinessCard.vue';
import useApp from '../../useApp';

import getApi from './api';
import { AnaItemConfigs } from './type';

const props = defineProps<{
  config: AnaItemConfigs;
}>();

const { request } = useApp(props);

const { fetchExecuteApi } = getApi(request);

//优化前数据
const beforecostInfo = ref({ value: '-', label: '', unit: '' });
//优化后数据
const aftercostInfo = ref({ value: '-', label: '', unit: '' });
//点位
const indicator = computed(() => props.config.indicators?.map(({ property }: { property: string }) => property));

const getCostData = async () => {
  if (!indicator.value || indicator.value.length <= 0) return;
  const time = formatDate(new Date(), 'YYYY-MM-DD');
  const requestParam = { codes: indicator.value.join(','), time };
  const result = await fetchExecuteApi({ apiCode: 'queryCostComparison', requestParam });
  if (!result || Object.keys(result).length <= 0) return;
  beforecostInfo.value.value = result.beforeValue ?? '-';
  aftercostInfo.value.value = result.afterValue ?? '-';
};

const fomatCostData = () => {
  if (!indicator.value || indicator.value.length <= 0) return;
  props.config.indicators.forEach(({ label, unit }: { label: string; unit: string }, index: number) => {
    if (index === 0) {
      beforecostInfo.value = { ...beforecostInfo.value, label, unit };
    }
    if (index === 1) {
      aftercostInfo.value = { ...aftercostInfo.value, label, unit };
    }
  });
};

onMounted(() => {
  fomatCostData();
  getCostData();
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
