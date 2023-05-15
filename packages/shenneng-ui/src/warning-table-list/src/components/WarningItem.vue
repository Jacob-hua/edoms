<template>
  <div class="warning-wrapper">
    <div class="warning-item">
      <span class="warning-type">{{ item.type }}</span>
      <span class="warning-title">{{ item.title }}</span>
      <span class="warning-date">{{ item.date }}</span>
      <span class="discover" @click="handleShowSurplus(item)">
        <img v-show="item.expend" src="../assets/to-not-col.png" />
        <img v-show="!item.expend" src="../assets/to-col.png" />
      </span>
    </div>
    <div v-if="item.expend" class="body">
      <div class="warning-detail">
        <div class="warning-device">
          {{ item.title }}
        </div>
        <div class="warning-content">
          {{ item.content }}
        </div>
      </div>
      <div class="button-container">
        <span v-if="item.status === 'unconfirm'" class="button-wrapper">
          <el-button type="primary" @click="handleConfirm(item)">确认</el-button>
          <el-button @click="handleIgnore(item.id)">忽略</el-button>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, Ref } from 'vue';

import { ElButton } from '@edoms/design';

import { ClassName } from '../type';
export interface Warning {
  // 告警Id
  id: number;
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
  // 是否展开
  expend?: boolean;
}

withDefaults(
  defineProps<{
    item: Warning;
  }>(),
  {
    item: () => ({
      id: new Date().getTime(),
      date: '-',
      type: '-',
      title: '-',
      content: '-',
      status: '-',
      expend: false,
    }),
    className: () => 'red',
  }
);

const emit = defineEmits<{
  (event: 'ignoreWarning', value: number): void;
}>();

const textColor = inject<Ref<ClassName>>('textColor');
const confirmedAlarmList = inject<Function>('confirmedAlarmList') as Function;
const handleShowSurplus = (alarm: Warning) => {
  alarm.expend = !alarm.expend;
};
const handleIgnore = (alarmId: number) => {
  emit('ignoreWarning', alarmId);
};

const handleConfirm = async (alarm: Warning) => {
  const result = await confirmedAlarmList();
  result ? (alarm.status = 'confirmed') : (alarm.status = 'unconfirm');
  alarm.expend = !alarm.expend;
};
</script>

<style lang="scss" scoped>
.type {
  color: v-bind(textColor);
}
.warning-wrapper {
  padding: 0 10px;

  .warning-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 163, 255, 0.14);
    height: 52px;

    .warning-type {
      height: 24px;
      border-radius: 3px;
      line-height: 24px;
      color: rgba(215, 40, 36, 1);
      border: 1px solid rgba(215, 40, 36, 1);
    }

    .discover {
      cursor: pointer;
    }
  }
  .button-wrapper {
    display: flex;
    justify-content: flex-end;

    :deep(.el-button--primary) {
      --el-button-bg-color: #409eff;
      --el-button-border-color: #409eff;
    }
    :deep(.el-button) {
      --el-button-hover-text-color: #606266;
      line-height: 28px;
    }
  }
  .body {
    font-size: 12px;
    border-bottom: 1px solid rgba(0, 163, 255, 0.14);

    .warning-detail {
      .warning-device {
      }

      .warning-content {
      }
    }
  }
}
</style>
