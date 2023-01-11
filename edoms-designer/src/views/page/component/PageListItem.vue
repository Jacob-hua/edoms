<template>
  <div :class="['item', isActive ? 'active' : '']">
    <template v-if="renameVisible">
      <el-form ref="formRef" :inline="true" :model="formModel" :rules="formRules">
        <el-form-item prop="name">
          <el-input v-model="formModel.name"></el-input>
        </el-form-item>
      </el-form>
      <div style="display: flex; padding: 0 10px">
        <el-icon :size="20" @click="handleCancel"><Close /></el-icon>
        <el-icon :size="20" @click="handleRename"><Check /></el-icon>
      </div>
    </template>
    <template v-else>
      <p class="pop-menu-content">
        <el-icon v-if="formModel.isHomePage" :size="20"><House /></el-icon>
        <LongText :content="formModel.name" :content-style="{ textAlign: 'left' }"></LongText>
      </p>
      <div class="pop-menu-wrapper">
        <PopMenu @menu-click="handleMenuClick">
          <PopMenuOption v-for="(menu, index) in menus" :key="index" :label="menu.label" :value="menu.name">
            <div class="pop-menu-item">
              <el-icon :size="20">
                <component :is="menu.icon" />
              </el-icon>
              <span>{{ menu.label }}</span>
            </div>
          </PopMenuOption>
        </PopMenu>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';

import type { ListPageResItem } from '@/api/page';
import pageApi from '@/api/page';
import LongText from '@/components/LongText.vue';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';

export interface ListPageItem extends ListPageResItem {
  /** 页面首页标识 */
  isHomePage?: boolean;
}

const props = defineProps<{
  applicationId: string;
  data: ListPageItem;
  isActive: boolean;
}>();

const emit = defineEmits<{
  (event: 'renameSuccess', value: ListPageItem): void;
  (event: 'renameCatch', error: any): void;
  (event: 'deleteSuccess'): void;
  (event: 'deleteCatch', error: any): void;
  (event: 'useIndexSuccess'): void;
  (event: 'useIndexCatch', error: any): void;
}>();

const router = useRouter();

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

const renameVisible = ref<boolean>(false);

const menus = [
  {
    name: 'edit',
    label: '编辑',
    icon: 'Operation',
    action: () => {
      router.push({
        path: '/editor',
        query: {
          pageId: props.data.pageId,
        },
      });
    },
  },
  {
    name: 'rename',
    label: '重命名',
    icon: 'Operation',
    action: () => {
      renameVisible.value = true;
    },
  },
  {
    name: 'setIndex',
    label: '设置首页',
    icon: 'Operation',
    action: () => {
      ElMessageBox.confirm(`是否将${formModel.name}设置为首页?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await pageApi.useToIndex({
            pageId: props.data.pageId,
            applicationId: props.applicationId,
          });
          ElMessage.success('设置成功');
          emit('useIndexSuccess');
        })
        .catch((e) => {
          emit('useIndexCatch', e);
        });
    },
  },
  {
    name: 'delete',
    label: '删除',
    icon: 'Delete',
    action: () => {
      ElMessageBox.confirm(`此操作将永久删除${formModel.name}, 是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await pageApi.deletePage({
            pageIds: [props.data.pageId],
          });
          ElMessage.success('删除成功');
          emit('deleteSuccess');
        })
        .catch((e) => {
          emit('deleteCatch', e);
        });
    },
  },
];

const handleMenuClick = (value: (string | number)[]) => {
  const menu = menus.find(({ name }) => name === value[0]);
  menu?.action();
};

const handleCancel = () => {
  renameVisible.value = false;
  formRef.value && formRef.value.resetFields();
};

const handleRename = async () => {
  try {
    formRef.value && (await formRef.value.validate());
    await pageApi.updatePage({
      pageId: props.data.pageId,
      name: formModel.name,
      applicationId: props.applicationId,
    });
    renameVisible.value = false;
    ElMessage.success('重命名成功');
    emit('renameSuccess', formModel);
  } catch (error) {
    emit('renameCatch', error);
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin: 0;
}

.active {
  background-color: #409eff;
}

.pop-menu-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.item {
  cursor: pointer;
  width: 100%;
  height: 45px;
  line-height: 45px;
  padding-left: 10px;
  border-bottom: 1px solid #e1e1e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
