<template>
  <div class="operations-analysis-pv" @click="handlerToShow($event, true)">
    <div class="wrap-report">
      <div class="wrap-icon">
        <img class="icon-report" src="./assets/model.png" alt="" />
      </div>
      <div class="label">{{ config.title }}</div>
    </div>

    <div v-show="isShowModel" class="model-wrapper-ftst">
      <div class="model-content">
        <div class="content-title">
          <div class="left-title-font">
            <span class="font-icon"></span>
            <span class="font-value">{{ config.title }}</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>

        <div class="content-data">
          <el-table :data="feeData.List" style="width: 100%">
            <el-table-column width="40">
              <template #default="scope">
                <div style="text-align: center">{{ scope.row.index }}.</div>
              </template>
            </el-table-column>
            <el-table-column :label="t('尖峰平谷')" width="210">
              <template #default="scope">
                <el-select v-model="scope.row.isJfpg" placeholder="Select">
                  <el-option v-for="item in jfpgData" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="t('开始时间')" width="210">
              <template #default="scope">
                <el-time-select
                  v-model="scope.row.startTime"
                  :max-time="scope.row.endTime"
                  class="mr-4"
                  placeholder="Start time"
                  start="08:30"
                  step="00:15"
                  end="18:30"
                />
              </template>
            </el-table-column>
            <el-table-column :label="t('结束时间')" width="210">
              <template #default="scope">
                <el-time-select
                  v-model="scope.row.endTime"
                  :min-time="scope.row.startTime"
                  placeholder="End time"
                  start="08:30"
                  step="00:15"
                  end="18:30"
                />
              </template>
            </el-table-column>
            <el-table-column :label="t('单价') + '（' + t('元') + '/kWh）'" width="210">
              <template #default="scope">
                <el-input v-model="scope.row.unit_price" placeholder="Please input" />
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template #default="scope">
                <el-button class="delete" @click="deleteFn(scope.row)">{{ t('删除') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="addCon">
            <el-button :icon="Plus" class="add" @click="addFn">{{ t('增加') }}</el-button>
          </div>
          <div class="submitCon">
            <el-button class="submit">{{ t('确认') }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';

import useApp from '../../useApp';

import locales from './locales';
import { FeeSettingEnergy } from './type';

const props = defineProps<{
  config: FeeSettingEnergy;
}>();

const { setMessage, t } = useApp(props);
setMessage(locales);
const isShowModel = ref<boolean>(false);
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};

const feeData = reactive<{
  List: Array<{ [key: string]: string | number }>;
}>({
  List: [
    {
      index: 1,
      isJfpg: 'jian',
      startTime: '08：00',
      endTime: '12：00',
      unit_price: '2.00',
    },
    {
      index: 2,
      isJfpg: 'jian',
      startTime: '08：00',
      endTime: '12：00',
      unit_price: '2.00',
    },
    {
      index: 3,
      isJfpg: 'jian',
      startTime: '08：00',
      endTime: '12：00',
      unit_price: '2.00',
    },
    {
      index: 4,
      isJfpg: 'jian',
      startTime: '08：00',
      endTime: '12：00',
      unit_price: '2.00',
    },
    {
      index: 5,
      isJfpg: 'jian',
      startTime: '08：00',
      endTime: '12：00',
      unit_price: '2.00',
    },
  ],
});

const jfpgData = [
  {
    value: 'jian',
    label: t('尖'),
  },
  {
    value: 'feng',
    label: t('峰'),
  },
  {
    value: 'ping',
    label: t('平'),
  },
  {
    value: 'gu',
    label: t('谷'),
  },
];
const addFn = () => {
  feeData.List.push({
    index: feeData.List.length + 1,
    isJfpg: 'jian',
    startTime: '08：00',
    endTime: '12：00',
    unit_price: '2.00',
  });
};
const deleteFn = (scope: any) => {
  feeData.List.splice(scope.index - 1, 1);
  feeData.List.forEach((item, index) => {
    item.index = index + 1;
  });
};
</script>

<style lang="scss" scoped>
:deep(.el-table) {
  background-color: transparent;
  --el-table-row-hover-bg-color: transparent;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #eaf5ff;
}

:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table th.el-table__cell) {
  background-color: transparent;
  border: 0;
}

:deep(.el-table .el-table__cell) {
  border: 0 !important;
}

:deep(.el-table tr) {
  background-color: transparent;
}

:deep(.el-table .cell) {
  color: #eaf5ff;
  padding: 0 10px !important;
}

:deep(.el-table__inner-wrapper::before) {
  content: none;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none;
  border: 1px solid #454e72;
}

:deep(.el-input__inner) {
  color: #ffffff;
}

.operations-analysis-pv {
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
      width: 990px;
      height: 610px;
      position: absolute;
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
        border-bottom: 1px solid #013460;

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
          // title-bg
          background-image: url('../src/assets/title-close.png');
          background-size: 14px 14px;
          background-position: center center;
          background-repeat: no-repeat;
          margin-top: 14px;
          cursor: pointer;
        }
      }

      .content-data {
        height: calc(100% - 52px);
        position: relative;
        overflow-y: scroll;
        padding-top: 30px;
        box-sizing: border-box;

        .delete {
          width: 60px;
          height: 32px;
          background: #030507;
          border: 1px solid #ff0000;
          border-radius: 4px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ff0000;
        }

        .addCon {
          margin-top: 40px;
          padding-left: 20px;

          .add {
            width: 70px;
            height: 32px;
            background: #030507;
            border: 1px solid #3699ff;
            border-radius: 4px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #3699ff;
          }
        }

        .submitCon {
          position: relative;
          bottom: -5%;
          left: 95%;
          transform: translateX(-50%);

          .submit {
            width: 80px;
            height: 32px;
            background: rgba(0, 163, 255, 0.26);
            border: 1px solid #007bc0;
            border-radius: 4px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #eaf5ff;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss"></style>
