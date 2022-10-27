<template>
  <div class="appInfo">
    <el-form ref="formRef" :model="appInfo" label-width="80px" class="demo-dynamic">
      <el-form-item
        label="名称"
        prop="name"
        :rules="[
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
        ]"
      >
        <el-input v-model="appInfo.name" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item
        label="简介"
        prop="description"
        :rules="[
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
        ]"
      >
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
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
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
          <img :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <div class="updateBtn" @click="update(appInfo)">更新</div>
  </div>
</template>

<script lang="ts" setup name="appInfo">
import { toRefs } from 'vue';

// import { useAppInfoStore } from '@/store/appInfo'
import { ApplicationInfo } from '@/api/application/type';
import { useUpload } from '@/views/application/component/useUpload';
import { useAppInfo } from '@/views/application/setting/component/useAppInfo';
const emit = defineEmits<{
  (event: 'back'): void;
}>();
const props = defineProps<{
  appInfo: ApplicationInfo;
}>();
const { appInfo } = toRefs(props);
const { formRef, update } = useAppInfo(emit);
const { dialogImageUrl, dialogVisible, disabled, accept, fileList, imgChange, handleRemove, handlePictureCardPreview } =
  useUpload(appInfo.value, [
    { url: `${import.meta.env.VITE_BASE_API}/file/download/?fileId=${appInfo.value?.thumbnailId}&isPreview=true` },
  ]);
</script>

<style lang="scss" scoped>
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
