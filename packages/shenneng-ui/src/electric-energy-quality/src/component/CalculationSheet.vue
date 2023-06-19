<template>
  <div class="wrapper_left_last">
    <div class="balance">{{ props.option.title }}</div>
    <div class="th_index">
      <div class="th_index_con">
        <div><span style="color: #41e4de; font-size: 24px">-5372</span>元</div>
        <div>{{ t('奖惩电费') }}</div>
      </div>
      <div class="th_index_con">
        <div><span style="color: #41e4de; font-size: 24px">0.98</span></div>
        <div>{{ t('平均功率因数') }}</div>
      </div>
      <div class="th_index_con">
        <div><span style="color: #d72824; font-size: 24px">0.59</span></div>
        <div>{{ t('最小功率因数') }}</div>
      </div>
    </div>
    <div class="alculation_sheet">
      <div class="alculation_tie">
        <img class="alculation_icon" src="../../assets/jisuan.png" />
        <span>{{ t('计算书') }}</span>
      </div>
      <div class="alculation_con">
        <el-row>
          <el-col :span="14">
            <table>
              <tr>
                <td class="frist_d">{{ t('有功功率电量') }}：</td>
                <td class="second_d"><span>74.934</span>{{ t('万') }} kWh</td>
              </tr>
              <tr>
                <td class="frist_d">{{ t('无功功率电量') }}：</td>
                <td class="second_d"><span>7.297</span>{{ t('万') }} kWh</td>
              </tr>
              <tr style="margin-top: 28px">
                <td class="frist_d">{{ t('功率因数') }}：</td>
                <td class="second_d">
                  <Formula :option="formulaData"></Formula>
                </td>
              </tr>
              <tr style="margin-top: 28px">
                <td class="frist_d">{{ t('惩奖系数') }}：</td>
                <td class="second_d"><span>-0.75</span></td>
              </tr>
            </table>
          </el-col>
          <el-col :span="10">
            <table>
              <tr>
                <td class="frist_d">{{ t('惩奖电费') }}：</td>
                <td class="second_d"><span>-10524.26</span></td>
              </tr>
              <tr>
                <td class="frist_d">{{ t('考核基准') }}：</td>
                <td class="second_d"><span>0.9</span></td>
              </tr>
              <tr style="margin-left: 50px">
                <td
                  style="
                    width: 100px;
                    height: 28px;
                    line-height: 28px;
                    background: #031825;
                    cursor: pointer;
                    text-align: center;
                    border-radius: 2px;
                  "
                >
                  <img
                    style="width: 16px; height: 16px; margin: 7px 15px"
                    src="../../assets/dui.png"
                    alt=""
                    srcset=""
                  />{{ t('查对标') }}
                </td>
              </tr>
            </table>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import useI18n from '../../../useI18n';

import Formula from './Formula.vue';
const { t } = useI18n();
const props = defineProps<{
  option: any;
}>();
const formulaData = computed(() => {
  return 'Cos\\varphi=\\frac{74.934}{\\sqrt{74.934^2+7.297^2}}';
});
</script>

<style lang="scss" scoped>
.wrapper_left_last {
  height: 310px;
  margin-bottom: 40px;
  display: flex;

  .balance {
    width: 36px;
    height: 90px;
    writing-mode: vertical-lr;
    background: #000a0f;
    border-radius: 2px;
    margin: auto;
    line-height: 36px;
    text-align: center;
    color: #eaf5ff;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }

  .th_index {
    width: 130px;
    display: grid;
    grid-template-rows: repeat(3, 33.3%);
    gap: 13px;

    .th_index_con {
      width: 130px;
      height: 76px;
      text-align: center;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;
      background: #03121c;
      border: 1px solid #02263b;
      border-radius: 0px 4px 0px 4px;
      box-sizing: border-box;

      div {
        margin-top: 13px;
      }
    }
  }

  .alculation_sheet {
    width: 556px;
    background: rgba(9, 15, 23, 0.3);
    border: 1px solid #212c3c;
    margin-left: 20px;

    .alculation_tie {
      height: 50px;
      border-bottom: 1px solid #1d2634;
      line-height: 50px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #eaf5ff;
      display: flex;

      .alculation_icon {
        width: 18px;
        height: 18px;
        margin: 18px;
      }
    }

    .alculation_con {
      height: 260px;

      tr {
        margin-top: 38px;
        color: #eaf5ff;
        display: block;
        margin-left: 20px;

        .frist_d {
          text-align: right;
          width: 100px;
        }

        .second_d {
          text-align: left;

          span {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #41e4de;
          }
        }
      }
    }
  }
}
</style>
