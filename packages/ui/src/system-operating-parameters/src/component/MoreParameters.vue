<template>
  <div class="container">
    <div class="header-top">
      <span class="top-wrapper" @click="handleClose">
        <span class="header-back">＜</span>
        <span class="header-text">收起</span>
      </span>
    </div>
    <div class="parameter-wrapper">
      <div class="setting-wrapper">
        <div v-for="({ name, unit, value }, index) in currentPageData" :key="index" class="parameter">
          <p class="value-wrapper">
            <span class="value overflow-ellipsis" :title="value">{{ value }}</span
            ><span class="unit">{{ unit }}</span>
          </p>
          <p class="label overflow-ellipsis">{{ name }}</p>
        </div>
      </div>
      <div class="page">
        <ElPagination
          layout="prev, pager, next"
          :total="total"
          :cur-page="currentPage"
          :page-size="limit"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></ElPagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { ElPagination } from '@edoms/design';

import { Parameter } from '../type';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    data: Parameter[];
    limit?: number;
  }>(),
  {
    limit: () => 9,
  }
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

const currentPage = ref<number>(1);

const total = computed(() => props.data.length);

const pagingSliceStartAndEnd = ({ currentPage, limit }: { currentPage: number; limit: number }) => {
  return [(currentPage - 1) * limit, currentPage * limit];
};

const currentPageData = computed(() =>
  props.data?.slice(
    ...pagingSliceStartAndEnd({
      currentPage: currentPage.value,
      limit: props.limit,
    })
  )
);
const handleClose = () => {
  emit('update:visible', false);
};

const handleSizeChange = (value: string) => {
  currentPage.value = Number(value);
};

const handleCurrentChange = (value: string) => {
  currentPage.value = Number(value);
};
</script>

<style lang="scss" scoped>
.overflow-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.container {
  position: relative;
  height: fit-content;
  margin-left: 10px;
  background-color: #2c2c2c;
  .header-top {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 16px 0 16px;
    .top-wrapper {
      cursor: pointer;
      color: #ffffff85;
      font-size: 16px;
    }
  }
  .parameter-wrapper {
    width: 392px;
    .setting-wrapper {
      display: grid;
      grid-template-columns: 33.3% 33.3% 33.3%;
      padding: 0 16px;
      .parameter {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        padding: 8px;
        box-sizing: border-box;
        .value-wrapper {
          margin-bottom: 8px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .value {
            font-weight: 500;
            font-size: 18px;
            color: lawngreen;
            margin-right: 4px;
          }
          .unit {
            color: #ffffff85;
          }
        }
        .label {
          color: #ffffff85;
          width: 80px;
          font-size: 16px;
          text-align: center;
        }
      }
    }
  }
}
:deep(.el-pagination) {
  background-color: transparent !important;
  .btn-prev {
    color: #fff;
    background-color: transparent !important;
  }
  .btn-next {
    color: #fff;
    background-color: transparent !important;
  }
  .el-pager {
    .number {
      color: #fff;
    }
    .is-active {
      color: #007acc;
    }
    li {
      background-color: transparent !important;
    }
  }
}
.page {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px 0;
}
</style>
