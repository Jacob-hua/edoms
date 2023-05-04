<template>
  <div v-show="props.tableData.length" class="table-list">
    <div v-for="(itm, idx) in state.tableDataList" :key="idx" class="table-item-list">
      <div class="left-ft"></div>
      <div class="right-content">
        <div class="name">{{ itm.label }}</div>
        <div class="value-unit">
          <span class="value">{{ itm.dataValue ?? '--' }}</span>
          <span class="unit">{{ itm.unit }}</span>
        </div>
        <div v-show="itm.calculateType === 'ALL' || itm.calculateType === 'MOM'" class="font-value-turn">
          <span class="font">{{ `${state.dateType.key}环比` }}</span>
          <!-- :style="{ color: getStyle(itm) }" -->
          <span class="value-to" :style="{ color: getStyle(itm, 'momTrend') }">{{ itm.momRatio }}%</span>
          <span v-show="itm.momTrend === 'flat'" class="turn-flat">--</span>
          <span v-show="itm.momTrend === 'up'" class="turn-up"></span>
          <span v-show="itm.momTrend === 'down'" class="turn-down"></span>
        </div>
        <div v-show="itm.calculateType === 'ALL' || itm.calculateType === 'YOY'" class="font-value-turn">
          <span class="font">{{ `${state.dateType.key}同比` }}</span>
          <!-- :style="{ color: getStyle(itm) }" -->
          <span class="value-to" :style="{ color: getStyle(itm, 'yoyTrend') }">{{ itm.yoyRatio }}%</span>
          <span v-show="itm.yoyTrend === 'flat'" class="turn-flat">--</span>
          <span v-show="itm.yoyTrend === 'up'" class="turn-up"></span>
          <span v-show="itm.yoyTrend === 'down'" class="turn-down"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, withDefaults } from 'vue';

import { Category } from '../type';

interface CumulativeList extends Category {
  dataValue: string;
  momRatio: string;
  momTrend: 'up' | 'down' | 'flat';
  yoyRatio: string;
  yoyTrend: 'up' | 'down' | 'flat';
}

const props = withDefaults(
  defineProps<{
    tableData: Array<Category>;
  }>(),
  {
    tableData: () => [],
  }
);

const state = reactive<{
  tableDataList: Array<CumulativeList>;
  optionsList: Array<{ [key: string]: string }>;
  dateType: { [key: string]: string };
}>({
  tableDataList: [],
  optionsList: [
    {
      text: '无',
      value: 'NONE',
    },
    {
      text: '环比',
      value: 'MOM',
    },
    {
      text: '同比',
      value: 'YOY',
    },
    {
      text: '全部',
      value: 'ALL',
    },
  ],
  dateType: {},
});

const getStyle = computed(() => (itm: any, type: string) => {
  const ft = itm[type];
  if (ft === 'flat') return '';
  if (ft === 'up') return 'rgba(215, 40, 36, 1)';
  if (ft === 'down') return 'rgba(53, 168, 99, 1)';
});

// const getFt = computed(() => (type: string) => {
//   const has = state.optionsList.filter((itm: { [key: string]: string }) => itm.value === type)[0];
//   if (has) {
//     return has.text;
//   } else {
//     return '--';
//   }
// });

const changeType = (itm: { [key: string]: any }) => {
  console.log('接口调用', itm);
  state.dateType = itm;
};

onBeforeMount(() => {
  props.tableData.forEach((itm: Category) => {
    state.tableDataList.push({
      ...itm,
      dataValue: '555',
      momRatio: '1',
      momTrend: 'down',
      yoyRatio: '33',
      yoyTrend: 'down',
    });
  });
});

defineExpose({
  changeType,
});
</script>

<style lang="scss" scoped>
.table-list {
  width: 100%;
  height: 260px;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .table-item-list {
    width: 100%;
    // height: 52px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // border-bottom: 1px solid rgba(0, 163, 255, 0.14);
    box-sizing: border-box;
    // padding: 0 10px;
    margin-bottom: 10px;
    .left-ft {
      width: 10px;
      height: 40px;
      background-image: url('../assets/table-left-icon.png');
      background-size: 100% 100%;
    }
    .right-content {
      width: calc(100% - 16px);
      background-color: rgba(0, 163, 255, 0.06);
      display: flex;
      justify-content: space-between;
      padding: 0 19px;
      box-sizing: border-box;
      .name {
        height: 40px;
        line-height: 40px;
        width: 25%;
        color: rgba(196, 229, 248, 1);
        font-size: 14px;
        font-family: MicrosoftYaHei;
      }
      .value-unit {
        width: 20%;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        .value {
          margin-right: 5px;
          color: rgba(0, 255, 240, 1);
        }
        .unit {
          color: rgba(196, 229, 248, 1);
        }
      }
      .font-value-turn {
        width: 25%;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        display: flex;
        .value-to {
          margin: 0 5px;
        }
        .turn-up {
          display: block;
          margin-top: 14px;
          width: 15px;
          height: 12px;
          background-image: url('../assets/add-icon.png');
          background-size: 100% 100%;
        }
        .turn-down {
          display: block;
          margin-top: 14px;
          width: 15px;
          height: 12px;
          background-image: url('../assets/desc-icon.png');
          background-size: 100% 100%;
        }
      }
    }
  }
}
.table-list::-webkit-scrollbar {
  width: 3px;
  height: 1px;
}

.table-list::-webkit-scrollbar-thumb {
  border-radius: 3px;
  // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  background: rgba(4, 70, 108, 1);
}

.table-list::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: transparent;
}
</style>
