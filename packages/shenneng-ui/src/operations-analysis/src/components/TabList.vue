<template>
  <div class="tab-list">
    <div class="left-ftst">
      <div v-for="(itm, idx) in props.list.list" :key="idx" class="ftst-itm">
        <span :class="['itm-font', getClass(itm.code, 'bg')]">{{ itm.key }}</span>
        <span :class="['itm-value', getClass(itm.code, 'font')]">{{ (itm.value as number) * 100 }}%</span>
      </div>
    </div>
    <div class="right-ftst">
      <div class="color-wrapper">
        <div
          v-for="itm in props.list.list"
          :key="itm.code"
          :style="{ width: `calc(${(itm.value as number) * 100}% - 2px)` }"
          :class="['color-wrapper-item', getClass(itm.code, 'bg')]"
        ></div>
      </div>
      <div class="font-wrapper-sttst">
        <span class="font-ft-st">{{ t('峰谷比') }}：</span>
        <span class="font-rate">{{ props.list.rate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue';

import useI18n from '../../../useI18n';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    list: {
      rate: number;
      list: Array<{ [key: string]: string | number }>;
    };
  }>(),
  {
    list: () => ({
      rate: 0,
      list: [],
      code: '',
    }),
  }
);

const getClass = computed(() => (code: string | number, type: string) => {
  return `${code}-${type}`;
});
</script>

<style lang="scss" scoped>
.tab-list {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .left-ftst {
    .ftst-itm {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .itm-font {
        width: 60px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        color: rgba(234, 245, 255, 1);
        display: block;
        border-radius: 3px;
        &.gu-bg {
          background-color: rgba(0, 163, 255, 0.1);
          border: 1px solid rgba(0, 163, 255, 1);
        }
        &.ping-bg {
          background-color: rgba(56, 174, 28, 0.1);
          border: 1px solid rgba(56, 174, 28, 1);
        }
        &.feng-bg {
          background-color: rgba(193, 114, 29, 0.1);
          border: 1px solid rgba(193, 114, 29, 1);
        }
        &.jian-bg {
          background-color: rgba(215, 40, 36, 0.1);
          border: 1px solid rgba(215, 40, 36, 1);
        }
      }
      .itm-value {
        margin-left: 10px;
        font-size: 14px;
        line-height: 26px;
        &.gu-font {
          color: rgba(0, 163, 255, 1);
        }
        &.ping-font {
          color: rgba(56, 174, 28, 1);
        }
        &.feng-font {
          color: rgba(193, 114, 29, 1);
        }
        &.jian-font {
          color: rgba(215, 40, 36, 1);
        }
      }
    }
  }
  .right-ftst {
    width: 200px;
    overflow: hidden;
    padding: 50px 0;
    position: relative;
    // margin-top: 38px;
    .color-wrapper {
      width: 100%;
      height: 26px;
      display: flex;
      justify-content: space-between;
      .color-wrapper-item {
        height: 26px;
        border-radius: 2px;
        &.gu-bg {
          background-color: rgba(0, 163, 255, 0.6);
          border: 1px solid rgba(0, 163, 255, 1);
        }
        &.ping-bg {
          background-color: rgba(56, 174, 28, 0.6);
          border: 1px solid rgba(56, 174, 28, 1);
        }
        &.feng-bg {
          background-color: rgba(193, 114, 29, 0.6);
          border: 1px solid rgba(193, 114, 29, 1);
        }
        &.jian-bg {
          background-color: rgba(215, 40, 36, 0.6);
          border: 1px solid rgba(215, 40, 36, 1);
        }
      }
    }
    .font-wrapper-sttst {
      margin-top: 19px;
      width: 200px;
      height: 18px;
      vertical-align: middle;
      .font-ft-st {
        vertical-align: text-top;
        color: rgba(234, 245, 255, 1);
        font-size: 15px;
      }
      .font-rate {
        color: rgba(65, 228, 222, 1);
        font-size: 18px;
      }
    }
  }
}
</style>
