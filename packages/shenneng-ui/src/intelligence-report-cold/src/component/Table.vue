<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-31 15:25:03
-->
<template>
  <div class="wrap-table">
    <div class="header">
      <div class="icon-report"></div>
      <div class="label">{{ type === 'day' ? '日报表' : '月报表' }}</div>
    </div>
    <div class="report">
      <el-form ref="queryRef" v-model="state.queryForm" class="condition-form" label-width="100px">
        <el-row :gutter="2">
          <el-col :span="4" :offset="1">
            <el-form-item label="时间选择">
              <el-date-picker v-model="state.queryForm.date" :teleported="false" type="day" placeholder="请选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="范围选择">
              <Select
                width="180px"
                :options="state.rangeOption"
                :default-value="'全部'"
                @change-item="changeRange"
              ></Select>
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
            :row-style="{ height: '48px' }"
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
import { ElForm } from 'element-plus';

import Select from '../../../common/Select.vue';
import { dayData, leftDayTitle, leftMonthTitle, monthData } from '../mock';
import { MIntelligenceReport, MTableQueryForm } from '../type';

const props = defineProps<{
  config: MIntelligenceReport;
  type: string;
}>();

const queryRef = ref(ElForm);

const state: any = reactive({
  queryForm: {
    date: new Date(),
    range: '',
  } as MTableQueryForm,
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
    maxHeight: '196px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#C7C7C7',
    '--el-table-border-color': 'none',
  },
});

const changeRange = (val: string | number) => {
  state.queryForm.range = val;
};

// const groupArrayByKey = (arr: any, key: any) => {
//   return arr.reduce((t: any, v: any) => (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t), {});
// };

const handleTableData = () => {
  const data = props.type === 'day' ? dayData : monthData;
  state.leftTitle = props.type === 'day' ? leftDayTitle : leftMonthTitle;
  const arrTitle: any = [];
  data.forEach((item: any) => {
    arrTitle.push({
      name: item.time,
      width: 64,
    });
  });
  state.rightTitle = arrTitle;
  const arr = [];
  for (let i = 0; i < 3; i++) {
    const obj: any = {};
    data.forEach((item: any, index: number) => {
      if (i == 0) {
        obj[`value${index}`] = item.coldMeasure;
      } else if (i == 1) {
        obj[`value${index}`] = item.eletric;
      } else {
        obj[`value${index}`] = item.coldCost;
      }
    });
    arr.push(obj);
  }
  state.tableData = arr;
};

onMounted(() => {
  handleTableData();
});
</script>

<style lang="scss" scoped>
:deep .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
:deep(.el-date-table td.current:not(.disabled) .el-date-table-cell__text) {
  color: #030507 !important;
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
// :deep .el-table--border .el-table__cell {
//   border-bottom: 1px solid #41444c !important;
//   border-right: 1px solid #41444c !important;
// }

:deep .el-table--border,
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
:deep .el-select-dropdown {
  background-color: rgba(5, 7, 10, 0.8) !important;
}
:deep(.el-popper.is-light) {
  border: 1px solid #454e72 !important;
}
:deep(.el-select-dropdown) {
  background: rgba(21, 43, 94, 0.3);
  margin: 0px;
  border: 0px;
  border-radius: 0px;
  left: 0px !important;
}

:deep(.el-form-item__label) {
  color: #eaf5ff;
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
        margin-right: 30px;
        cursor: pointer;
      }
      .button-export {
        width: 80px;
        position: absolute;
        right: 0;
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
        height: 194px;
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
          height: 142px;
          line-height: 142px;
          text-align: center;
          background-color: #030507;
          border-bottom: 1px solid rgba($color: #1d2634, $alpha: 0.6);
          //   border-right: 1px solid rgba($color: #1d2634, $alpha: 0.6);
        }
        .wrap-value {
          width: 100%;
          height: 142px;
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
        max-width: 1153px;
        border-top: 1px solid rgba($color: #1d2634, $alpha: 0.6);
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
