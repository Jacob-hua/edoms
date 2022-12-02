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
        <div v-for="({ label, unit, value }, index) in currentPageData" :key="index" class="parameter">
          <p class="value-wrapper">
            <span class="value">{{ value }}</span
            ><span class="unit">{{ unit }}</span>
          </p>
          <p class="label">{{ label }}</p>
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
* {
  margin: 0;
  padding: 0;
}
.container {
  position: relative;
  height: 400px;
  margin-left: 10px;
  background-color: #2c2c2c;
  .header-top {
    padding: 10px 0 10px 10px;
    .top-wrapper {
      cursor: pointer;
    }
    .header-text {
      color: #fff;
      font-size: 17px;
    }
    .header-back {
      font-size: 20px;
      color: #fff;
    }
  }
  .parameter-wrapper {
    width: 480px;
    .setting-wrapper {
      display: grid;
      grid-template-columns: 33.3% 33.3% 33.3%;
      grid-template-rows: 33.3% 33.3% 33.3%;
      padding-left: 80px;
      padding-top: 30px;
      .parameter {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 20%;
        margin-bottom: 30px;
        .value-wrapper {
          margin-bottom: 10px;
          .value {
            font-weight: 500;
            font-size: 18px;
            color: lawngreen;
            margin-right: 8px;
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
  position: absolute;
  bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
