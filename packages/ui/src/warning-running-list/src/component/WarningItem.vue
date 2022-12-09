<template>
  <div :class="[item.status === 'unconfirm' ? 'animation' : '', 'warning-item-wrapper']">
    <p class="warning-item-top">
      <span>{{ item.date }}</span>
      <span class="type">{{ item.type }}</span>
    </p>
    <p>
      <span> {{ item.title }} </span>
      <span class="discover" @click="handleShowSurplus"> 展开 </span>
    </p>
    <p v-if="isShowBody" class="body">
      <span class="content">{{ item.content }}</span>
      <span class="button-container">
        <span class="button-wrapper">
          <el-button type="primary" @click="handleConfirm(item)">确认</el-button>
          <el-button type="paint" @click="handleIgnore">忽略</el-button>
        </span>
      </span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { inject, Ref, ref } from 'vue';

import { ElButton } from '@edoms/design';

import { Alarm } from '../api';
import { ClassName } from '../type';

const isShowBody = ref<boolean>(false);
export interface Warning {
  // 告警日期
  date: string;
  //告警类型
  type: string;
  // 告警信息摘要
  title: string;
  // 告警具体内容
  content: string;
  // 是否确认
  status: string;
}

withDefaults(
  defineProps<{
    item: Warning;
  }>(),
  {
    item: () => ({
      date: '-',
      type: '-',
      title: '-',
      content: '-',
      status: '-',
    }),
    className: () => 'red',
  }
);

const textColor = inject<Ref<ClassName>>('textColor');
const confirmedAlarmList = inject<Function>('confirmedAlarmList') as Function;
const handleShowSurplus = () => {
  isShowBody.value = !isShowBody.value;
};
const handleIgnore = () => {
  isShowBody.value = false;
};

const handleConfirm = async (alarm: Alarm) => {
  const result = await confirmedAlarmList();
  result ? (alarm.status = 'confirmed') : (alarm.status = 'unconfirm');
};
</script>

<style lang="scss" scoped>
@keyframes animated-border {
  0% {
    border-left-color: v-bind(textColor);
  }
  50% {
    border-left-color: transparent;
  }
  100% {
    border-left-color: v-bind(textColor);
  }
}
.type {
  color: v-bind(textColor);
}
.animation {
  animation: animated-border 3.5s infinite;
}
.warning-item-wrapper {
  border: 1px solid #ffffff85;
  border-left: 10px solid v-bind(textColor);
  padding: 15px 0;
  margin-bottom: 8px;
  p {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    .discover {
      cursor: pointer;
    }
  }
  .button-container {
    display: block;
  }
  .button-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-right: 15px;
    margin-top: 15px;
  }
  .body {
    display: block;
  }
  .content {
    display: block;
    line-height: 24px;
  }
}
</style>
