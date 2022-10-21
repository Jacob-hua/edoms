<template>
  <el-dialog v-model="appVisible" title="新建应用" width="40%" center>
    <el-form ref="formRef" :model="dynamicValidateForm" label-width="80px" class="demo-dynamic">
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
        <el-input v-model="dynamicValidateForm.name" placeholder="请输入应用名称"></el-input>
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
          v-model="dynamicValidateForm.description"
          type="textarea"
          placeholder="请输入应用简介内容"
          min="0"
          max="40"
          :rows="6"
        ></el-input>
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
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="newApp">
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { useUpload } from '@/views/application/component/useUpload'
import { useCreateApp } from '@/views/application/component/useCreateApp'

const props = withDefaults(
  defineProps<{
    visible?: boolean
  }>(),
  {
    visible: () => false,
  }
)
const emit = defineEmits<{
  (event: 'update:visible', data: boolean): void
  (event: 'refreshList'): void
}>()
const { formRef, dynamicValidateForm, appVisible, cancel, submit } = useCreateApp(props.visible, emit)
const { dialogImageUrl, dialogVisible, disabled, accept, fileList, imgChange, handleRemove, handlePictureCardPreview } =
  useUpload(dynamicValidateForm)
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.demo-dynamic {
  padding-right: 40px;
}
</style>
