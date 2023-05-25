<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-24 14:10:52
-->
<template>
  <div class="wrap-table">
    <div class="header">
      <div class="icon-report"></div>
      <div class="label">检索报表</div>
    </div>
    <div class="report">
      <el-form
        ref="queryRef"
        v-model="state.queryForm"
        class="condition-form"
        label-width="80px"
        :label-position="'right'"
      >
        <el-row>
          <el-col :span="3">
            <el-form-item label="起始日期">
              <el-date-picker
                v-model="state.queryForm.startDate"
                placeholder="开始时间"
                style="width: 130px"
                type="day"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="—" label-width="35px">
              <el-date-picker
                v-model="state.queryForm.endDate"
                placeholder="结束时间"
                style="width: 130px"
                type="day"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="室外温度">
              <el-input v-model="state.queryForm.minTem" placeholder="请输入最小值℃" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="—" label-width="35px">
              <el-input v-model="state.queryForm.minTem" style="width: 132px" placeholder="请输入最大值℃" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="目标湿度">
              <el-input v-model="state.queryForm.minTargetHumidity" placeholder="请输入最小值%rh" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="—" label-width="35px">
              <el-input
                v-model="state.queryForm.minTargetHumidity"
                style="width: 132px"
                placeholder="请输入最大值%rh"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="范围选择">
              <Select width="120px" :options="state.rangeOption" @change-item="changeRange"></Select>
            </el-form-item>
          </el-col>
          <div class="button">查询</div>
          <div class="button button-export">导出</div>
        </el-row>
      </el-form>
      <div class="table">
        <div v-for="item in state.leftTitle" :key="item.label" class="left-table" :style="`width:${item.width}px;`">
          <div class="title">{{ item.label }}</div>
          <div v-if="!Array.isArray(item.value)" class="value">{{ item.value }}</div>
          <div v-else class="wrap-value">
            <div v-for="ele in item.value" :key="ele" class="val">
              {{ ele }}
            </div>
          </div>
        </div>
        <div class="right-table">
          <el-table
            :data="state.tableData"
            :style="{ ...state.tableStyle }"
            :header-cell-style="{
              background: 'rgba(17,22,30,1)',
              color: '#C7C7C7',
              textAlign: 'center',
              height: '52px',
              borderRight: '1px solid rgba(29, 38, 52, 0.6)',
              borderBottom: '1px solid rgba(29, 38, 52, 0.6)',
              width: '64px',
            }"
            :cell-style="{ textAlign: 'center' }"
            :row-style="getRowStyle"
            @cell-click="handleCellClick"
          >
            <el-table-column
              v-for="(item, index) in state.rightTitle"
              :key="item.name"
              :prop="`value${index}`"
              :label="item.name"
              :width="item.width"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { ElForm } from '@edoms/design';

import Select from '../../../common/Select.vue';
import { retrievalData, retrievalTitle } from '../mock';
import { MIntelligenceReport, MQueryForm } from '../type';

defineProps<{
  config: MIntelligenceReport;
}>();

const queryRef = ref(ElForm);

const state: any = reactive({
  queryForm: {
    startDate: '',
    endDate: '',
    minTem: '',
    maxTem: '',
    minTargetHumidity: '',
    maxTargetHumidity: '',
    date: '',
  } as MQueryForm,
  testData: [],
  leftTitle: [],
  rightTitle: [],
  tableData: [],
  rangeOption: [
    {
      label: '全部',
      value: 'all',
    },
    {
      label: '楼1',
      value: 'building1',
    },
    {
      label: '楼2',
      value: 'building2',
    },
  ],
  tableStyle: {
    width: '100%',
    height: '244px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#C7C7C7',
    '--el-table-border-color': 'none',
  },
});

const changeRange = (val: string | number) => {
  state.queryForm.range = val;
};

const getRowStyle = (params: any) => {
  const rowStyle: any = { height: '48px', textAlign: 'center' };
  if (params.rowIndex === 3) {
    rowStyle.color = '#01649C';
    rowStyle.cursor = 'pointer';
  }
  return rowStyle;
};

const emit = defineEmits(['showDetailTable']);

/**
 * @Author: lihao
 * @Date: 2023-05-09 10:25:25
 * @param {*} column 点击的当前列
 * @param {*} cell 当前单元格
 * @Description: 点击打开日详情报表
 */
const handleCellClick = (row: any, column: any, cell: any) => {
  if (cell.innerText !== '详情') return;
  emit('showDetailTable', column.no);
};

const handleTableData = () => {
  state.leftTitle = retrievalTitle;
  const arrTitle: any = [];
  retrievalData.forEach((item: any) => {
    arrTitle.push({
      name: item.time,
      width: 64,
    });
  });
  state.rightTitle = arrTitle;
  const arr = [];
  for (let i = 0; i < 4; i++) {
    const obj: any = {};
    retrievalData.forEach((item: any, index: number) => {
      if (i == 0) {
        obj[`value${index}`] = item.coldMeasure;
      } else if (i == 1) {
        obj[`value${index}`] = item.eletric;
      } else if (i == 2) {
        obj[`value${index}`] = item.coldCost;
      } else {
        obj[`value${index}`] = '详情';
      }
    });
    arr.push(obj);
  }
  state.tableData = arr;
  //   console.log('我是table', state.rightTitle, state.tableData);

  //   state.tableData = tableData;
  //   if (props.config.buildings.length > 0) {
  //     props.config.buildings.forEach((item: any) => {
  //       state.tabs.push({
  //         name: item.label,
  //       });
  //     });
  //   }
};

