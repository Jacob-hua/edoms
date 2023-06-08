<template>
  <div class="operations-analysis-water" @click="handlerToShow($event, true)">
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
            <span class="font-value">{{ config.title }}</span>
          </div>
          <div class="right-close" @click="handlerToShow($event, false)"></div>
        </div>
        <div class="content-data">
          <el-tabs v-model="activeName" @tab-change="handleChange">
            <el-tab-pane
              v-for="(item, index) in tabTypes"
              :key="index"
              :label="item.label"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
          <div class="tab-content">
            <el-card class="equipment-select-card card-box">
              <div class="select-box">
                <el-select v-model="selectValue" :teleported="false">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="img-content">
                <div class="img-box">
                  <img src="./assets/byq.png" alt="" />
                </div>
                <div class="equipment-title">
                  <span>{{ equipName }}</span>
                </div>
              </div>
            </el-card>
            <el-card class="info-card card-box">
              <template #header>
                <div class="card-header">
                  <i class="asset-icon"></i>
                  <span>资产信息</span>
                </div>
              </template>
              <div class="card-content">
                <div v-for="(item, index) in informations.assetInformation" :key="index" class="row">
                  <div class="col-left">{{ item.label }}</div>
                  <el-divider direction="vertical" />
                  <div class="col-right">{{ item.value }}</div>
                </div>
              </div>
            </el-card>
            <el-card class="info-card card-box">
              <template #header>
                <div class="card-header">
                  <i class="factory-icon"></i>
                  <span>出厂参数</span>
                </div>
              </template>
              <div class="card-content">
                <div v-for="(item, index) in informations.factoryParameter" :key="index" class="row">
                  <div class="col-left">{{ item.label }}</div>
                  <el-divider direction="vertical" />
                  <div class="col-right">{{ item.value }}</div>
                </div>
              </div>
            </el-card>
            <el-card class="info-card card-box">
              <template #header>
                <div class="card-header">
                  <i class="running-icon"></i>
                  <span>运行参数</span>
                </div>
              </template>
              <div class="card-content">
                <div v-for="(item, index) in informations.runningParameter" :key="index" class="row">
                  <div class="col-left">{{ item.label }}</div>
                  <el-divider direction="vertical" />
                  <div class="col-right">{{ item.value }}</div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { MAssetInformationConfig } from './type';

defineProps<{
  config: MAssetInformationConfig;
}>();
const isShowModel = ref<boolean>(false);
const activeName = ref('nbq');
const tabTypes = ref([
  {
    label: '逆变器',
    name: 'nbq',
  },
  {
    label: '汇流箱',
    name: 'hlx',
  },
]);
const optionsList = reactive({
  inverter: [
    {
      label: '研发楼西逆变压器',
      value: 'xini',
    },
    {
      label: '研发楼东逆变压器',
      value: 'dongni',
    },
  ],
  combinerBox: [
    {
      label: '研发楼西汇流箱',
      value: 'xihui',
    },
    {
      label: '研发楼东汇流箱',
      value: 'donghui',
    },
  ],
});
const options = ref(optionsList.inverter);
const selectValue = ref();
selectValue.value = options.value[0].value;
const informations = reactive({
  assetInformation: [
    {
      label: '生产厂家',
      value: '——',
    },
    {
      label: '资产编号',
      value: '——',
    },
    {
      label: '资产类型',
      value: '——',
    },
    {
      label: '资产名称',
      value: '——',
    },
    {
      label: '资产所属',
      value: '——',
    },
    {
      label: '资产状态',
      value: '——',
    },
    {
      label: '生产厂家',
      value: '——',
    },
    {
      label: '设备型号',
      value: '——',
    },
    {
      label: '购入时间',
      value: '——',
    },
  ],
  factoryParameter: [
    {
      label: '额定发电电流',
      value: '50A',
    },
    {
      label: '系统电压',
      value: '192V',
    },
    {
      label: '额定电流',
      value: '50A',
    },
    {
      label: '最大电流',
      value: '51A',
    },
    {
      label: '发电模式',
      value: 'MPPT自动最大功率点跟',
    },
    {
      label: '启动时间',
      value: '＜10s',
    },
    {
      label: '静态功耗',
      value: '＜2w',
    },
    {
      label: '整机效率',
      value: '＞96.5%',
    },
    {
      label: '冷却方式',
      value: '风冷',
    },
  ],
  runningParameter: [
    {
      label: '参数01',
      value: '——',
    },
    {
      label: '参数02',
      value: '——',
    },
    {
      label: '参数03',
      value: '——',
    },
    {
      label: '参数04',
      value: '97.7',
    },
    {
      label: '参数05',
      value: '——',
    },
    {
      label: '参数06',
      value: '——',
    },
    {
      label: '参数07',
      value: '——',
    },
    {
      label: '参数08',
      value: '——',
    },
    {
      label: '参数09',
      value: '——',
    },
  ],
});
const handleChange = (name: any) => {
  if (name === 'nbq') {
    options.value = optionsList.inverter;
  } else {
    options.value = optionsList.combinerBox;
  }
  selectValue.value = options.value[0].value;
};
const equipName = computed(() => {
  const selectOption = options.value.find(({ value }) => value === selectValue.value);
  console.log(selectOption);
  return selectOption?.label;
});
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};
</script>

