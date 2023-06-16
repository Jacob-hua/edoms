<template>
  <div class="actual-wrapper">
    <div class="actual-top">
      <div class="actual-value overflow-ellipsis">
        <LongText
          :content="actualValue.toString()"
          :content-style="{ width: 'inherit', fontSize: 'inherit', textAlign: 'right' }"
        ></LongText>
      </div>
      <div class="actual-unit" :title="config.energyName">{{ config.energyName }}</div>
    </div>
    <div class="actual-bottom">当前系统能效</div>
  </div>
</template>

<script lang="ts" setup>
import LongText from '../../../LongText.vue';
import { MEnergyMonitoring } from '../type';
defineProps<{
  config: MEnergyMonitoring;
  actualValue: number;
}>();
</script>

<style lang="scss" scoped>
.actual-wrapper {
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

  .actual-top {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    // margin-top: 20px;
    margin-bottom: 13px;
    .actual-value {
      color: #00fff0;
      font-size: 20px;
      margin-right: 4px;
      max-width: 75px;
    }
    .actual-unit {
      color: #c4e5f8;
      font-size: 16px;
    }
  }
  .actual-bottom {
    color: #c4e5f8;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
