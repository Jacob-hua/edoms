<template>
  <div class="wrap-table">
    <div class="header">
      <img src="../assets/dialog_icon_report.png" alt="" class="icon-report" />
      <div class="label">{{ config.title }}</div>
      <div class="close" @click.stop="closeTable"></div>
    </div>
    <div class="report">
      <el-row :gutter="1">
        <el-col :span="3" :offset="1" style="padding: 10px 0">
          <el-date-picker
            v-model="selectTime"
            type="datetime"
            :teleported="false"
            :placeholder="t('请选择日期')"
            @change="changeDate"
          />
        </el-col>
      </el-row>
      <div class="table">
        <el-table
          :data="tableData"
          stripe
          :style="tableStyle.table"
          :header-cell-style="tableStyle.headerCellStyle"
          :cell-style="tableStyle.cellStyle"
        >
          <el-table-column prop="time" fixed :label="t('时间')" />
          <el-table-column v-for="(item, index) in tableHeader" :key="item.name" :label="item.name">
            <el-table-column v-for="val in item[`dev${index}`]" :key="val" :prop="`dev${index}` + val" :label="val" />
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { formatDate } from '@edoms/utils';

import useI18n from '../../../useI18n';
import { MIntelligenceReport } from '../type';

defineProps<{
  config: MIntelligenceReport;
  tableData: any;
  tableHeader: any;
}>();

const emit = defineEmits(['closeTable', 'changeTime']);

const { t } = useI18n();

const tableStyle = {
  table: {
    width: '100%',
    height: '637px',
    textAlign: 'center',
    '--el-table-border-color': 'none',
  },
  headerCellStyle: {
    background: 'rgba(9, 13, 18, 1)',
    color: '#EAF5FF',
    textAlign: 'center',
  },
  cellStyle: {
    textAlign: 'center',
    color: '#EAF5FF',
    opacity: 0.8,
  },
};

//Select Time
const selectTime = ref('');
const changeDate = () => emit('changeTime', formatDate(selectTime.value, 'YYYY-MM-DD HH:mm:ss'));

const closeTable = () => emit('closeTable');
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

:deep(.el-date-table td.current:not(.disabled) .el-date-table-cell__text) {
  color: #030507 !important;
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

:deep(.wrap-select .wrap-value .value) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
