<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-24 09:44:52
-->
<template>
  <div class="wrap-table">
    <div class="header">
      <img src="../assets/dialog_icon_report.png" alt="" class="icon-report" />
      <div class="label">{{ config.title }}</div>
      <div class="close" @click.stop="closeTable"></div>
    </div>
    <div class="report">
      <el-form ref="queryRef" v-model="state.queryForm" class="condition-form" label-width="40px">
        <el-row :gutter="1">
          <el-col :span="3" :offset="1">
            <el-form-item label="">
              <el-date-picker
                v-model="state.queryForm.date"
                type="date"
                placeholder="请选择日期"
                @change="changeDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3" :offset="12">
            <el-form-item label="">
              <Select :width="148" :options="state.stationOptions" @change-item="changeStation"></Select>
              <!-- <el-select v-model="state.queryForm.station">
                <el-option
                  v-for="item in state.stationOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="">
              <Select :width="148" :options="state.deviceOptions" @change-item="changeDevice"></Select>
              <!-- <el-select v-model="state.queryForm.device">
                <el-option
                  v-for="item in state.deviceOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
            </el-form-item>
          </el-col>
          <div class="button">导出</div>
        </el-row>
      </el-form>
      <div class="table">
        <el-table
          :data="state.tableData"
          stripe
          :style="{ ...state.tableStyle }"
          :header-cell-style="{
            background: 'rgba(9, 13, 18, 1)',
            color: '#EAF5FF',
            textAlign: 'center',
          }"
          :cell-style="{ textAlign: 'center', color: '#EAF5FF', opacity: 0.6 }"
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
import { dateFormat, formatDate } from '@edoms/utils';

import Select from '../../../common/Select.vue';
import mockData from '../mock';
import { MIntelligenceReport, MQueryForm } from '../type';
defineProps<{
  config: MIntelligenceReport;
}>();

const queryRef = ref(ElForm);

const state: any = reactive({
  queryForm: {
    date: new Date(),
    station: 'station1',
    device: 'device1',
  } as MQueryForm,
  testData: [],
  titleList: [],
  tableData: [],
  stationOptions: [
    {
      label: '一号配电室',
      value: 'station1',
    },
    {
      label: '二号配电室',
      value: 'station2',
    },
    {
      label: '三号配电室',
      value: 'station3',
    },
    {
      label: '四号配电室',
      value: 'station4',
    },
  ],
  deviceOptions: [
    {
      label: '电压配电柜一',
      value: 'device1',
    },
    {
      label: '电压配电柜二',
      value: 'device2',
    },
    {
      label: '电压配电柜三',
      value: 'device3',
    },
    {
      label: '电压配电柜四',
      value: 'device4',
    },
  ],
  tableStyle: {
    width: '100%',
    height: '637px',
    textAlign: 'center',
    '--el-table-border-color': 'none',
  },
});

const changeDate = (val: any) => {
  console.log(dateFormat(val), formatDate(state.queryForm.date, 'YYYY-MM-DD'), 2222222);
};

const changeStation = (val: string | number) => {
  state.queryForm.station = val;
};

const changeDevice = (val: string | number) => {
  state.queryForm.device = val;
};

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
.el-table::before {
  //最下面的白线
  background-color: transparent;
}
:deep .el-table tr {
  background-color: transparent !important;
}
:deep .el-table .el-table__body tr.el-table__row td {
  background: rgba(8, 11, 15, 1);
}
:deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgba($color: #11161e, $alpha: 0.9);
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
  //   box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
  resize: none;
  cursor: default;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
  cursor: default;
  background-color: #030507;
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
:deep(.el-select__popper.el-popper) {
  border: 1px solid #454e72 !important;
}

.wrap-table {
  //   width: 100%;
  //   height: 100%;
  //   display: flex;
  //   flex-direction: column;
  //   overflow: hidden;
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
  height: 786px;
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
