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
        <span>动态模型</span><el-switch v-model="useType" size="large" @change="handleChange"></el-switch
        ><span>静态模型</span>
      </div>
    </div>
    <section class="model-main">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
        <el-tab-pane v-for="({ name, label, component }, index) in tabPanels" :key="index" :label="label" :name="name">
          <component v-if="isShowComponent(activeName, name)" :is="component" v-bind="defaultProps"></component>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script lang="ts" setup name="Model">
import { ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';

import DynamicModel from './component/DynamicModel.vue';
import StaticModel from './component/StaticModel.vue';

const modelText = ref<string>('静态模型');
const { go } = useRouter();
const useType = ref<boolean>(true);
const modelMap = new Map<number, string>([
  [0, '静态模型'],
  [1, '动态模型'],
]);
const activeName = ref<string>('static');
const defaultProps = ref<{ application: string }>({
  application: '21321',
});
const tabPanels = shallowRef([
  {
    label: '静态模型',
    name: 'static',
    component: StaticModel,
  },
  {
    label: '动态模型',
    name: 'dynamic',
    component: DynamicModel,
  },
]);
const isShowComponent = (activeName: string, name: string): boolean => {
  return activeName === name;
};
const handleTabClick = () => {
  console.log(activeName.value);
};
const handleChange = (value: boolean) => {
  modelText.value = modelMap.get(Number(value)) as string;
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
