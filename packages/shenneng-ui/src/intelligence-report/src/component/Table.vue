<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-28 17:00:40
-->
<template>
  <div class="wrap-table">
    <div class="header">
      <img src="../assets/dialog_icon_report.png" alt="" class="icon-report" />
      <div class="label">{{ config.title }}</div>
      <div class="close" @click="closeTable"></div>
    </div>
    <div class="report">
      <el-form ref="queryRef" v-model="state.queryForm" class="condition-form" label-width="75px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="">
              <el-date-picker v-model="state.queryForm.date" />
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="6">
            <el-form-item label="">
              <el-select v-model="state.queryForm.building">
                <el-option
                  v-for="item in state.buildingOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-select v-model="state.queryForm.building">
                <el-option
                  v-for="item in state.buildingOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <div class="button">导出</div>
          <!-- <el-col :span="2">
            <el-button type="primary">导出</el-button>
          </el-col> -->
        </el-row>
      </el-form>
      <div class="table">
        <el-table
          :data="state.tableData"
          stripe
          :style="{ ...state.tableStyle }"
          :header-cell-style="{
            background: '#201b1b',
            color: '#EAF5FF',
            textAlign: 'center',
          }"
          :cell-style="{ textAlign: 'center', color: '#EAF5FF' }"
        >
          <el-table-column prop="time" fixed label="时间" width="110" />
          <el-table-column v-for="(item, index) in state.titleList" :key="item.name" :label="item.name">
            <el-table-column
              v-for="(val, key) in item.data"
              :key="val"
              :prop="`${index}${key}`"
              :label="key"
              width="110"
            />
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { ElForm } from '@edoms/design';

import mockData from '../mock';
import { MIntelligenceReport, MQueryForm } from '../type';
defineProps<{
  config: MIntelligenceReport;
}>();

const queryRef = ref(ElForm);

const state: any = reactive({
  queryForm: {
    date: '',
    building: '',
    room: '',
  } as MQueryForm,
  testData: [],
  titleList: [],
  tableData: [],
  buildingOptions: [
    {
      label: '博士楼',
      value: 'boshi',
    },
    {
      label: '硕士楼',
      value: 'shuoshi',
    },
  ],
  tableStyle: {
    width: '100%',
    height: '637px',
    backgroundColor: 'rgba(9, 13, 18, 0.9)',
    textAlign: 'center',
    '--el-table-border-color': 'none',
  },
});

const handleTableData = () => {
  state.titleList = state.testData[0].device;
  const arr: any = [];

  state.testData.forEach((item: any) => {
    const obj: any = {};
    obj.time = item.time;
    item.device.forEach((element: any, index: number) => {
      Object.keys(element.data).forEach((key: any) => {
        obj[`${index}${key}`] = element.data[key];
      });
    });
    arr.push(obj);
  });
  state.tableData = arr;
};

const emit = defineEmits(['closeTable']);

const closeTable = () => {
  emit('closeTable');
};

onMounted(() => {
  state.testData = mockData;
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
::v-deep .el-table .el-table__body tr.el-table__row td {
  background: rgba(5, 7, 10, 0.95);
}
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #201b1b;
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
.el-select .el-input.is-focus .el-input__wrapper {
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
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
      background: url(../assets/dialog_icon_report.png);
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
    .condition-form {
      height: 60px;
      margin-top: 15px;
      .button {
        margin-left: 20px;
        width: 80px;
        height: 32px;
        background: rgba(0, 163, 255, 0.26);
        border: 1px solid #007bc0;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        font-size: 16px;
        font-weight: 400;
        color: #eaf5ff;
        line-height: 32px;
      }
    }
    .table {
      width: 96%;
      margin-left: 2%;
    }
  }
}
</style>
