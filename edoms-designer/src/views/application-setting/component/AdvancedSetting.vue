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
            :placeholder="t('applicationSetting.rules.请选择版本来源')"
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
  <el-dialog
    v-model="deleteVisible"
    :title="t('applicationSetting.删除应用')"
    width="40%"
    :before-close="handleClose"
    center
  >
    <div class="modal-container">
      <p>{{ t('applicationSetting.tip.正在删除') }} “{{ appInfo.name }}” {{ t('applicationSetting.tip.应用') }}</p>
      <p class="confirm" @click="handleCopy">
        {{ t('applicationSetting.tip.请在输入框输入') }}"{{ confirmText }}"
        {{ t('applicationSetting.tip.已确认此操作') }}
      </p>
      <el-form ref="formRef" :model="confirmForm" :rules="rules">
        <el-form-item prop="inputText">
          <el-input v-model="confirmForm.inputText" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="large" @click="handleConfirm">
          {{ t('applicationSetting.确认') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="advancedSetting">
import { computed, reactive, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import { ElMessage, FormInstance } from 'element-plus';

import applicationApi, { GetApplicationRes } from '@/api/application';
import useAccountStore from '@/store/account';

import SwitchVersion, { VersionModel } from '../../page/component/SwitchVersion.vue';
const { t } = useI18n();
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
const { hasRole } = useAccountStore();
const { appInfo } = toRefs(props);
const deleteVisible = ref<boolean>(false);
const confirmText = ref<string>('');
const formRef = ref<FormInstance>();
const formModel = reactive({
  selectedForm: {
    name: props.appInfo.defaultVersionName,
    versionId: props.appInfo.defaultVersionId,
    contentId: props.appInfo.defaultVersionContentId,
  } as VersionModel,
});

const handleUpdateDefaultVersion = async () => {
  const { versionId } = formModel.selectedForm;
  if (!versionId) {
    ElMessage.warning(t('applicationSetting.rules.请选择默认版本'));
    return;
  }
  try {
    await applicationApi.updateDefaultVersion({
      applicationId: props.appInfo.applicationId,
      versionId: formModel.selectedForm.versionId,
    });
    ElMessage.success(t('applicationSetting.tip.设置默认版本成功'));
    emit('success');
  } catch (e: any) {
    console.log(e);
  }
};

const advanceItems = computed<AdvanceItem[]>(() => {
  if (!hasRole(['manager'])) {
    return [
      {
        name: t('applicationSetting.默认版本'),
        title: t('applicationSetting.tip.设置该项目的默认版本'),
        buttonType: 'primary',
        disabled: false,
        formVisible: true,
        buttonText: t('applicationSetting.确认'),
        action: async () => {
          await handleUpdateDefaultVersion();
        },
      },
    ];
  }
  return [
    {
      name: t('applicationSetting.默认版本'),
      title: t('applicationSetting.tip.设置该项目的默认版本'),
      buttonType: 'primary',
      disabled: false,
      formVisible: true,
      buttonText: t('applicationSetting.确认'),
      action: async () => {
        await handleUpdateDefaultVersion();
      },
    },
    {
      name: t('applicationSetting.删除'),
      title: t('applicationSetting.tip.将应用删除'),
      buttonType: 'danger',
      disabled: false,
      action: () => {
        deleteVisible.value = true;
        confirmText.value = appInfo.value.secret;
      },
    },
  ];
});

const rules = {
  inputText: [
    {
      required: true,
      message: t('applicationSetting.rules.请输入确认信息'),
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
  ElMessage.success(t('applicationSetting.删除成功'));
  router.go(-1);
};

const handleClose = () => {
  formRef.value?.resetFields();
  deleteVisible.value = false;
};

const handleCopy = () => {
  navigator.clipboard.writeText(confirmText.value);
  ElMessage.success(`${t('applicationSetting.复制内容为')}${confirmText.value}`);
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
