<template>
  <div class="wrapper-con-left">
    <div class="fluctuation">
      <div class="fluctuation_tie">
        <img class="icon-left" src="../../assets/dian.png" alt="" />
        <span class="elefont">{{ title }}</span>
      </div>
      <div class="fluctuation_con">
        <div class="con_sub" v-for="item in tageList" :key="item.tageNum">
          <div><span style="color: #41e4de; font-size: 24px">{{ item.tageNum }}</span>{{ t('次') }}</div>
          <div>{{ t('变动范围') }}：{{ item.tageRange }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import useI18n from '../../../useI18n';

const { t } = useI18n();

const props = defineProps<{
  option: Array<number>;
  title: string;
}>();

const tageList = computed(() => {
  return props.option?.map((item, index) => {
    return {
      tageNum: item,
      tageRange: ['3~4%', '2~3%', '1.5~2%', '≤1.5%'][index]
    }
  })
})
</script>

<style lang="scss" scoped>
.wrapper-con-left {
  margin: 12px 30px 26px 0;
  background: rgba(9, 15, 23, 0.3);
  border-bottom: 1px solid #212c3c;

  .fluctuation {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border: 1px solid #212c3c;

    .fluctuation_tie {
      height: 51px;
      border-bottom: 1px solid #1d2634;
      line-height: 51px;
      display: flex;
      align-items: center;

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
      display: flex;
      padding: 25px 0;

      .con_sub {
        width: 150px;
        min-height: 76px;
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
          min-height: 37px;
          line-height: 37px;
        }
      }
    }
  }
}
</style>
