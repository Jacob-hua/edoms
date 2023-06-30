<template>
  <div class="add-wrapper">
    <el-dialog v-model="dialogVisible" :title="$t('permission.addPersonnel')" width="40%" center>
      <el-form ref="formRef" :model="permissionAddForm" :rules="formRules" label-width="80px" class="demo-dynamic">
        <el-form-item :label="$t('permission.permission')" prop="roleId">
          <div>{{ roleName }}</div>
        </el-form-item>
        <el-form-item :label="$t('permission.nickname')" prop="userId">
          <el-select v-model="permissionAddForm.userId" :placeholder="$t('permission.rules.selectNickname')">
            <el-option
              v-for="{ userId, userName } in userList"
              :key="userId"
              :label="userName"
              :value="userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleFormCancel">{{ $t('permission.cancel') }}</el-button>
          <el-button type="primary" @click="handleFormSubmit">{{ $t('permission.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, FormInstance } from 'element-plus';

import { PermissionAdd, Role, User } from '@/api/permission';
import PermissionApi from '@/api/permission';
const { t } = useI18n();
const formRef = ref<FormInstance>();
const props = withDefaults(
  defineProps<{
    visible: boolean;
    applicationId: string;
  }>(),
  {
    visible: () => false,
  }
);
const emit = defineEmits<{
  (event: 'update:visible', data: boolean): void;
  (event: 'submitted'): void;
}>();

const dialogVisible = computed<boolean>({
  get: () => props.visible,
  set: (visible) => {
    if (!visible) {
      formRef.value?.resetFields();
    }
    emit('update:visible', visible);
  },
});

const formRules = {
  userId: [{ required: true, message: t('permission.rules.noNickname'), trigger: 'blur' }],
};

const permissionAddForm = ref<PermissionAdd>({
  applicationId: props.applicationId,
  roleId: '',
  userId: '',
});
const roleList = ref<Role[]>();
const userList = ref<User[]>();
const roleName = ref<string>();
const loadUserListAndRoleList = async () => {
  const [users, roles] = await Promise.all([
    PermissionApi.userList({ applicationId: props.applicationId }),
    PermissionApi.roleList(),
  ]);
  userList.value = users ?? [];
  roleList.value = roles ?? [];
  permissionAddForm.value.roleId = roleList?.value[0]?.roleId;
  roleName.value = roleList.value[0].roleName;
};

const handleFormSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value?.validate();
  await PermissionApi.permissionAdd({ ...permissionAddForm.value });
  ElMessage.success(t('permission.addSuccess'));
  emit('submitted');
  handleFormCancel();
};

const handleFormCancel = () => {
  dialogVisible.value = false;
};

onMounted(() => {
  loadUserListAndRoleList();
});
</script>

<style lang="scss" scoped></style>
