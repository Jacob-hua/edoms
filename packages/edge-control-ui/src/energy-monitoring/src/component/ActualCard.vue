<template>
  <div class="actual-wrapper">
    <div class="actual-top">
      <div class="actual-value">
        <LongText
          :content="actualValueCom"
          :content-style="{ width: 'inherit', fontSize: 'inherit', textAlign: 'right' }"
        ></LongText>
      </div>
    </div>
    <div class="actual-bottom">{{ t('实际COP') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import LongText from '../../../LongText.vue';
import useI18n from '../../../useI18n';
import { MEnergyMonitoring } from '../type';

const { t } = useI18n();
const props = defineProps<{
  config: MEnergyMonitoring;
  actualValue: number;
}>();
const actualValueCom = computed<string>(() => (props.actualValue ? props.actualValue.toString() : '-'));
</script>

<style lang="scss" scoped>
.actual-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .overflow-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .actual-top {
    display: flex;
    align-items: flex-end;
    margin-bottom: 13px;

    .actual-value {
      color: #07f83b;
      font-size: 24px;
      margin-left: -6px;
      font-weight: bold;
    }

    .actual-unit {
      color: #c4e5f8;
      font-size: 20px;
    }
  }

  .actual-bottom {
    color: #ffffffa6;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
  }
}
</style>
