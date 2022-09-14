<template>
  <div class="about">
    <h1>This is an about page test</h1>
    <el-button @click="onClick">点击请求API</el-button>
    {{ result }}
  </div>
</template>

<script lang="ts" setup name="AboutView">
import { listApplications } from '@/api/application'
import { listPages } from '@/api/page'
import { ref } from 'vue'

const result = ref({})

const onClick = () => {
  listApplications({
    page: 1,
    limit: 10,
  })
    .then((res) => {
      result.value = res
    })
    .catch((err) => {
      result.value = err
    })
  listPages({
    page: 1,
    limit: 10,
    applicationId: '11',
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
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
