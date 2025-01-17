<template>
  <el-card class="box-card">
    <template #header>
      <div class="clearfix">
        <span>{{ t('permission.参与者') }}</span>
        <el-button type="primary" @click="handleAddPermission">{{ t('permission.添加') }}</el-button>
      </div>
    </template>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="username" :label="t('permission.用户昵称')" align="center" />
      <el-table-column prop="roleName" :label="t('permission.权限')" align="center" />
      <el-table-column :label="t('permission.操作')">
        <template #default="{ row }">
          <el-button v-if="row.isDisplay" size="small" type="danger" @click="handleDelete(row)">{{
            t('permission.删除')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @update:current-page="handleCurrentPageChange"
      />
    </div>
    <AddPersonDialog
      v-if="visible"
      v-model:visible="visible"
      :application-id="appInfo.applicationId"
      @submitted="handleSubmitted"
    ></AddPersonDialog>
  </el-card>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';

import { GetApplicationRes } from '@/api/application';
import PermissionApi, { Permission, PermissionListReq } from '@/api/permission';

import AddPersonDialog from './AddPersonDialog.vue';
const { t } = useI18n();
const props = defineProps<{
  appInfo: GetApplicationRes;
}>();

const total = ref<number>();
const tableData = ref<Permission[]>();
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const queryParams = ref<PermissionListReq>({
  applicationId: props.appInfo?.applicationId,
  limit: 10,
  page: 1,
});

const getPermissionList = async (queryParams: Ref<PermissionListReq>) => {
  loading.value = true;
  try {
    const { dataList, count } = await PermissionApi.permissionList({ ...queryParams.value });
    total.value = +count;
    tableData.value = dataList ?? [];
  } catch (e: any) {
    loading.value = false;
    throw new Error(e);
  } finally {
    loading.value = false;
  }
};

watch(
  () => queryParams,
  (newQueryParams) => {
    getPermissionList(newQueryParams);
  },
  {
    immediate: true,
  }
);

const handleAddPermission = () => {
  visible.value = true;
};
const handleSubmitted = () => {
  getPermissionList(queryParams);
};
const handleDelete = async ({ userId }: Permission) => {
  ElMessageBox.confirm(t('permission.此操作将永久删除此行记录'), t('permission.提示'), {
    confirmButtonText: t('permission.确认'),
    cancelButtonText: t('permission.取消'),
    type: 'warning',
  })
    .then(async () => {
      await PermissionApi.permissionDelete({
        applicationId: props.appInfo.applicationId,
        userId,
      });
      ElMessage.success(t('permission.删除成功'));
      getPermissionList(queryParams);
    })
    .catch(() => {});
};

const handleCurrentPageChange = (value: number) => {
  queryParams.value.page = value;
  getPermissionList(queryParams);
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 80%;
  margin-left: 10%;
  .clearfix {
    display: flex;
    justify-content: space-between;
  }
  .pagination {
    float: right;
    margin: 40px;
  }
}
</style>
