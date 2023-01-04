<template>
  <div :class="['wrapper', isActive ? 'active' : '']" @click="handleClick">
    <div class="title">
      <div v-if="renameVisible" class="rename">
        <el-form ref="formRef" :inline="true" :model="formModel" :rules="formRules">
          <el-form-item prop="name">
            <el-input v-model="formModel.name" />
          </el-form-item>
        </el-form>
        <div>
          <el-icon @click="handleCancel"><Close /></el-icon>
          <el-icon @click="handleRename"><Check /></el-icon>
        </div>
      </div>
      <div v-else>
        <LongText
          :content="formModel.name"
          :content-style="{ width: '80%', textAlign: 'left', fontSize: '18px' }"
        ></LongText>
        <!-- {{ formModel.name }} -->
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
import LongText from '@/components/LongText.vue';
import useDate from '@/hooks/useDate';

const { formatTime } = useDate();

const props = defineProps<{
  pageId: string;
  data: ListVersionResItem;
  isActive: boolean;
}>();

const emit = defineEmits<{
  (emit: 'renameSuccess', value: ListVersionResItem): void;
  (emit: 'renameCatch', error: any): void;
  (emit: 'deleteSuccess'): void;
  (emit: 'deleteCatch', error: any): void;
  (emit: 'changeActive', value: ListVersionResItem): void;
}>();

const renameVisible = ref<boolean>(false);

const formRef = ref<FormInstance>();

const formModel = reactive({
  ...props.data,
});

const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入页面名称', trigger: 'blur' },
    { min: 1, max: 20, message: '页面名称长度1-20字符', trigger: 'blur' },
    { whitespace: true, message: '页面名称不能为空格', trigger: 'blur' },
  ],
});

const handleRenameVisible = () => {
  renameVisible.value = true;
};

const handleCancel = () => {
  renameVisible.value = false;
  formRef.value && formRef.value.resetFields();
};

const handleRename = async () => {
  try {
    formRef.value && (await formRef.value.validate());
    await versionApi.updateVersion({
      versionId: formModel.versionId,
      name: formModel.name,
      pageId: Number(props.pageId),
    });
    ElMessage.success('更新成功');
    emit('renameSuccess', formModel);
    renameVisible.value = false;
  } catch (error) {
    emit('renameCatch', error);
  }
};

const handleDelete = async () => {
  ElMessageBox.confirm(`此操作将删除${formModel.name}版本, 是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await versionApi.deleteVersion({
        versionIds: [formModel.versionId],
      });
      ElMessage.success('删除成功');
      emit('deleteSuccess');
    })
    .catch((error) => {
      emit('deleteCatch', error);
    });
};

const handleClick = () => {
  emit('changeActive', formModel);
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin: 0;
}
.wrapper {
  cursor: pointer;
  border-bottom: 1px solid #000000;
  padding: 5px 10px;
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
    padding-bottom: 12px;
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