// const emit = defineEmits(['closeTable']);

// const closeTable = () => {
//   emit('closeTable');
// };

onMounted(() => {
  handleTableData();
});
</script>

<style lang="scss" scoped>
:deep .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}

:deep .el-table tr {
  background-color: transparent !important;
}
.el-table::before {
  //最下面的白线
  background-color: transparent;
}
:deep .el-table .el-table__body tr.el-table__row td {
  background: #030507;
}
:deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgba($color: #11161e, $alpha: 1);
}

:deep .el-table--enable-row-transition .el-table__body td.el-table__cell {
  border-bottom: 1px solid rgba($color: #1d2634, $alpha: 0.6) !important;
  border-right: 1px solid rgba($color: #1d2634, $alpha: 0.6) !important;
}

:deep .el-table .cell {
  padding: 0;
}
:deep .el-scrollbar__view {
  display: block !important;
}

.el-table {
  overflow-x: auto;
}
.el-table__header-wrapper,
.el-table__body-wrapper,
.el-table__footer-wrapper {
  overflow: visible;
}
.el-table::after {
  position: relative;
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow: visible;
}

// :deep .el-table--border .el-table__cell {
//   border-bottom: 1px solid #41444c !important;
//   border-right: 1px solid #41444c !important;
// }

:deep .el-table--border,
.el-table--group {
  border: 1px solid #41444c !important;
}

:deep .el-textarea__inner {
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
  resize: none;
  cursor: default;
}

:deep .el-input__wrapper {
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
  cursor: default;
  background-color: rgba(5, 7, 10, 0.95);
  border: 1px solid #454e72;
  border-radius: 4px;

  .el-input__inner {
    cursor: default !important;
    font-weight: 400;
    color: #ffffff;
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

// :deep(.el-form-item__label) {
//   justify-content: flex-start;
// }

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

    border-bottom: 1px solid #1d2634;
    // background: url(../assets/bg_header.png);
    // background-size: cover;
    .icon-report {
      width: 16px;
      height: 16px;
      margin-left: 13px;
      margin-right: 11px;
      background: url(../assets/icon_small_report.png);
      background-size: cover;
    }
    .label {
      height: 20px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;
    }
  }
  .report {
    flex-grow: 1;
    width: 100%;
    .condition-form {
      height: 60px;
      margin-top: 20px;
      margin-left: 30px;
      .button {
        margin-left: 20px;
        width: 100px;
        height: 32px;
        background: rgba(0, 163, 255, 0.6);
        border: 1px solid #007bc0;
        border-radius: 4px;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        color: #eaf5ff;
        line-height: 32px;
        cursor: pointer;
      }
      .button-export {
        width: 80px;
        background: rgba(0, 163, 255, 0.26);
      }
    }
    .table {
      width: 98%;
      margin-left: 1%;
      display: flex;
      border-left: 1px solid rgba($color: #1d2634, $alpha: 0.6);
      .left-table {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 240px;
        font-size: 14px;
        font-weight: 400;
        color: #c7c7c7;
        border-top: 1px solid rgba($color: #1d2634, $alpha: 0.6);
        border-bottom: 1px solid rgba($color: #1d2634, $alpha: 0.6);
        border-right: 1px solid rgba($color: #1d2634, $alpha: 0.6);
        .title {
          width: 100%;
          height: 52px;
          white-space: pre-line;
          text-align: center;
          line-height: 26px;
          background-color: rgba(17, 22, 30, 0.9);
          //   &:not(:last-child) {
          //     border-bottom: 1px solid rgba($color: #1d2634, $alpha: 0.6);
          //   }
        }
        .value {
          width: 100%;
          height: 187px;
          line-height: 187px;
          text-align: center;
          background-color: #030507;
          border-bottom: 1px solid rgba($color: #1d2634, $alpha: 0.6);
          //   border-right: 1px solid rgba($color: #1d2634, $alpha: 0.6);
        }
        .wrap-value {
          width: 100%;
          height: 187px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-color: rgba(17, 22, 30, 0.9);
          .val {
            width: 100%;
            flex: 1;
            border-top: 1px solid rgba($color: #1d2634, $alpha: 0.6);
            line-height: 47px;
          }
        }
      }
      .right-table {
        width: 1153px;
        border-top: 1px solid rgba($color: #1d2634, $alpha: 0.6);
        .detail {
          //   width: 64px;
          height: 52px;
          background-color: red;
          cursor: pointer;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #01649c;
        }
        // flex-grow: 1;
      }
    }
    .wrap-page {
      width: 50%;
      height: 50px;
      margin-left: 60%;
      padding: 16px 16px;
    }
  }
}
</style>
