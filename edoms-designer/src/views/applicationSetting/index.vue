<template>
  <div class="container">
    <div class="header-top">
      <el-icon class="header-icon" :size="23" @click="goBack"><ArrowLeft /></el-icon>
      <span>{{ name }}</span>
    </div>
    <section>
      <div class="section-left">
        <el-tabs tab-position="left">
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><Document /></el-icon>
                <span>应用信息</span>
              </span>
            </template>
            <AppInfo @back="goBack" />
          </el-tab-pane>
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <el-icon :size="20"><Setting /></el-icon>
                <span>高级设置</span>
              </span>
            </template>
            <AdvancedSetting />
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import AppInfo from './component/AppInfo.vue'
import AdvancedSetting from './component/AdvancedSetting.vue'
import { useAppInfoStore } from '@/store/appInfo'
import { useRouter } from 'vue-router'
const { go } = useRouter()
const appInfoStore = useAppInfoStore()
const {
  appInfo: { name },
} = appInfoStore

const goBack = () => {
  go(-1)
  appInfoStore.$reset()
}
</script>

<style scoped lang="scss">
.container {
  .header-top {
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
  section {
    .section-left {
      margin: 60px 0 0 100px;
      .custom-tabs-label {
        display: flex;
        align-items: center;
        margin-right: 30px;
        span {
          font-size: 16px;
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
