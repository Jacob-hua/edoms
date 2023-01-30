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
          <div :class="item.parameterClass">{{ item.displayParameter }}</div>
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
  height: 370px;
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
    width: 250px;

    .setting-wrapper {
      display: grid;
      grid-template-columns: 33.3% 33.3% 33.3%;
      grid-template-rows: 33.3% 33.3% 33.3%;

      & > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        width: 72px;
        height: 90px;

        .parameter {
          font-size: 14px;
          margin-bottom: 8px;
        }

        .parameter-normal {
          color: #00ff00;
        }

        .parameter-warn {
          color: #ff9b00;
        }

        .parameter-danger {
          color: #ff4700;
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
        color: #ffffff85;
        width: 80px;
        font-size: 14px;
        text-align: center;
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
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
