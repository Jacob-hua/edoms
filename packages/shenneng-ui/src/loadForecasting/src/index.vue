<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-05-11 20:22:57
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-24 09:38:20
-->
<template>
  <div class="load-forecasting-cold" @click="handlerToShow($event, true)">
    <div class="wrap-report">
      <div class="wrap-icon">
        <img class="icon-report" src="./assets/outer-bg.png" alt="" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>
    <div v-show="isShowModel" class="model-wrapper-ftst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">负荷预测</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>
        <div class="content-ftst">
          <div class="left-ftst">
            <div class="top-form">
              <FormList />
            </div>
            <div class="bottom-table">
              <LeftTable @get-to-detail="handlerToDetail" />
            </div>
          </div>
          <div class="right-ftst">
            <div class="date-form">
              <span class="day-font">时间选择</span>
              <el-date-picker
                v-model="dateValue"
                :editable="false"
                popper-class="datePickerDark"
                :append-to-body="false"
              ></el-date-picker>
            </div>
            <div class="dis-rate">
              <span class="rate-font">偏差率：</span>
              <span class="rate-count">{{ disRate }}%</span>
            </div>
            <ChartData :options="getOptions" :width="'100%'" :height="240" :is-fresh="isShowModel" />
            <div class="table-half">
              <RightTable />
            </div>
            <div class="table-half">
              <RightTable />
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" class="model-wrapper-ftst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">详情</span>
          </div>
          <div class="right-close" @click="detailsToShow"></div>
        </div>
        <div class="content-detail">
          <div class="date-time-form">
            <span class="day-font">时间选择</span>
            <el-date-picker
              v-model="innerValue"
              :editable="false"
              popper-class="datePickerDark"
              :append-to-body="false"
            ></el-date-picker>
            <span class="day-font" style="margin-left: 39px">节点选择</span>
            <input v-model="timeValue" type="text" class="input-time" />
            <span class="time-unit">min</span>
          </div>
          <div class="content-tab-list">
            <div v-for="(item, index) in tabList" :key="index" class="tab-item">
              <div :class="['iconfont-st', item.iconClass]"></div>
              <div class="tab-font">{{ item.key }}</div>
              <div class="tab-value">{{ item.value }}</div>
            </div>
          </div>
          <div class="chartData-wrapper">
            <ChartData :options="getOptionsInner" :width="'100%'" :height="280" />
          </div>
          <div class="table-wrapper" style="height: 220px">
            <RightTable :table-title-list="tableTitleList" :table-data="tableData" :current-date="18" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import chartData from './components/chartData';
import ChartData from './components/chartData.vue';
import FormList from './components/formList.vue';
import LeftTable from './components/leftTable.vue';
import RightTable from './components/rightTable.vue';
import { AnaItemConfigs } from './type';

defineProps<{
  config: AnaItemConfigs;
}>();

const dialogVisible = ref<boolean>(false);

const isShowModel = ref<boolean>(false);

const isShowOptions = ref<boolean>(false);

const dateValue = ref<Date | string>(new Date());

const innerValue = ref<Date | string>(new Date());

const timeValue = ref<string>('60');

const disRate = ref<number>(10);

const tabList = ref<Array<{ [key: string]: string | number }>>([
  { key: '实际值', value: 26, iconClass: 'line-icon-cls' },
  { key: '预测值', value: 26, iconClass: 'forsee-icon-cls' },
  { key: '偏差率', value: '4%', iconClass: 'rate-icon-cls' },
  { key: '总偏差率', value: 26, iconClass: 'percent-icon-cls' },
]);

// 详情table
const tableTitleList = ref<Array<{ [key: string]: string }>>([
  { key: '运行时间', value: 'date', width: '70px', backgroundColor: 'rgba(17, 22, 30, 0.8)' },
  { key: '预测值', value: 'forSeeValue', width: '70px' },
  { key: '实际值', value: 'realValue', width: '70px' },
  { key: '总偏差率', value: 'disValue', width: '70px' },
]);

