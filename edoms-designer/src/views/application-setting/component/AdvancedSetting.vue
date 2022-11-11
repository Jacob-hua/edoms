<template>
  <div class="advance-container">
    <div v-for="({ name, title, buttonType, action }, index) in advanceItems" :key="index" class="advance-item">
      <div class="top-title">
        <p>
          <el-icon color="#e0e0e0"> <Minus /> </el-icon>
        </p>
        <span>{{ name }}</span>
      </div>
      <p class="advance-item-title">{{ title }}</p>
      <el-button :type="buttonType" size="large" @click="action">{{ name }}</el-button>
    </div>
  </div>
  <el-dialog v-model="deleteVisible" title="删除应用" width="40%" :before-close="handleClose" center>
    <div class="modal-container">
      <p>正在删除 “{{ appInfo.name }}” 应用，应用数据将被清空。请输入下面内容后确认删除！</p>
      <p class="confirm">请在输入框输入"{{ confirmText }}" 以确认此操作</p>
      <el-input v-model="inputText"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="large" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="advancedSetting">
import { ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

import { ApplicationInfo } from '@/api/application/type';
import { deleteApplication } from '@/api/application-setting';

interface AdvanceItem {
  name: string;
  title: string;
  buttonType: string;
  action: (...args: any[]) => void;
}

const props = defineProps<{
  appInfo: ApplicationInfo;
}>();

const router = useRouter();

const { appInfo } = toRefs(props);
const deleteVisible = ref<boolean>(false);
const confirmText = ref<string>('');
const inputText = ref<string>('');
const handleDelete = () => {
  deleteVisible.value = true;
  confirmText.value = appInfo.value.secret;
};
const handleConfirm = async () => {
  await deleteApplication({
    applicationId: appInfo.value.applicationId,
    secret: inputText.value,
  });
  deleteVisible.value = false;
  ElMessage.success('删除成功');
  router.go(-1);
};
const handleExportApplication = () => {};
const handleClose = () => {
  deleteVisible.value = false;
};
const advanceItems = ref<AdvanceItem[]>([
  {
    name: '导出',
    title: '可将应用导出到本地',
    buttonType: 'primary',
    action: handleExportApplication,
  },
  {
    name: '删除',
    title: '将应用删除，应用下的页面也将全部删除',
    buttonType: 'danger',
    action: handleDelete,
  },
]);
</script>

<style lang="scss" scoped>
.advance-container {
  width: 1200px;
  height: 600px;
  margin: auto;
  .advance-item {
    margin-bottom: 80px;
    .advance-item-title {
      font-size: 18px;
      font-weight: 600;
      margin: 30px 0;
    }
    .top-title {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 25px;
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        margin-right: 15px;
        background-color: #efefef;
      }
      span {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
}
.modal-container {
  p {
    font-size: 18px;
    font-weight: 500;
  }
  .confirm {
    margin-top: 40px;
    margin-bottom: 25px;
  }
}
</style>
