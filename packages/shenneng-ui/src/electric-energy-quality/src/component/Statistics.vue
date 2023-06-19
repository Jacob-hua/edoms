<template>
  <div class="wrapper-con-left">
    <div class="fluctuation">
      <div class="fluctuation_tie">
        <img class="icon-left" src="../../assets/dian.png" alt="" />
        <span class="elefont">{{ t('电压波动') }}</span>
      </div>
      <div class="fluctuation_con">
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">0</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：3~4%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">0</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：2~3%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">0</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：1.5~2%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">0</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：≤1.5%</div>
        </div>
      </div>
    </div>
    <div class="fluctuation">
      <div class="fluctuation_tie">
        <img class="icon-left" src="../../assets/dian.png" alt="" />
        <span class="elefont">{{ t('过电压') }}</span>
      </div>
      <div class="fluctuation_con">
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">0</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：3~4%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">1</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：2~3%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">27</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：1.5~2%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">421</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：≤1.5%</div>
        </div>
      </div>
    </div>
    <div class="fluctuation">
      <div class="fluctuation_tie">
        <img class="icon-left" src="../../assets/dian.png" alt="" />
        <span class="elefont">{{ t('欠电压') }}</span>
      </div>
      <div class="fluctuation_con">
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">0</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：3~4%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">1</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：2~3%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">27</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：1.5~2%</div>
        </div>
        <div class="con_sub">
          <div><span style="color: #41e4de; font-size: 24px">421</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：≤1.5%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useI18n from '../../../useI18n';
const { t } = useI18n();
</script>

<style lang="scss" scoped>
.wrapper-con-left {
  height: 610px;
  margin-right: 30px;
  background: rgba(9, 15, 23, 0.3);
  border-bottom: 1px solid #212c3c;

  .fluctuation:nth-child(n + 2) {
    margin-top: 30px;
  }

  .fluctuation:first-child {
    margin-top: 10px;
  }

  .fluctuation {
    height: 182px;
    border: 1px solid #212c3c;

    .fluctuation_tie {
      height: 51px;
      border-bottom: 1px solid #1d2634;
      line-height: 51px;
      display: flex;

      .icon-left {
        width: 18px;
        height: 18px;
        margin: 18px;
      }

      .elefont {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #eaf5ff;
      }
    }

    .fluctuation_con {
      height: 136px;
      display: flex;

      .con_sub {
        width: 150px;
        height: 76px;
        margin: auto;
        text-align: center;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #eaf5ff;
        background: #03121c;
        border: 1px solid #02263b;
        border-radius: 0px 4px 0px 4px;

        div {
          height: 37px;
          line-height: 37px;
        }
      }
    }
  }
}
</style>
