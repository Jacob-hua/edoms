<template>
  <el-row>
    <el-col :span="12">
      <el-row>
        <el-col :span="12">
          <span class="version-name">{{ versionItem.name }} </span>
          <span v-if="isCurrentVersion" class="currentFlag">default</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <LongText :content="versionItem.description || ''" :content-style="{ textAlign: 'left' }"></LongText>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="8" :offset="4">
      <el-row justify="end">
        <el-col :span="6">
          <el-button @click="handlePreview">预览</el-button>
        </el-col>
        <el-col :span="6">
          <el-button @click="handleEdit">修改</el-button>
        </el-col>
        <el-col :span="6">
          <el-button @click="handleExport">
            导出<el-icon><Download /></el-icon>
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button @click="handleDelete">
            删除<el-icon><Delete /></el-icon>
          </el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <EditVersionDialog
    v-if="editVersionVisible"
    v-model:visible="editVersionVisible"
    :application-id="applicationId"
    :application-name="applicationName"
    :version-item="versionItem"
    @success="handleUpdateSuccess"
  >
  </EditVersionDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Download } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import type { ListVersionResItem } from '@/api/version';
import versionApi from '@/api/version';
import LongText from '@/components/LongText.vue';

import EditVersionDialog from './EditVersionDialog.vue';

const props = defineProps<{
  versionItem: ListVersionResItem;
  applicationName: string;
  applicationId: string;
  defaultVersionId: string;
}>();

const emit = defineEmits<{
  (event: 'deleteSuccess'): void;
  (event: 'updateSuccess'): void;
}>();

const editVersionVisible = ref<boolean>(false);

const isCurrentVersion = computed(() => props.defaultVersionId === props.versionItem.versionId);

const handleDelete = () => {
  ElMessageBox.confirm(`是否删除${props.applicationName}-${props.versionItem.name}版本？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await versionApi.deleteVersion({ versionIds: [props.versionItem.versionId], applicationId: props.applicationId });
      ElMessage.success('删除成功');
      emit('deleteSuccess');
    })
    .catch(() => {});
};

const handleEdit = () => {
  editVersionVisible.value = true;
};

const handleUpdateSuccess = () => {
  emit('updateSuccess');
};

const handleExport = () => {};

const handlePreview = () => {};
</script>

<style lang="scss" scoped>
.version-name {
  font-size: 20px;
  font-weight: 500;
  padding-right: 10px;
}

.currentFlag {
  vertical-align: text-top;
  border: 1px solid #409eff;
  border-radius: 15px;
  padding: 2px 4px;
  font-size: 12px;
  background: #409eff;
  color: #fff;
}
</style>
