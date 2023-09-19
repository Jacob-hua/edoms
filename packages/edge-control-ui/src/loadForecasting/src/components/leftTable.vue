<template>
  <div class="left-table-list">
    <div class="table-titles">
      <span>负荷预测记录</span>
    </div>
    <div class="form-day">
      <span class="day-font">时间选择</span>
      <el-date-picker
        v-model="pickerDate"
        :teleported="false"
        :editable="false"
        popper-class="datePickerDark"
        :append-to-body="false"
      ></el-date-picker>
      <div class="button-wrapper" @click="handlerToSearch">搜索</div>
    </div>
    <div class="table-wrapper">
      <div class="table-title">
        <div v-for="(itm, index) in state.tableTitleList" :key="index" class="title-item" :style="{ width: itm.width }">
          {{ itm.key }}
        </div>
        <div class="operation">操作</div>
      </div>
      <div
        v-for="(itm, index) in state.tableData"
        :key="index"
        class="table-content"
        :style="{ background: index % 2 ? '' : 'rgba(17, 22, 30, 0.9)' }"
      >
        <div
          v-for="(col, colIdx) in state.tableTitleList"
          :key="colIdx"
          class="table-item"
          :style="{ width: col.width }"
        >
          <span v-if="col.value === 'index'">{{ index + 1 }}</span>
          <span
            v-else-if="col.value === 'disRateVal'"
            :style="{ color: itm[col.value] as number > 0 ? 'rgba(0, 255, 0, 1)' : 'rgba(215, 40, 36, 1)' }"
            >{{ itm[col.value] }}%</span
          >
          <span v-else>{{ itm[col.value] }}</span>
        </div>
        <div class="operation" @click="handlerToDetail($event, itm)">详情</div>
      </div>
    </div>
    <div class="page-wrapper">
      <span class="left-page-icon" @click="handlerToAdd(-1)">{{ '<' }}</span>
      <div
        v-for="idx in totalPage"
        :key="idx"
        :class="['page-count', currentPage === idx ? 'active' : '']"
        @click="handlerToChangePage(idx)"
      >
        {{ idx }}
      </div>
      <span class="right-page-icon" @click="handlerToAdd(1)">{{ '>' }}</span>
      <span class="instr">共{{ totalPage }}页</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';

// const props = withDefaults(
//   defineProps<{
//     options: any;
//     width: number;
//     height: number;
//   }>(),
//   {
//     options: () => ({}),
//     width: 0,
//     height: 0,
//   }
// );

const pickerDate = ref<string | Date>(new Date());

const totalPage = ref<number>(4);

const currentPage = ref<number>(1);

const emit = defineEmits<{
  (event: 'getToDetail', item: { [key: string]: string | number }): void;
}>();

const state = reactive<{
  tableTitleList: Array<{ [key: string]: string }>;
  tableData: Array<{ [key: string]: string | number }>;
}>({
  tableTitleList: [
    { key: '序号', value: 'index', width: '10%' },
    { key: '时间', value: 'date', width: '24%' },
    { key: '实际值', value: 'realVal', width: '17%' },
    { key: '预测值', value: 'forSeeVal', width: '17%' },
    { key: '偏差率', value: 'disRateVal', width: '17%' },
  ],
  tableData: [
    { date: '2023-04-26 17:10', realVal: 633, forSeeVal: 622, disRateVal: 11 },
    { date: '2023-04-26 17:10', realVal: 633, forSeeVal: 622, disRateVal: -11 },
    { date: '2023-04-26 17:10', realVal: 633, forSeeVal: 622, disRateVal: -11 },
    { date: '2023-04-26 17:10', realVal: 633, forSeeVal: 622, disRateVal: 11 },
    { date: '2023-04-26 17:10', realVal: 633, forSeeVal: 622, disRateVal: -11 },
    { date: '2023-04-26 17:10', realVal: 633, forSeeVal: 622, disRateVal: 11 },
  ],
});

const handlerToSearch = () => {
  console.log('search');
};

const handlerToChangePage = (idx: number) => {
  if (currentPage.value === idx) return;
  currentPage.value = idx;
};

