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
        <div v-for="(item, index) in currentPageData" :key="index" @click="handleClick(item)">
          <img :src="item.icon" />
          <div :title="item.displayParameter" class="parameter" :style="item.parameterStyle">
            <el-row>
              <el-col class="data-value" :span="14">{{ item.parameter }}</el-col>
              <el-col :span="10">{{ item.unit }}</el-col>
            </el-row>
          </div>
          <div class="label">{{ item.label }}</div>
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

import { Indicator } from '../index.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    data: Indicator[];
    limit?: number;
  }>(),
  {
    limit: () => 9,
  }
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'itemClick', value: Indicator): void;
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

const handleClick = (item: Indicator) => {
  emit('itemClick', item);
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
    width: 250px;

    .setting-wrapper {
      display: grid;
      grid-template-columns: 33.3% 33.3% 33.3%;

      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        width: 72px;
        height: 90px;
        margin: 4px;

        .parameter {
          font-size: 14px;
          margin-bottom: 8px;
          width: 100%;
          text-align: center;
          font-weight: bold;

          .data-value {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      img {
        width: 32px;
        height: 32px;
        margin-top: 16px;
        margin-bottom: 10px;
      }

      img[src=''],
      img:not([src]) {
        opacity: 0;
      }

      .label {
        font-size: 14px;
        font-weight: bold;
        color: #ffffff65;
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
