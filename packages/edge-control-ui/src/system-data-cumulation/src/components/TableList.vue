<template>
  <div v-show="props.tableData.length" class="table-list">
    <div v-for="(itm, idx) in tableData" :key="idx" class="table-item-list">
      <div class="right-content">
        <!-- 名称 -->
        <div class="name">
          <span class="name-label" :title="itm.label">{{ itm.label }}</span>
        </div>
        <!-- 数值 -->
        <div class="data-value">
          <span class="value">{{ itm.dataValue === '--' ? '-' : itm.dataValue }}</span>
          <span class="value-unit-center">{{ itm.unit }}</span>
        </div>
        <!-- 增长趋势 -->
        <div class="data-trend">
          <div v-if="itm.calculateType === 'ALL' || itm.calculateType === 'QOQ'" class="font-value-turn">
            <span class="font">{{ `${state.dateType} ${t('环比')}` }}</span>
            <span v-show="itm.qoqTrend === 'flat'" class="turn-flat"></span>
            <span v-show="itm.yoyTrend === 'up'" class="turn-up"><img src="../assets/add-icon.png" alt="" /></span>
            <span v-show="itm.yoyTrend === 'down'" class="turn-down"><img src="../assets/desc-icon.png" alt="" /></span>
            <span class="value-to" :style="{ color: getStyle(itm, 'qoqTrend') }">
              {{ itm.qoqRatio === '--' ? '--' : itm.qoqRatio + '%' }}
            </span>
          </div>
          <div v-else-if="itm.calculateType === 'ALL' || itm.calculateType === 'YOY'" class="font-value-turn">
            <span class="font">{{ `${state.dateType} ${t('同比')}` }}</span>
            <span v-show="itm.yoyTrend === 'flat'" class="turn-flat"></span>
            <span v-show="itm.yoyTrend === 'up'" class="turn-up"><img src="../assets/add-icon.png" alt="" /></span>
            <span v-show="itm.yoyTrend === 'down'" class="turn-down"><img src="../assets/desc-icon.png" alt="" /></span>
            <span class="value-to" :style="{ color: getStyle(itm, 'yoyTrend') }">
              {{ itm.yoyRatio === '--' ? '--' : itm.yoyRatio + '%' }}
            </span>
          </div>
          <div v-else>
            <span class="value-to">{{ '--' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, withDefaults } from 'vue';

import useI18n from '../../../useI18n';
import { Category } from '../type';

interface CumulativeList extends Category {
  dataValue: string;
  qoqRatio: string;
  qoqTrend: 'up' | 'down' | 'flat';
  yoyRatio: string;
  yoyTrend: 'up' | 'down' | 'flat';
}
const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    tableData: Array<CumulativeList>;
  }>(),
  {
    tableData: () => [],
  }
);

const state = reactive<{
  dateType: string;
}>({
  dateType: t('日'),
});

const getStyle = computed(() => (itm: any, type: string) => {
  console.log('props', props.tableData);
  const ft = itm[type];
  if (ft === 'flat') return '';
  if (ft === 'up') return 'rgba(215, 40, 36, 1)';
  if (ft === 'down') return 'rgba(53, 168, 99, 1)';
});

const changeType = (itm: string) => {
  state.dateType = itm;
};

defineExpose({
  changeType,
});
</script>

<style lang="scss" scoped>
@mixin flex-center($align-items, $justify-content) {
  display: flex;
  align-items: $align-items;
  justify-content: $justify-content;
}

@mixin overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-list {
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  position: relative;

  .table-item-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-bottom: 10px;

    .right-content {
      width: 100%;
      background-color: rgba(255, 255, 255, 0.08);
      border-left: 4px solid rgba(255, 255, 255, 0.65);
      display: grid;
      grid-template-columns: 3fr 4fr 2fr;
      padding: 0 19px;
      box-sizing: border-box;
      white-space: nowrap;

      .name {
        @include overflow-ellipsis();
        padding-right: 10px;
        height: 40px;
        line-height: 40px;
        color: rgba(255, 255, 255, 0.65);
        font-size: 14px;
        font-family: MicrosoftYaHei;

        .name-label {
          display: inline-block;
          width: 100%;
          @include overflow-ellipsis();
        }
      }

      .value-unit {
        width: 25%;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        margin-left: 5px;
        @include flex-center('center', 'flex-end');

        .value {
          margin-right: 5px;
          color: rgba(0, 255, 240, 1);
          width: 50%;
        }

        .unit {
          color: rgba(196, 229, 248, 1);
          width: 50%;
        }
      }

      .font-value-turn {
        width: 25%;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        display: flex;
        align-items: center;

        .value-to {
          margin: 0 5px;
          width: 25%;
        }
      }
    }
  }
}

.data-value {
  @include flex-center(center, start);

  & > .value {
    font-size: 14px;
    font-weight: 700;
    color: rgb(0, 255, 0);
    margin-right: 5px;
  }
}

.data-trend {
  @include flex-center(center, start);

  .turn-up,
  .turn-down {
    display: block;
    width: 15px;
    margin: 0 10px;
    background-size: 100% 100%;
  }
}

.table-list::-webkit-scrollbar {
  width: 3px;
  height: 1px;
}

.table-list::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(4, 70, 108, 1);
}

.table-list::-webkit-scrollbar-track {
  border-radius: 3px;
  background: transparent;
}
</style>
