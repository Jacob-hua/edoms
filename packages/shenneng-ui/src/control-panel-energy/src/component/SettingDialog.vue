<template>
  <el-dialog v-model="dialogVisible" :width="600">
    <el-form :model="formModel">
      <el-form-item label="当前状态：" prop="currentStatus">
        <el-radio-group v-model="formModel.currentStatus">
          <el-radio label="充电"></el-radio>
          <el-radio label="供电"></el-radio>
          <el-radio label="停止"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="showInput" label="功率">
        <el-input v-model="formModel.power">
          <template #append>kW</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
  }>(),
  {}
);

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

const showInput = ref(true);

const formModel = reactive({
  currentStatus: '',
  power: '',
});

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  },
});

const submit = () => {
  emit('update:visible', false);
};
</script>

<style lang="scss" scoped></style>
