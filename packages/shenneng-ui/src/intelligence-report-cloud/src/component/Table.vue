<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-31 15:26:46
-->
<template>
  <div class="wrap-table">
    <div class="header">
      <img src="../assets/dialog_icon_report.png" alt="" class="icon-report" />
      <div class="label">{{ config.title }}</div>
      <div class="close" @click.stop="closeTable"></div>
    </div>
    <div class="report">
      <el-form ref="queryRef" v-model="state.queryForm" class="condition-form">
        <el-row>
          <el-col :span="4" :offset="1">
            <el-form-item label="时间：">
              <el-date-picker
                v-model="state.queryForm.startDate"
                :teleported="false"
                placeholder="请选择日期"
                @change="changeDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="—" label-width="40px">
              <el-date-picker
                v-model="state.queryForm.endDate"
                :teleported="false"
                placeholder="请选择日期"
                @change="changeDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-form-item label="空调机组">
              <Select
                width="180px"
                :options="state.option"
                :default-value="'全部'"
                @change-item="changeOption"
              ></Select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table">
        <el-table
          :data="state.tableData"
          stripe
          :style="{ ...state.tableStyle }"
          :header-cell-style="{
            background: 'rgba(17,22,30,1)',
            color: '#EAF5FF',
            textAlign: 'center',
            height: '50px',
          }"
          :cell-style="{ textAlign: 'center', color: '#EAF5FF', opacity: 0.6 }"
          :row-style="{ height: '50px' }"
        >
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column
            v-for="item in state.titleList"
            :key="item.name"
            :prop="item.value"
            :label="item.name"
            :width="item.width"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="wrap-page">
        <el-pagination :background="'rgba(0, 0, 0, 0.9)'" layout="prev, pager, next,total" :total="50" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ElForm } from 'element-plus';

import Select from '../../../common/Select.vue';
import { tableData, titleData } from '../mock';
import { MIntelligenceReport, MQueryForm } from '../type';

defineProps<{
  config: MIntelligenceReport;
}>();

const queryRef = ref(ElForm);

const curDate = new Date();

const state: any = reactive({
  queryForm: {
    startDate: new Date(curDate.getTime() - 24 * 60 * 60 * 1000),
    endDate: curDate,
    kt: 'all',
  } as MQueryForm,
  testData: [],
  titleList: [],
  tableData: [],
  option: [
    {
      label: '全部',
      value: 'all',
    },
    {
      label: '空调机组1',
      value: 'kt1',
    },
    {
      label: '空调机组2',
      value: 'kt2',
    },
    {
      label: '空调机组3',
      value: 'kt3',
    },
  ],
  tableStyle: {
    width: '100%',
    height: '597px',
    fontSize: '14px',
    textAlign: 'center',
    '--el-table-border-color': 'none',
  },
});

const changeOption = (val: string) => {
  state.queryForm.kt = val;
};

// const defaultTime = ref<[Date, Date]>([new Date(curDate.getTime() - 24 * 60 * 60 * 1000), curDate]);

// state.queryForm.date = defaultTime;

const changeDate = () => {
  console.log(state.queryForm.date);
};
// const curDate = new Date();

// state.queryForm.date = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天

const handleTableData = () => {
  state.titleList = titleData;
  state.tableData = tableData;
  //   if (props.config.buildings.length > 0) {
  //     props.config.buildings.forEach((item: any) => {
  //       state.tabs.push({
  //         name: item.label,
  //       });
  //     });
  //   }
};

const emit = defineEmits(['closeTable']);

const closeTable = () => {
  emit('closeTable');
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
:deep(.el-table .cell) {
  padding: 0;
}
.el-table::before {
  //最下面的白线
  background-color: transparent;
}
:deep .el-table .el-table__body tr.el-table__row td {
  background: rgba(8, 11, 15, 1);
}
:deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgba($color: #11161e, $alpha: 1);
}

:deep .el-table--border .el-table__cell {
  border-bottom: 1px solid #41444c !important;
  border-right: 1px solid #41444c !important;
}

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

:deep .el-pagination.is-background .btn-next,
:deep .el-pagination.is-background .btn-prev,
:deep.el-pagination.is-background .btn-prev:disabled,
:deep .el-pagination.is-background .btn-next:disabled,
:deep .el-pagination.is-background .el-pager li {
  background-color: transparent !important;
  //   border: 0.0625rem solid #4a4a4a;
  color: #ffffff !important;
}

:deep .el-pagination.is-background .el-pager li.is-active {
  background-color: #00a3ff !important;
}

:deep(.el-date-table__row .current) {
  color: #606266;
}

:deep(.el-form-item__label) {
  color: #7b8aaa;
}

.wrap-table {
  //   width: 100%;
  //   height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  //   margin-left: -740px;
  //   margin-top: 100px;
  width: 1480px;
  height: 793px;
  background: rgba($color: #000000, $alpha: 0.9);
  border: 1px solid #013460;
  z-index: 15;
  .header {
    position: relative;
    width: 100%;
    min-height: 52px;
    display: flex;
    align-items: center;
    background-image: url('../assets/bg_header.png');
    background-size: cover;
    .icon-report {
      width: 22px;
      height: 24px;
      margin-left: 21px;
      margin-right: 16px;
      background-image: url('../assets/dialog_icon_report.png');
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
      background-image: url('../assets/icon_close.png');
      background-size: cover;
    }
  }
  .report {
    flex-grow: 1;
    width: 100%;
    .condition-form {
      height: 55px;
      margin-top: 20px;
      //   border-bottom: 1px solid #1d2634;
      .wrap-date {
        background-color: red;
      }
      .button {
        margin-left: 20px;
        width: 100px;
        height: 32px;
        background: rgba(0, 163, 255, 0.26);
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
    .wrap-tab {
      width: 100%;
      .tab {
        margin-left: 30px;
        margin-top: 31px;
        margin-bottom: 21px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 400;
        text-align: center;
        line-height: 36px;
        .button {
          width: 100px;
          height: 36px;
          margin-right: 10px;
          background: rgba($color: #00a3ff, $alpha: 0.12);
          color: #eaf5ff;
          cursor: pointer;

          &.active {
            width: 100px;
            height: 34px;
            background: rgba(0, 163, 255, 0.26);
            border: 1px solid #007bc0;
            color: #ffffff;
          }
        }
      }
    }
    .table {
      width: 96%;
      margin-left: 2%;
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
