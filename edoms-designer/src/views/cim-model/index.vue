<template>
  <div class="container">
    <div class="header-top" @click="goBack">
      <el-icon class="header-icon" :size="23"><ArrowLeft /></el-icon>
      <span>陕汽冷站</span>
    </div>
    <div class="header-bar">
      <div class="header-bar-left">
        <span class="name">CIM模型</span>
        <span class="use"
          ><span class="text">当前采用:</span> <span class="model">{{ modelText }}</span>
        </span>
      </div>
      <div class="header-bar-right">
        <el-switch
          v-model="useType"
          :inactive-value="switchInactive.value"
          :inactive-text="switchInactive.text"
          :active-value="switchActive.value"
          :active-text="switchActive.text"
          size="large"
          @change="handleTypeChange"
        ></el-switch>
      </div>
    </div>
    <section class="model-main">
      <el-tabs v-model="tabActive" class="demo-tabs">
        <el-tab-pane v-for="{ value, text, component } in tabPanels" :key="value" :label="text" :name="value">
          <component v-if="tabActive === value" :is="component"></component>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script lang="ts" setup name="Model">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

import { getModelType, updateModelType } from '@/api/model';
import { ModelType } from '@/const/model';

import DynamicModel from './component/DynamicModel.vue';
import StaticModel from './component/StaticModel.vue';

const { go } = useRouter();
const modelTypeConfig = {
  [ModelType.STATIC]: {
    value: ModelType.STATIC,
    text: '静态模型',
    component: StaticModel,
  },
  [ModelType.DYNAMIC]: {
    value: ModelType.DYNAMIC,
    text: '动态模型',
    component: DynamicModel,
  },
};
const switchActive = computed(() => modelTypeConfig[ModelType.DYNAMIC]);
const switchInactive = computed(() => modelTypeConfig[ModelType.STATIC]);

const useType = ref<ModelType>(ModelType.STATIC);
const modelText = computed(() => modelTypeConfig[useType.value]?.text);

const tabPanels = computed(() => Object.values(modelTypeConfig));

const tabActive = ref<ModelType>(tabPanels.value[0].value);

const loadModelType = async () => {
  const { modelType } = await getModelType();
  useType.value = Number(modelType);
};
onMounted(() => {
  loadModelType();
});
const handleTypeChange = async (value: number) => {
  await updateModelType({
    modelType: String(value),
    modelTypeId: 1,
  });
  ElMessage.success('更新成功');
};
const goBack = () => {
  go(-1);
};
</script>

<style lang="scss" scoped>
.container {
  .header-top {
    padding-left: 35px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    .header-icon {
      cursor: pointer;
    }
    span {
      font-size: 16px;
      margin-left: 20px;
    }
  }
  .header-bar {
    display: flex;
    justify-content: space-between;
    padding: 30px 80px;
    .header-bar-left {
      .name {
        font-size: 24px;
        font-weight: 500;
        margin-right: 25px;
      }
      .use {
        .text {
          margin-right: 10px;
        }
        .model {
          font-size: 18px;
          color: orange;
          border: 1px solid orange;
          padding: 0 10px;
        }
      }
    }
    .header-bar-right {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-switch {
        margin: 0 20px;
      }
    }
  }
  .model-main {
    padding-left: 80px;
  }
}
</style>