const tableData = ref<Array<{ [key: string]: string | number }>>([
  { date: '00:00', forSeeValue: '20', realValue: '22', disValue: '2' },
  { date: '01:00', forSeeValue: '21', realValue: '22', disValue: '1' },
  { date: '02:00', forSeeValue: '22', realValue: '23', disValue: '1' },
  { date: '03:00', forSeeValue: '23', realValue: '24', disValue: '1' },
  { date: '04:00', forSeeValue: '24', realValue: '25', disValue: '1' },
  { date: '05:00', forSeeValue: '25', realValue: '26', disValue: '1' },
  { date: '06:00', forSeeValue: '26', realValue: '27', disValue: '1' },
  { date: '07:00', forSeeValue: '27', realValue: '28', disValue: '1' },
  { date: '08:00', forSeeValue: '28', realValue: '29', disValue: '1' },
  { date: '09:00', forSeeValue: '29', realValue: '30', disValue: '1' },
  { date: '10:00', forSeeValue: '30', realValue: '31', disValue: '1' },
  { date: '11:00', forSeeValue: '31', realValue: '32', disValue: '1' },
  { date: '12:00', forSeeValue: '20', realValue: '22', disValue: '2' },
  { date: '13:00', forSeeValue: '21', realValue: '22', disValue: '1' },
  { date: '14:00', forSeeValue: '22', realValue: '23', disValue: '1' },
  { date: '15:00', forSeeValue: '23', realValue: '24', disValue: '1' },
  { date: '16:00', forSeeValue: '24', realValue: '25', disValue: '1' },
  { date: '17:00', forSeeValue: '25', realValue: '26', disValue: '1' },
  { date: '18:00', forSeeValue: '26', realValue: '27', disValue: '1' },
  { date: '19:00', forSeeValue: '27', realValue: '28', disValue: '1' },
  { date: '20:00', forSeeValue: '28', realValue: '29', disValue: '1' },
  { date: '21:00', forSeeValue: '29', realValue: '30', disValue: '1' },
  { date: '22:00', forSeeValue: '30', realValue: '31', disValue: '1' },
  { date: '23:00', forSeeValue: '31', realValue: '32', disValue: '1' },
]);

const getOptions = computed(() => {
  return chartData;
});

const getOptionsInner = computed(() => {
  return chartData;
});

const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};

const detailsToShow = () => {
  dialogVisible.value = false;
};

const handlerToClick = () => {
  isShowOptions.value = false;
};

const handlerToDetail = () => {
  dialogVisible.value = true;
};

watch(
  () => isShowModel.value,
  (newV) => {
    const dom = document.getElementsByClassName('model-wrapper-ftst')[0];
    newV
      ? dom.addEventListener('click', handlerToClick, false)
      : dom.removeEventListener('click', handlerToClick, false),
      (isShowOptions.value = false);
  }
);
</script>

