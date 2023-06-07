<template>
  <div class="setting-dialog">
    <el-dialog v-model="dialogVisible" :width="600" :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">设置</h4>
          <div class="close-btn" @click="close"></div>
        </div>
      </template>
      <el-form :model="formModel">
        <el-form-item label="当前状态：" prop="currentStatus">
          <el-radio-group v-model="formModel.currentStatus">
            <el-radio label="充电"></el-radio>
            <el-radio label="供电"></el-radio>
            <el-radio label="停止"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="showInput" label="功率：" prop="power">
          <el-input v-model="formModel.power" placeholder="请输入">
            <template #append>kW</template>
          </el-input>
        </el-form-item>
        <el-form-item class="submit-btn">
          <el-button @click="submit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
  }>(),
  {}
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'submitSetting', value: any): void;
}>();

// const showInput = ref(true);

const formModel = reactive({
  currentStatus: '充电',
  power: '',
});

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  },
});

const showInput = computed(() => {
  if (formModel.currentStatus === '停止') {
    return false;
  }
  return true;
});

const submit = () => {
  emit('submitSetting', formModel);
  emit('update:visible', false);
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border: 1px solid rgba(1, 52, 96, 1);
  --el-dialog-bg-color: rgba(0, 0, 0, 1);
  --el-text-color-primary: rgba(234, 245, 255, 1);
}

:deep(.el-dialog__header) {
  margin: 0;
  background-image: url('../assets/title-bg.png');
  background-size: 100% 100%;
  padding: 14px 20px;
  padding-bottom: 14px;
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.close-btn {
  width: 24px;
  height: 24px;
  background-image: url('../assets/title-close.png');
  background-size: 14px 14px;
  background-position: center center;
  background-repeat: no-repeat;
  cursor: pointer;
}

:deep(.el-form) {
  --el-text-color-regular: rgba(234, 245, 255, 1);
}

:deep(.el-radio-group) {
  --el-color-primary: rgba(47, 218, 47, 1);
  --el-radio-text-color: rgba(234, 245, 255, 1);

  .el-radio {
    display: grid;
    grid-auto-flow: column;
    .el-radio__input {
      grid-column-start: 2;
    }
  }
}

:deep(.el-input__wrapper) {
  --el-input-border-color: rgba(69, 78, 114, 1);
  background: transparent;
}

:deep(.el-input-group__append) {
  --el-input-border-color: rgba(69, 78, 114, 1);
  --el-color-info: rgba(255, 255, 255, 1);
  background-color: transparent;
}

.submit-btn {
  display: grid;
  justify-content: center;
}

:deep(.el-button) {
  --el-button-bg-color: rgba(0, 163, 255, 0.26);
  --el-button-border-color: rgba(0, 163, 255, 0.26);
  --el-button-text-color: #eaf5ff;
  --el-button-hover-bg-color: rgba(0, 163, 255, 0.26);
}
</style>