const handlerToAdd = (num: number) => {
  if (num + currentPage.value > totalPage.value) return;
  if (num + currentPage.value < 1) return;
  currentPage.value += num;
};

const handlerToDetail = (e: any, itm: { [key: string]: string | number }) => {
  e.stopPropagation();
  emit('getToDetail', itm);
};

onMounted(() => {});

onUnmounted(() => {});
</script>

<style lang="scss" scoped>
:deep(.el-date-table td.current:not(.disabled) .el-date-table-cell__text) {
  color: #030507 !important;
}
.left-table-list {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(33, 44, 60, 1);
  background-color: rgba(9, 15, 23, 0.3);
  position: relative;
  .table-titles {
    width: 100%;
    height: 51px;
    border-bottom: 1px solid rgba(29, 38, 52, 1);
    box-sizing: border-box;
    line-height: 51px;
    padding: 0 12px;
    color: rgba(234, 245, 255, 1);
    font-size: 16px;
  }
  .form-day {
    margin-top: 19px;
    padding: 0 12px;
    box-sizing: border-box;
    width: 100%;
    // overflow: hidden;
    color: rgba(234, 245, 255, 1);
    font-size: 14px;
    line-height: 32px;
    display: flex;
    margin-bottom: 24px;
    position: relative;
    .day-font {
      margin-right: 12px;
    }
    .button-wrapper {
      width: 100px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background-color: rgba(0, 163, 255, 0.6);
      border-radius: 4px;
      cursor: pointer;
      margin-left: 20px;
    }
    // :deep(.el-input__wrapper) {
    //   background-color: rgba(3, 5, 7, 1);
    //   border: 1px solid rgba(33, 44, 60, 1);
    // }
    :deep(.el-input__wrapper) {
      background-color: rgba(3, 5, 7, 1);
      border: 1px solid rgb(69, 78, 114);
      box-shadow: none;
    }
    // :deep(.el-input__wrapper) {
    //   background-color: rgba(3, 5, 7, 1);
    //   border: 1px solid rgba(33, 44, 60, 1);
    //   box-shadow: none;
    // }
    :deep(.el-input__wrapper:hover) {
      box-shadow: none !important;
    }
    :deep(.el-input__inner) {
      color: #fff;
    }
  }
  .table-wrapper {
    width: 100%;
    height: 289px;
    padding: 0 12px;
    box-sizing: border-box;
    overflow: hidden;
    .table-title {
      width: 100%;
      height: 47px;
      background-color: rgba(17, 22, 30, 1);
      display: flex;
      .title-item {
        height: 47px;
        line-height: 47px;
        text-align: center;
        color: rgba(234, 245, 255, 1);
        font-size: 14px;
      }
      .operation {
        width: 15%;
        height: 47px;
        line-height: 47px;
        text-align: center;
        color: rgba(234, 245, 255, 1);
        font-size: 14px;
      }
    }
    .table-content {
      width: 100%;
      height: 47px;
      display: flex;
      .table-item {
        height: 47px;
        line-height: 47px;
        text-align: center;
        color: rgba(234, 245, 255, 1);
        font-size: 14px;
      }
      .operation {
        width: 15%;
        height: 47px;
        line-height: 47px;
        text-align: center;
        color: rgba(0, 163, 255, 1);
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .page-wrapper {
    width: auto;
    height: 24px;
    line-height: 24px;
    overflow: hidden;
    clear: both;
    display: flex;
    user-select: none;
    position: absolute;
    bottom: 10px;
    right: 12px;
    .left-page-icon {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      cursor: pointer;
      margin-right: 7px;
      transform-origin: center center;
      transform: scaleY(1.6);
    }
    .right-page-icon {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin: 0 22px 0 7px;
      cursor: pointer;
      transform-origin: center center;
      transform: scaleY(1.6);
    }
    .instr {
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
    }
    .page-count {
      width: 24px;
      height: 24px;
      color: rgba(255, 255, 255, 1);
      line-height: 24px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      &.active {
        background-color: rgba(0, 163, 255, 1);
      }
    }
  }
}
</style>
