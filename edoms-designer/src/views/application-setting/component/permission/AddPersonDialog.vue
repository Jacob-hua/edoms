<template>
  <div class="add-wrapper">
    <el-dialog v-model="dialogVisible" title="添加人员" width="40%" center>
      <el-form ref="formRef" :model="permissionAddForm" :rules="formRules" label-width="80px" class="demo-dynamic">
        <el-form-item label="权限" prop="roleId">
          <div>{{ roleName }}</div>
        </el-form-item>
        <el-form-item label="用户昵称" prop="userId">
          <el-select v-model="permissionAddForm.userId" placeholder="请选择用户昵称">
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
          <el-button @click="handleFormCancel">取消</el-button>
          <el-button type="primary" @click="handleFormSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';

import { PermissionAdd, Role, User } from '@/api/permission';
import PermissionApi from '@/api/permission';

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
  userId: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
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
  ElMessage.success('添加人员成功');
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
