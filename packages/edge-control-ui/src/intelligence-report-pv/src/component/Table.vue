<template>
  <div class="wrap-table">
    <div class="header">
      <img src="../assets/dialog_icon_report.png" alt="" class="icon-report" />
      <div class="label">{{ config.title }}</div>
      <div class="close" @click.stop="closeTable"></div>
    </div>
    <div class="report">
      <div class="wrap-tab">
        <div
          v-for="(item, index) in state.tabs"
          :key="item"
          :class="['tab', { active: activeTab === index }]"
          @click="changeTab(index)"
        >
          {{ item }}
        </div>
      </div>
      <el-form ref="queryRef" v-model="state.queryForm" class="condition-form" label-min-width="100px">
        <el-row :gutter="10">
          <el-col :span="4" :offset="1">
            <el-form-item :label="t('日期选择')">
              <el-date-picker v-model="state.queryForm.date" :teleported="false" :placeholder="t('请选择日期')" />
            </el-form-item>
          </el-col>
          <div class="button">{{ t('查询') }}</div>
          <div class="button button-export">{{ t('导出') }}</div>
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
          <el-table-column type="index" :label="t('序号')" width="60"></el-table-column>
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
        <el-pagination :background="'rgba(0, 0, 0, 0.9)'" layout="prev, pager, next" :total="50" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { ElForm } from '@edoms/design';

import useI18n from '../../../useI18n';
import { tableData, tableData1, titleData } from '../mock';
import { MIntelligenceReport, MQueryForm } from '../type';

defineProps<{
  config: MIntelligenceReport;
}>();

const { t } = useI18n();

const queryRef = ref(ElForm);

const state: any = reactive({
  queryForm: {
    date: new Date(),
  } as MQueryForm,
  tabs: [
    t('全部'),
    t('单体一'),
    t('单体二'),
    t('研发楼西'),
    t('研发楼北'),
    t('研发楼东'),
    t('研发楼南'),
    t('光伏幕墙'),
    t('光伏车棚'),
    t('全站数据'),
  ],
  titleList: [],
  tableData: [],
  tableStyle: {
    width: '100%',
    height: '550px',
    fontSize: '14px',
    textAlign: 'center',
    '--el-table-border-color': 'none',
  },
});

const activeTab = ref<number>(0);
const changeTab = (index: number) => {
  if (activeTab.value === index) return;
  activeTab.value = index;
  state.tableData = index % 2 === 0 ? tableData : tableData1;
};
const handleTableData = () => {
  state.titleList = titleData.map((item) => ({ ...item, name: t(item.name) }));
  state.tableData = tableData;
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
.el-popper.is-light {
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

:deep(.el-form-item__label) {
  color: #7b8aaa;
}

.wrap-table {
  //   width: 100%;
  //   height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1630px;
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
    .wrap-tab {
      width: calc(100% - 60px);
      height: 56px;
      margin-left: 30px;
      border-bottom: 1px solid rgba($color: #4d505f, $alpha: 1);
      display: flex;
      .tab {
        height: 55px;
        min-width: 71px;
        margin-right: 50px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #eaf5ff;
        opacity: 0.5;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &.active {
          opacity: 1;
          border-bottom: 2px solid #00a3ff;
        }
      }
    }
    .condition-form {
      height: 56px;
      margin-top: 20px;
      .button {
        position: absolute;
        right: 140px;
        // margin-left: 20px;
        width: 80px;
        height: 32px;
        background: rgba(0, 163, 255, 0.2);
        border: 1px solid #00a3ff;
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
        right: 20px;
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
