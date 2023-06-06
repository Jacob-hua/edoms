<template>
  <div class="setting-dialog">
    <el-dialog v-model="dialogVisible" :width="600" :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">权限审核</h4>
          <div class="close-btn" @click="close"></div>
        </div>
      </template>
      <el-form :model="permssion" label-position="right" label-width="100px">
        <el-form-item label="用户名称：" prop="username">
          <el-input v-model="permssion.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="permssion.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="submit-btn">
          <el-button @click="cancle">取消</el-button>
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
  (event: 'checkPermission', value: boolean): void;
}>();

const permssion = reactive({
  username: '',
  password: '',
});

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  },
});

const cancle = () => {
  emit('update:visible', false);
};

const submit = () => {
  emit('checkPermission', true);
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

:deep(.el-input__wrapper) {
  --el-input-border-color: rgba(69, 78, 114, 1);
  background: transparent;
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