<style lang="scss" scoped>
.load-forecasting-cold {
  min-width: 117px;
  min-height: 80px;
  position: relative;

  .wrap-report {
    width: 100%;
    height: 100%;
    // background: rgba(0, 163, 255, 0.06);
    // border: 1px solid #051823;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .wrap-icon {
      width: 60px;
      height: 42px;
      margin-top: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 114, 179, 0.4);
      border: 1px solid #0072b3;
      border-radius: 4px;
      box-sizing: border-box;

      .icon-report {
        width: 22px;
        height: 24px;
      }
    }

    .label {
      margin-top: 7px;
      font-size: 14px;
      color: #ffffff;
      font-weight: 300;
    }
  }

  .model-wrapper-ftst {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;

    .model-content {
      width: 1800px;
      height: 800px;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 1);
      box-sizing: border-box;
      border: 1px solid rgba(1, 52, 96, 1);

      .content-title {
        width: 100%;
        height: 52px;
        line-height: 52px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        background-image: url('../src/assets/title-bg.png');
        background-size: 100% 100%;

        .left-title-font {
          display: flex;

          .font-icon {
            display: block;
            width: 24px;
            height: 24px;
            background-image: url('../src/assets/model-icon.png');
            background-size: 24px 24px;
            background-position: center center;
            background-repeat: no-repeat;
            margin-top: 14px;
          }

          .font-value {
            color: rgba(234, 245, 255, 1);
            font-size: 18px;
            margin-left: 15px;
          }
        }

        .right-close {
          width: 24px;
          height: 24px;
          background-image: url('../src/assets/title-close.png');
          background-size: 14px 14px;
          background-position: center center;
          background-repeat: no-repeat;
          margin-top: 14px;
          cursor: pointer;
        }
      }

      .content-ftst {
        width: calc(100% - 60px);
        height: calc(100% - 60px - 52px);
        margin: 30px auto;
        display: flex;
        justify-content: space-between;

        .left-ftst {
          width: 31%;
          height: 100%;

          .top-form {
            width: 100%;
            height: 32%;
          }

          .bottom-table {
            width: 100%;
            height: 67%;
            margin-top: 2%;
          }
        }

        .right-ftst {
          width: 67%;
          height: 100%;
          padding: 20px 20px;
          box-sizing: border-box;
          background-color: rgba(9, 15, 23, 0.3);
          position: relative;

          .date-form {
            margin-top: 19px;
            padding: 0 12px;
            box-sizing: border-box;
            width: 100%;
            color: rgba(234, 245, 255, 1);
            font-size: 14px;
            line-height: 32px;
            display: flex;
            margin-bottom: 15px;
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

            :deep(.el-input__wrapper) {
              background-color: rgba(3, 5, 7, 1);
              border: 1px solid rgb(69, 78, 114);
              box-shadow: none;
            }

            :deep(.el-input__wrapper:hover) {
              box-shadow: none !important;
            }

            :deep(.el-input__inner) {
              color: #fff;
            }
          }

          .dis-rate {
            position: absolute;
            right: 20px;
            top: 93px;

            .rate-font {
              color: rgba(234, 245, 255, 0.7);
            }

            .rate-count {
              color: rgba(65, 228, 222, 1);
              font-weight: bold;
            }
          }

          .table-half {
            width: 100%;
            height: 161px;
            box-sizing: border-box;
            background-color: rgba(3, 5, 7, 1);
            margin-top: 21px;
          }
        }
      }

      .content-detail {
        width: calc(100% - 60px);
        height: calc(100% - 60px - 52px);
        margin: 30px auto;

        .date-time-form {
          margin-top: 19px;
          padding: 0 12px;
          box-sizing: border-box;
          width: 100%;
          color: rgba(234, 245, 255, 1);
          font-size: 14px;
          line-height: 32px;
          display: flex;
          margin-bottom: 15px;
          position: relative;

          .day-font {
            margin-right: 12px;
          }

          :deep(.el-input__wrapper) {
            background-color: rgba(3, 5, 7, 1);
            border: 1px solid rgb(69, 78, 114);
            box-shadow: none;
          }

          :deep(.el-input__wrapper:hover) {
            box-shadow: none !important;
          }

          :deep(.el-input__inner) {
            color: #fff;
          }

          .input-time {
            width: 180px;
            height: 32px;
            background-color: rgba(3, 5, 7, 1);
            outline: none;
            border: 1px solid rgba(69, 78, 114, 1);
            font-size: 14px;
            color: rgba(255, 255, 255, 1);
            padding: 0 11px;
            line-height: 32px;
            border-radius: 4px;
          }

          .time-unit {
            line-height: 32px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin-left: -36px;
          }
        }

        .content-tab-list {
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: space-between;
          margin-top: 20px;

          .tab-item {
            width: 20%;
            height: 100%;
            background-image: url('./assets/tab-bg.png');
            background-size: 100% 100%;
            display: flex;
            padding: 35px 30px;
            box-sizing: border-box;

            .iconfont-st {
              width: 31px;
              height: 30px;
              background-size: 100% 100%;

              &.line-icon-cls {
                background-image: url('./assets/line.png');
              }

              &.forsee-icon-cls {
                background-image: url('./assets/forsee.png');
              }

              &.rate-icon-cls {
                background-image: url('./assets/rate.png');
              }

              &.percent-icon-cls {
                background-image: url('./assets/percent.png');
              }
            }

            .tab-font {
              width: calc(100% - 20px - 31px - 150px);
              line-height: 30px;
              margin-left: 20px;
              color: rgba(196, 229, 248, 1);
              font-size: 14px;
            }

            .tab-value {
              width: 150px;
              text-align: right;
              line-height: 30px;
              margin-left: 20px;
              color: rgba(65, 228, 222, 1);
              font-size: 24px;
            }
          }
        }

        .chartData-wrapper {
          margin-top: 20px;
          width: 100%;
          height: 280px;
        }

        .table-wrapper {
          margin-top: 20px;
          width: 100%;
          height: 280px;
        }
      }
    }
  }
}
</style>
