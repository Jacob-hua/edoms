<template>
  <div class="select-wrapper">
    <div class="select" @click="handlrToShowOptions($event, true)">
      <span class="font-value">{{ dateValue }}</span>
      <span class="font-icon">∨</span>
    </div>
    <div v-show="isShowOptions" class="select-options">
      <div v-for="itm in props.list" :key="itm.value" class="option-item" @click="hanlderToChoose(itm.key)">
        <span class="font-value">{{ itm.key }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, withDefaults } from 'vue';

const props = withDefaults(
  defineProps<{
    list: Array<{ [key: string]: string }>;
    initVal: string | number;
  }>(),
  {
    list: () => [
      {
        key: '日',
        value: 'day',
      },
      {
        key: '月',
        value: 'month',
      },
      {
        key: '年',
        value: 'year',
      },
    ],
    initVal: '',
  }
);

const emit = defineEmits<{
  (event: 'onSelectChange', value: any): void;
}>();

const dateValue = ref<string | number>('');

const isShowOptions = ref<boolean>(false);

const handlrToShowOptions = (e: any, bl: boolean) => {
  e.stopPropagation();
  isShowOptions.value = bl;
};

const hanlderToChoose = (key: string) => {
  isShowOptions.value = false;
  if (key === dateValue.value) return;
  dateValue.value = key;
  emit('onSelectChange', key);
};

const handlerToClick = () => {
  isShowOptions.value = false;
};

watch(
  () => isShowOptions.value,
  (newV) => {
    newV
      ? window.addEventListener('click', handlerToClick, false)
      : window.removeEventListener('click', handlerToClick, false);
  }
);

onMounted(() => {
  dateValue.value = props.initVal;
});
</script>

<style lang="scss" scoped>
.select-wrapper {
  position: relative;
  .select {
    min-width: 98px;
    height: 32px;
    background-color: rgba(3, 5, 7, 1);
    border-radius: 4px;
    border: 1px solid rgba(69, 78, 114, 1);
    padding: 8px 20px;
    box-sizing: border-box;
    cursor: pointer;
    .font-value {
      color: #fff;
      font-size: 14px;
      margin-right: 10px;
    }
    .font-icon {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      float: right;
    }
  }
  .select-options {
    min-width: 98px;
    background-color: rgba(9, 15, 23, 1);
    border-radius: 4px;
    position: absolute;
    padding-top: 15px;
    box-sizing: border-box;
    border: 1px solid rgba(69, 78, 114, 1);
    z-index: 1000;
    .option-item {
      padding: 0px 20px;
      line-height: 25px;
      // text-align: center;
      margin-bottom: 10px;
      color: rgba(234, 245, 255, 1);
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .font-value {
        margin-right: 20px;
      }
      &:hover {
        background-color: #fff;
        color: rgba(9, 15, 23, 1);
      }
    }
  }
}
</style>
