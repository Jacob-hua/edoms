<!--
 * @Description: 
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-11 17:47:43
-->
<template>
  <div class="level-wrapper">
    <div class="level-top">
      <div class="level-value overflow-ellipsis">{{ getCurrentLevel() }}</div>
    </div>
    <div class="level-bottom">{{ t('能效等级') }}</div>
  </div>
</template>

<script lang="ts" setup>
import useI18n from '../../../useI18n';
import { MEnergyMonitoring } from '../type';

const { t } = useI18n();
const props = defineProps<{
  config: MEnergyMonitoring;
  actualValue: number;
}>();

const getCurrentLevel = () => {
  let level: string = '';
  if (
    props.config.medium &&
    props.config.medium.length > 0 &&
    props.actualValue >= Number(props.config.medium[0].minValue) &&
    props.actualValue < Number(props.config.medium[0].maxValue)
  ) {
    level = '中等';
  } else if (
    props.config.good &&
    props.config.good.length > 0 &&
    props.actualValue >= Number(props.config.good[0].minValue) &&
    props.actualValue < Number(props.config.good[0].maxValue)
  ) {
    level = '优异';
  } else if (
    props.config.excellent &&
    props.config.excellent.length > 0 &&
    props.actualValue >= Number(props.config.excellent[0].minValue) &&
    props.actualValue < Number(props.config.excellent[0].maxValue)
  ) {
    level = '良好';
  } else {
    level = '中等';
  }
  return level;
};
</script>

<style lang="scss" scoped>
.level-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .overflow-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .level-top {
    display: flex;
    align-items: center;
    justify-content: center;
    // margin-top: 20px;
    margin-bottom: 13px;
    .level-value {
      color: #00fff0;
      font-size: 20px;
      margin-right: 4px;
    }
    .level-unit {
      color: #c4e5f8;
      font-size: 16px;
    }
  }
  .level-bottom {
    color: #c4e5f8;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
