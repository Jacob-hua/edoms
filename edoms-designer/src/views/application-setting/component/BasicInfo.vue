<template>
  <div class="appInfo">
    <el-form ref="formRef" :model="appInfo" :rules="rules" label-width="80px" class="demo-dynamic">
      <el-form-item label="名称" prop="name">
        <el-input v-model="appInfo.name" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input
          v-model="appInfo.description"
          type="textarea"
          placeholder="请输入应用简介内容"
          min="0"
          max="40"
          :rows="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="路径">
        <div class="path-box">
          <span class="prefix-path">http://xxxxxxxxx.xx/dssd/</span>
          <el-input v-model="appInfo.serviceAddress" placeholder="请输入路径"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          v-model:file-list="fileList"
          action="#"
          :accept="accept"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="imgChange"
        >
          <el-icon><Plus /></el-icon>
          <template #file="{ file }">
            <div>
              <el-image :src="file.url">
                <template #error>
                  <div class="image-slot">
                    <img alt="" :src="NoData" />
                  </div>
                </template>
              </el-image>
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon><ZoomIn /></el-icon>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <el-image :src="dialogImageUrl">
            <template #error>
              <div class="image-slot">
                <img alt="" :src="NoData" />
              </div>
            </template>
          </el-image>
        </el-dialog>
      </el-form-item>
    </el-form>
    <div class="updateBtn" @click="update(appInfo)">更新</div>
  </div>
</template>

<script lang="ts" setup name="appInfo">
import { ref, toRefs } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';

import { updateApplication } from '@/api/application';
import { ApplicationInfo } from '@/api/application/type';
import { AppForm } from '@/api/application/type';
import NoData from '@/assets/img/no_data.png';
import { useUpload } from '@/views/application/component/useUpload';
const emit = defineEmits<{
  (event: 'back'): void;
}>();
const props = defineProps<{
  appInfo: ApplicationInfo;
}>();
const rules = {
  name: [
    {
      required: true,
      message: '请输入应用名称',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: '应用名称长度1-20字符',
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: '请输入应用简介',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 40,
      message: '应用简介长度1-40字符',
      trigger: 'blur',
    },
  ],
  serviceAddress: [],
};
const { appInfo } = toRefs(props);
const { dialogImageUrl, dialogVisible, disabled, accept, fileList, imgChange, handleRemove, handlePictureCardPreview } =
  useUpload(appInfo.value, [
    { url: `${import.meta.env.VITE_BASE_API}/file/download/?fileId=${appInfo.value?.thumbnailId}&isPreview=true` },
  ]);

const formRef = ref<FormInstance>();
const updateApp = async ({ applicationId, name, description, thumbnailId, serviceAddress }: AppForm) => {
  await updateApplication({
    applicationId,
    name,
    description,
    thumbnailId,
    serviceAddress,
  });
  ElMessage.success('更新成功');
};
const update = async (appInfo: AppForm) => {
  if (!formRef.value) return;
  try {
    await formRef.value?.validate();
    await updateApp(appInfo);
    emit('back');
  } catch (e: any) {
    console.log(e);
  }
};
</script>

<style lang="scss" scoped>
.el-image {
  width: 160px;
  height: 160px;
  .image-slot {
    img {
      width: 160px;
    }
  }
}
.appInfo {
  width: 1000px;
  margin: auto;
  .path-box {
    display: flex;
    .prefix-path {
      padding: 0 10px;
      background-color: #e0e0e0;
    }
  }
  .updateBtn {
    color: #fff;
    width: 160px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 10px;
    background-color: #409eff;
    margin: auto;
    cursor: pointer;
  }
}
</style>
