<template>
  <div class="advance-container">
    <div
      v-for="({ name, title, buttonType, disabled, action, formVisible, buttonText }, index) in advanceItems"
      :key="index"
      class="advance-item"
    >
      <div class="top-title">
        <p>
          <el-icon color="#e0e0e0">
            <Minus />
          </el-icon>
        </p>
        <span>{{ name }}</span>
      </div>
      <p class="advance-item-title">{{ title }}</p>
      <SwitchVersion v-if="formVisible" v-model="formModel.selectedForm" :application-id="appInfo.applicationId">
        <template #default="{ version }">
          <el-input
            :value="version?.name"
            clearable
            placeholder="请选择版本来源"
            style="cursor: pointer; width: 20%"
            :suffix-icon="ArrowDown"
          ></el-input>
        </template>
      </SwitchVersion>
      <div class="item-footer-btn">
        <el-button :type="buttonType" :disabled="disabled" size="large" @click="action">
          {{ buttonText || name }}</el-button
        >
      </div>
    </div>
  </div>
  <el-dialog v-model="deleteVisible" title="删除应用" width="40%" :before-close="handleClose" center>
    <div class="modal-container">
      <p>正在删除 “{{ appInfo.name }}” 应用，应用数据将被清空。请输入下面内容后确认删除！</p>
      <p class="confirm" @click="handleCopy">请在输入框输入"{{ confirmText }}" 以确认此操作。</p>
      <el-form ref="formRef" :model="confirmForm" :rules="rules">
        <el-form-item prop="inputText">
          <el-input v-model="confirmForm.inputText" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="large" @click="handleConfirm"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="advancedSetting">
import { computed, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import { ElMessage, FormInstance } from 'element-plus';

import applicationApi, { GetApplicationRes } from '@/api/application';

import SwitchVersion, { VersionModel } from '../../page/component/SwitchVersion.vue';

interface AdvanceItem {
  name: string;
  title: string;
  buttonType: string;
  disabled: boolean;
  formVisible?: boolean;
  buttonText?: string;
  action: (...args: any[]) => void;
}

const props = defineProps<{
  appInfo: GetApplicationRes;
}>();

const emit = defineEmits<{
  (event: 'success'): void;
}>();

const router = useRouter();

const { appInfo } = toRefs(props);
const deleteVisible = ref<boolean>(false);
const confirmText = ref<string>('');
const formRef = ref<FormInstance>();
const formModel = reactive({
  selectedForm: { name: '', versionId: '', contentId: '' } as VersionModel,
});

const handleUpdateDefaultVersion = async () => {
  const { versionId } = formModel.selectedForm;
  if (!versionId) {
    ElMessage.warning('请选择默认版本！');
    return;
  }
  try {
    await applicationApi.updateDefaultVersion({
      applicationId: props.appInfo.applicationId,
      versionId: formModel.selectedForm.versionId,
    });
    ElMessage.success('设置默认版本成功！');
    emit('success');
  } catch (e: any) {
    console.log(e);
  }
};

const advanceItems = computed<AdvanceItem[]>(() => [
  {
    name: '默认版本',
    title: '设置该项目的默认版本',
    buttonType: 'primary',
    disabled: false,
    formVisible: true,
    buttonText: '确认',
    action: async () => {
      await handleUpdateDefaultVersion();
    },
  },
  {
    name: '删除',
    title: '将应用删除，应用下的页面也将全部删除',
    buttonType: 'danger',
    disabled: false,
    action: () => {
      deleteVisible.value = true;
      confirmText.value = appInfo.value.secret;
    },
  },
]);

const rules = {
  inputText: [
    {
      required: true,
      message: '请输入确认信息',
      trigger: 'blur',
    },
  ],
};
const confirmForm = ref({
  inputText: '',
});

const handleConfirm = async () => {
  if (!formRef.value) return;
  await formRef.value?.validate();
  await applicationApi.deleteApplication({
    applicationId: appInfo.value.applicationId,
    secret: confirmForm.value.inputText,
  });
  deleteVisible.value = false;
  ElMessage.success('删除成功');
  router.go(-1);
};

const handleClose = () => {
  formRef.value?.resetFields();
  deleteVisible.value = false;
};

const handleCopy = () => {
  navigator.clipboard.writeText(confirmText.value);
  ElMessage.success(`复制内容为${confirmText.value}`);
};
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

    .item-footer-btn {
      margin-top: 30px;
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
    cursor: pointer;
  }
}
</style>
