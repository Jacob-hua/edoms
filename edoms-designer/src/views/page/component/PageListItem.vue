<template>
  <div :class="['item', isActive ? 'active' : '']" @click="handleActive(data)">
    <template v-if="renameVisible">
      <el-form ref="formRef" :inline="true" :model="formModel" :rules="formRules">
        <el-form-item prop="pageName">
          <el-input v-model="formModel.pageName"></el-input>
        </el-form-item>
      </el-form>
      <div style="display: flex; padding: 0 10px">
        <el-icon :size="20" @click="handleCancel"><Close /></el-icon>
        <el-icon :size="20" @click="handleRename"><Check /></el-icon>
      </div>
    </template>
    <template v-else>
      <p>{{ pageName }}</p>
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

import pageApi from '@/api/page';
import PopMenu from '@/components/PopMenu.vue';
import PopMenuOption from '@/components/PopMenuOption.vue';

const props = defineProps<{
  applicationId: string;
  data: any;
  isActive: boolean;
}>();

const router = useRouter();

const emit = defineEmits<{
  (event: 'renameSuccess'): void;
  (event: 'renameCatch', error: any): void;
  (event: 'deleteSuccess'): void;
  (event: 'deleteCatch', error: any): void;
  (event: 'changeActive', item: any): void;
}>();

const pageName = ref<string>(props.data.name);

const formRef = ref<FormInstance>();

const formModel = reactive({
  pageName: props.data.name,
});

const formRules = reactive<FormRules>({
  pageName: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
});

const renameVisible = ref<boolean>(false);

const menus = [
  {
    name: 'rename',
    label: '重命名',
    icon: 'Operation',
    action: () => {
      formModel.pageName = props.data.name;
      renameVisible.value = true;
    },
  },
  {
    name: 'edit',
    label: '编辑页面',
    icon: 'Edit',
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
    name: 'delete',
    label: '删除',
    icon: 'Delete',
    action: () => {
      ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
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

const handleActive = (item: any) => {
  emit('changeActive', item);
};

const handleMenuClick = (value: string | number) => {
  const menu = menus.find(({ name }) => name === value);
  menu?.action();
};

const handleCancel = () => {
  renameVisible.value = false;
  formModel.pageName = pageName.value;
};

const handleRename = async () => {
  try {
    formRef.value && (await formRef.value.validate());
    pageName.value = formModel.pageName;
    await pageApi.updatePage({
      pageId: props.data.pageId,
      name: formModel.pageName,
      applicationId: props.applicationId,
    });
    renameVisible.value = false;
    ElMessage.success('重命名成功');
    emit('renameSuccess');
  } catch (error) {
    emit('renameCatch', error);
  }
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
}
</style>