<style lang="scss" scoped>
:deep(.el-input__inner) {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #eaf5ff;
}

:deep(.el-popper.is-pure) {
  inset: auto !important;
}

:deep(.el-select-dropdown__list) {
  margin: auto !important;
}

:deep(.el-popper__arrow::before) {
  content: none;
}

:deep(.el-tabs__active-bar) {
  background-color: #00a3ff;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #899096;
}

:deep(.el-tabs__item.is-active) {
  color: #eaf5ff;
}
:deep(.el-select-dropdown__item) {
  background-color: #0d1118;
}
.operations-analysis-water {
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
      width: 1520px;
      height: 95%;
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
        width: calc(100% - 60px);
        height: calc(100% - 112px);
        margin: 10px 30px 30px;
        overflow-y: scroll;
        display: flex;
        flex-flow: column;

        :deep(.el-tabs__nav-wrap) {
          --el-border-color-light: #4d505f;
          --el-text-color-primary: #eaf5ff50;
          --el-color-primary: #eaf5ff;
          // &::after {
          //   background-color: var(--el-border-color-light);
          // }
        }

        .tab-content {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-column-gap: 30px;
          flex-grow: 1;

          .card-box {
            margin: 20px 0 0px;
            background: #0d1118;
            border: 1px solid #1d2634;
            text-align: center;
          }

          .equipment-select-card {
            color: #eaf5ff;

            :deep(.el-select) {
              width: 100%;

              .el-input__wrapper {
                background-color: transparent;
                --el-border-color: #454e72;
                --el-input-border-color: #454e72;
                --el-select-input-focus-border-color: #454e72;
              }
            }

            :deep(.el-card__body) {
              height: 100%;
              box-sizing: border-box;
              display: flex;
              flex-flow: column;
            }

            .img-content {
              flex-grow: 1;
              display: flex;
              flex-flow: column;
              justify-content: center;

              .img-box {
                border: 1px dashed #eaf5ff50;
              }
            }
          }

          .info-card {
            display: flex;
            flex-flow: column;
            color: #eaf5ff50;

            :deep(.el-card__header) {
              --el-card-border-color: #1d2634;
            }

            .card-header {
              display: grid;
              grid-auto-flow: column;
              justify-content: center;
              align-items: center;
              grid-column-gap: 5px;
              font-size: 18px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #eaf5ff;

              i {
                width: 21px;
                height: 18px;
                display: inline-block;
              }

              .asset-icon {
                background: url('./assets/zichan.png') no-repeat;
              }

              .factory-icon {
                background: url('./assets/chuchangcanshu.png') no-repeat;
              }

              .running-icon {
                background: url('./assets/yunxingcanshu.png') no-repeat;
              }
            }

            :deep(.el-card__body) {
              display: flex;
              flex-flow: column;
              flex-grow: 1;
            }

            .card-content {
              display: grid;
              grid-auto-flow: row;
              grid-row-gap: 20px;
              grid-template-rows: repeat(9, 1fr);
              flex-grow: 1;

              .row {
                display: flex;
                background: rgba(20, 27, 37, 0.8);
                border: 1px solid #212b3b;
                text-align: center;
                align-items: center;

                :deep(.el-divider) {
                  --el-border-color: #212b3b;
                  height: 100%;
                }

                .col-left {
                  width: 36%;
                  font-size: 16px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #eaf5ff;
                  opacity: 0.5;
                }

                .col-right {
                  width: 64%;
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
    }
  }
}
</style>
