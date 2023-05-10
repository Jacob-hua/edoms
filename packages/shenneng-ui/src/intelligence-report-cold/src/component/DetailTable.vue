<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-09 15:35:47
-->
<template>
  <div class="wrap-table">
    <div class="header">
      <img src="../assets/dialog_icon_report.png" alt="" class="icon-report" />
      <div class="label">详情</div>
      <div class="close" @click="closeDetailTable"></div>
    </div>
    <div class="report">
      <div class="table">
        <el-table
          :data="state.tableData"
          :style="{ ...state.tableStyle }"
          :header-cell-style="{
            background: '#11161E',
            color: '#C7C7C7',
            textAlign: 'center',
            fontSize: '14px',
            borderRight: '1px solid rgba(29, 38, 52, 0.6)',
            borderBottom: '1px solid rgba(29, 38, 52, 0.6)',
            height: '49px',
          }"
          :cell-style="getCellStyle"
        >
          <el-table-column v-for="item in state.titleList" :key="item.label" :prop="item.value" :label="item.label">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';

import { detailData, detailTitle } from '../mock';
import { MIntelligenceReport } from '../type';
const props = defineProps<{
  config: MIntelligenceReport;
  columnIndex: number;
}>();

const state: any = reactive({
  testData: [],
  titleList: [],
  tableData: [],
  tableStyle: {
    width: '100%',
    height: '610px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#C7C7C7',
    '--el-table-border-color': 'none',
  },
});

const getCellStyle = (params: any) => {
  const cellStyle: any = { textAlign: 'center', height: '51px' };
  if (params.columnIndex === 0) {
    cellStyle.background = '#11161E';
  }
  return cellStyle;
};

const handleTableData = () => {
  state.titleList = detailTitle;
  state.tableData = detailData;
};

const emit = defineEmits(['closeDetailTable']);

const closeDetailTable = () => {
  emit('closeDetailTable');
};

onMounted(() => {
  console.log(props.columnIndex);
  handleTableData();
});
</script>

<style lang="scss" scoped>
:deep .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
// :deep .el-table--striped tr {
//   background-color: green !important;
// }
.el-table::before {
  //最下面的白线
  background-color: transparent;
}
::v-deep .el-table tr {
  background-color: transparent !important;
}
::v-deep .el-table .el-table__body tr.el-table__row td {
  background: #030507;
}
::v-deep .el-table--enable-row-transition .el-table__body td.el-table__cell {
  border-bottom: 1px solid rgba($color: #1d2634, $alpha: 0.6) !important;
  border-right: 1px solid rgba($color: #1d2634, $alpha: 0.6) !important;
}
::v-deep .el-table--border .el-table__cell {
  border-bottom: 1px solid #41444c !important;
  border-right: 1px solid #41444c !important;
}

::v-deep .el-table--border,
.el-table--group {
  border: 1px solid #41444c !important;
}

:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
  resize: none;
  cursor: default;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
  cursor: default;
  background-color: rgba(5, 7, 10, 0.95);
  border: 1px solid #454e72;
  border-radius: 4px;

  .el-input__inner {
    cursor: default !important;
  }
}
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset !important;
  border: 1px solid #454e72;
}
:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset !important;
  border: 1px solid #454e72;
}
.el-popper.is-light {
  border: 1px solid #454e72;
}

.wrap-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .header {
    position: relative;
    width: 100%;
    min-height: 52px;
    display: flex;
    align-items: center;
    background: url(../assets/bg_header.png);
    background-size: cover;
    .icon-report {
      width: 22px;
      height: 24px;
      margin-left: 21px;
      margin-right: 16px;
      background-size: cover;
    }
    .label {
      color: #eaf5ff;
      font-size: 18px;
      font-weight: 400;
    }
    .close {
      position: absolute;
      right: 20px;
      top: 19px;
      width: 14px;
      height: 14px;
      cursor: pointer;
      background: url(../assets/icon_close.png);
      background-size: cover;
    }
  }
  .report {
    flex-grow: 1;
    width: 100%;
    .table {
      width: 800px;
      margin-left: 20px;
      margin-top: 28px;
    }
  }
}
</style>
