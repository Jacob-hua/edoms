<template>
  <div class="about">
    <h1>This is an about page test</h1>
    <el-button @click="onClick">点击请求API</el-button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'AboutView',
}
</script>

<script lang="ts" setup>
import { listApplications } from '@/api/application'

const onClick = () => {
  listApplications({
    page: 1,
    limit: 10,
  })
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
