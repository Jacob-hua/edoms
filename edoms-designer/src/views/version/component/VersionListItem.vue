<template>
  <div :class="['wrapper', isActive ? 'active' : '']">
    <div class="title">
      <div v-if="renameVisible" class="rename">
        <el-form ref="formRef" :inline="true" :model="formModel" :rules="formRules">
          <el-form-item prop="versionName">
            <el-input v-model="formModel.versionName" />
          </el-form-item>
        </el-form>
        <div>
          <el-icon @click="handleCancel"><Close /></el-icon>
          <el-icon @click="handleRename"><Check /></el-icon>
        </div>
      </div>
      <div v-else>
        {{ versionName }}
      </div>
    </div>
    <div class="time">{{ formatTime(data.createTime) }}</div>
    <div class="author">{{ data.createBy }}</div>
    <div class="operation">
      <el-icon @click="handleRenameVisible"><EditPen /></el-icon>
      <el-icon @click="handleDelete"><Delete /></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';

import type { ListVersionResItem } from '@/api/version';
import versionApi from '@/api/version';
import useDate from '@/hooks/useDate';

const { formatTime } = useDate();

const props = defineProps<{
  pageId: string;
  data: ListVersionResItem;
  isActive: boolean;
}>();

const emit = defineEmits<{
  (emit: 'renameSuccess'): void;
  (emit: 'renameCatch', error: any): void;
  (emit: 'deleteSuccess'): void;
  (emit: 'deleteCatch', error: any): void;
  (emit: 'changeActive', item: any): void;
}>();

const versionName = ref<string>(props.data.name);

const renameVisible = ref<boolean>(false);

const formRef = ref<FormInstance>();

const formModel = reactive({
  versionName: props.data.name,
});

const formRules = reactive<FormRules>({
  versionName: [{ required: true, message: '请输入版本名称', trigger: 'blur' }],
});

const handleRenameVisible = () => {
  renameVisible.value = true;
};

const handleCancel = () => {
  formModel.versionName = versionName.value;
  renameVisible.value = false;
};

const handleRename = async () => {
  try {
    formRef.value && (await formRef.value.validate());
    versionName.value = formModel.versionName;
    await versionApi.updateVersion({
      versionId: props.data.versionId,
      name: formModel.versionName,
      pageId: Number(props.pageId),
    });
    ElMessage.success('更新成功');
    emit('renameSuccess');
    renameVisible.value = false;
  } catch (error) {
    emit('renameCatch', error);
  }
};

const handleDelete = async () => {
  ElMessageBox.confirm(`此操作将删除${versionName.value}版本, 是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await versionApi.deleteVersion({
        versionIds: [props.data.versionId],
      });
      ElMessage.success('删除成功');
      emit('deleteSuccess');
    })
    .catch((error) => {
      emit('deleteCatch', error);
    });
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin: 0;
}
.wrapper {
  cursor: pointer;
  border-bottom: 1px solid #000000;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-areas:
    'title title'
    'time time'
    'author operation';
  &:hover {
    .operation {
      visibility: visible;
    }
  }
}
.active {
  background-color: #409eff;
}
.title {
  grid-area: title;
  font-weight: 400;
  font-size: 18px;
  .rename {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & i {
      cursor: pointer;
    }
  }
}
.time {
  grid-area: time;
  font-size: 14px;
}
.author {
  grid-area: author;
  font-size: 14px;
}
.operation {
  visibility: hidden;
  grid-area: operation;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  & > i {
    cursor: pointer;
  }
}
</style>
