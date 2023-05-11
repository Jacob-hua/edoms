<template>
  <div class="form-list">
    <div class="form-titles">
      <span>预测设置</span>
    </div>
    <div class="form-day">
      <span class="day-font">日内滚动预测执行</span>
      <div :class="['radio-input', radioValue === 1 ? 'active' : '']" @click="handlerToChangeRadio(1)">
        <div v-show="radioValue === 1" class="inner-icon"></div>
      </div>
      <label for="1" class="right-label">是</label>
      <div :class="['radio-input', radioValue === 2 ? 'active' : '']" @click="handlerToChangeRadio(2)">
        <div v-show="radioValue === 2" class="inner-icon"></div>
      </div>
      <label for="2" class="right-label">否</label>
    </div>
    <div class="form-day">
      <span class="day-font">预测执行时间间隔</span>
      <input v-model="disValue" type="text" class="input-select" @focus="handlerToFocus" @blur="handlerToBlur" />
      <div v-show="isShowOptions" class="options-list">
        <div
          v-for="itm in disOptions"
          :key="itm.value"
          class="options-item"
          @click="handlerToSelect(itm.key as string)"
        >
          {{ itm.key }}
        </div>
      </div>
    </div>
    <div class="button-wrapper" @click="handlerToConfirm">确认</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

// const props = withDefaults(
//   defineProps<{
//     options: any;
//     width: number;
//     height: number;
//   }>(),
//   {
//     options: () => ({}),
//     width: 0,
//     height: 0,
//   }
// );

const isShowOptions = ref<boolean>(false);

const radioValue = ref<number>(1);

const disValue = ref<string>('1时');

const disOptions = ref<Array<{ [key: string]: string | number }>>([{ key: '1时', value: 1 }]);

const handlerToChangeRadio = (idx: number) => {
  if (idx === radioValue.value) return;
  radioValue.value = idx;
};

const handlerToSelect = (key: string) => {
  if (key === disValue.value) return;
  disValue.value = key;
};

const handlerToFocus = () => {
  isShowOptions.value = true;
};

const handlerToBlur = () => {
  isShowOptions.value = false;
};

const handlerToConfirm = () => {
  console.log('confirm');
};

onMounted(() => {});

onUnmounted(() => {});
</script>

<style lang="scss" scoped>
.form-list {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(33, 44, 60, 1);
  background-color: rgba(9, 15, 23, 0.3);
  position: relative;
  .form-titles {
    width: 100%;
    height: 51px;
    border-bottom: 1px solid rgba(29, 38, 52, 1);
    box-sizing: border-box;
    line-height: 51px;
    padding: 0 12px;
    color: rgba(234, 245, 255, 1);
    font-size: 16px;
  }
  .form-day {
    margin-top: 19px;
    padding: 0 12px;
    box-sizing: border-box;
    width: 100%;
    // overflow: hidden;
    color: rgba(234, 245, 255, 1);
    font-size: 14px;
    line-height: 32px;
    display: flex;
    margin-bottom: 24px;
    position: relative;
    .day-font {
      margin-right: 36px;
    }
    .radio-input {
      margin-top: 7px;
      width: 18px;
      height: 18px;
      cursor: pointer;
      border: 1px solid rgba(112, 112, 112, 1);
      background-color: rgba(3, 5, 7, 1);
      margin-right: 9px;
      border-radius: 50%;
      box-sizing: border-box;
      position: relative;
      &.active {
        border: 1px solid rgba(65, 228, 222, 1);
      }
      .inner-icon {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgba(65, 228, 222, 1);
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -4px;
        margin-top: -4px;
      }
    }
    .right-label {
      line-height: 32px;
      margin-right: 36px;
    }
    label {
      position: relative;
      top: 0px;
      line-height: 16px;
    }
    .input-select {
      width: 300px;
      height: 32px;
      background-color: rgba(3, 5, 7, 1);
      outline: none;
      border: 1px solid rgba(69, 78, 114, 1);
      border-radius: 4px;
      color: rgba(255, 255, 255, 1);
      padding: 0 19px;
      box-sizing: border-box;
      font-size: 14px;
    }
    .options-list {
      width: 300px;
      min-height: 30px;
      max-height: 200px;
      overflow: hidden;
      overflow-y: auto;
      cursor: pointer;
      position: absolute;
      top: 33px;
      left: 160px;
      z-index: 999;
      padding: 5px 0;
      box-sizing: border-box;
      background-color: rgba(3, 5, 7, 1);
      border: 1px solid rgba(69, 78, 114, 1);
      .options-item {
        width: 100%;
        height: 20px;
        text-align: center;
        line-height: 20px;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
      }
    }
    .options-list::-webkit-scrollbar {
      width: 3px;
      height: 1px;
    }

    .options-list::-webkit-scrollbar-thumb {
      border-radius: 3px;
      // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      background: rgba(4, 70, 108, 1);
    }

    .options-list::-webkit-scrollbar-track {
      // -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      background: transparent;
    }
  }
  .button-wrapper {
    width: 100px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background-color: rgba(0, 163, 255, 0.6);
    border-radius: 4px;
    cursor: pointer;
    position: absolute;
    left: 50%;
    bottom: 23px;
    margin-left: -50px;
  }
}
</style>
