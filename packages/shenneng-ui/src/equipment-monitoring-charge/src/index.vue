<template>
  <div class="operations-analysis-water" @click="handlerToShow($event, true)">
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
          <div class="device-info">
            <div class="info-station">{{ eq_data.eq_station }}</div>
            <div class="info-information">
              <div class="info-tit">{{ t('设备名称') }}</div>
              <div class="info-val">{{ eq_data.eq_name }}</div>
            </div>
            <div class="info-information">
              <div class="info-tit">{{ t('运行状态') }}</div>
              <div class="info-val">{{ eq_data.eq_satus }}</div>
            </div>
            <div class="info-information">
              <div class="info-tit">{{ t('厂家联系人') }}</div>
              <div class="info-val">{{ eq_data.manufacturer }}</div>
            </div>
          </div>
          <div class="tab-content">
            <div class="card-box">
              <div class="card-tit">{{ t('设备动态图') }}</div>
              <div class="card-con">
                <div
                  style="text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
                >
                  <img src="./assets/station.png" alt="" />
                </div>
              </div>
            </div>
            <div v-for="item in eq_data.eq_list" :key="item.paramsName" class="info-card card-box">
              <div class="card-tit">{{ item.paramsName }}</div>
              <div class="card-con">
                <div v-for="query in item.list" :key="query.param" class="con-item">
                  <div :title="query.param" class="item-left">{{ query.param }}</div>
                  <div :title="query.val" class="item-right">{{ query.val }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import useApp from '../../useApp';

import locales from './locales';
import { MAssetInformationConfig } from './type';

const props = defineProps<{
  config: MAssetInformationConfig;
}>();
const { setMessage, t } = useApp(props);
setMessage(locales);
const isShowModel = ref<boolean>(false);
const handlerToShow = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowModel.value = bl;
};
const eq_data = {
  eq_station: t('充电系统1_1充电桩'),
  eq_name: t('双向V2G充电桩60kW'),
  eq_satus: t('正常运行'),
  manufacturer: '李四   136-3690-6785',
  eq_list: [
    {
      paramsName: t('铭牌参数'),
      list: [
        {
          param: t('生产厂家'),
          val: '上海利百威',
        },
        {
          param: t('设备型号'),
          val: '60kW',
        },
        {
          param: t('计量精度'),
          val: '1级',
        },
        {
          param: t('充电枪配置'),
          val: '单枪',
        },
        {
          param: t('充电接口'),
          val: '满足GBT',
        },
        {
          param: t('启动方式'),
          val: '扫码、插电',
        },
        {
          param: t('组网方式'),
          val: '以太网',
        },
        {
          param: t('使用寿命'),
          val: '5000h',
        },
        {
          param: t('充放电次数'),
          val: '10000',
        },
      ],
    },
    {
      paramsName: t('出厂参数'),
      list: [
        {
          param: t('AC_DC功率'),
          val: '60kW',
        },
        {
          param: t('AC_DC输入电压'),
          val: '342~415Vac',
        },
        {
          param: t('AC_DC输入电流'),
          val: 'Imax=92A',
        },
        {
          param: t('AC_DC输出电压'),
          val: '200~750Vdc',
        },
        {
          param: t('AC_DC输出电流'),
          val: 'Imax=100A',
        },
        {
          param: t('DC_AC功率'),
          val: '60kW',
        },
        {
          param: t('DC_AC输入电压'),
          val: '300~750Vdc',
        },
        {
          param: t('DC_AC输入电流'),
          val: 'Imax=100A',
        },
        {
          param: t('DC_AC输出电压'),
          val: '380Vac',
        },
        {
          param: t('DC_AC输出电流'),
          val: 'Imax=120A',
        },
        {
          param: t('工作温度'),
          val: '-20~55℃',
        },
        {
          param: t('防护等级'),
          val: '1级',
        },
        {
          param: t('满载整机效率'),
          val: '≥96%',
        },
      ],
    },
    {
      paramsName: t('设置参数'),
      list: [],
    },
    {
      paramsName: t('运行参数'),
      list: [
        {
          param: t('AC_DC功率'),
          val: '60kW',
        },
        {
          param: t('AC_DC输入电压'),
          val: '--',
        },
        {
          param: t('AC_DC输入电流'),
          val: '--',
        },
        {
          param: t('AC_DC输出电压'),
          val: '--',
        },
        {
          param: t('AC_DC输出电流'),
          val: '--',
        },
        {
          param: t('DC_AC功率'),
          val: '--',
        },
        {
          param: t('DC_AC输入电压'),
          val: '--',
        },
        {
          param: t('DC_AC输入电流'),
          val: '--',
        },
        {
          param: t('DC_AC输出电压'),
          val: '--',
        },
        {
          param: t('DC_AC输出电流'),
          val: '--',
        },
        {
          param: t('工作温度'),
          val: '--',
        },
        {
          param: t('防护等级'),
          val: '--',
        },
        {
          param: t('满载整机效率'),
          val: '--',
        },
      ],
    },
  ],
};
</script>

<style lang="scss" scoped>
.operations-analysis-water {
  min-height: 60px;
  min-width: 60px;
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
      width: 1480px;
      height: 800px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 1);
      box-sizing: border-box;
      border: 1px solid rgba(1, 52, 96, 1);
      display: flex;
      flex-direction: column;

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
        width: 100%;
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

        .device-info {
          width: 100%;
          height: 64px;
          box-sizing: border-box;
          padding: 0px 30px;
          border-bottom: 1px solid #1d2634;
          display: flex;
          line-height: 64px;

          .info-station {
            width: 22%;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #eaf5ff;
          }

          .info-information {
            display: flex;
            width: 26%;
            .info-tit {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #eaf5ff;
            }

            .info-val {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #2dd12d;
            }
          }
        }

        .tab-content {
          height: calc(100% - 90px);
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-column-gap: 23px;
          flex-grow: 1;
          padding: 0px 30px;
          box-sizing: border-box;
          margin-top: 23px;

          .card-box {
            height: 94%;

            .card-tit {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #eaf5ff;
              margin-bottom: 16px;
            }

            .card-con {
              width: 100%;
              height: 90%;
              background: rgba(9, 15, 23, 0.3);
              border: 1px solid #212c3c;
              box-sizing: border-box;
              padding: 14px;
              overflow-y: scroll;
              position: relative;

              .con-item {
                display: flex;
                width: 100%;
                height: 40px;
                justify-content: space-between;
                margin-bottom: 6px;
                border: 1px solid #666666;
                line-height: 40px;

                .item-left {
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #aaaaaa;
                  background: #030507;
                  border-right: 1px solid #666666;
                  text-align: center;
                }

                .item-right {
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #2fda2f;
                  background: rgba(255, 255, 255, 0.1);
                  text-align: center;
                }

                div {
                  width: 50%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
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
