<template>
  <div class="container">
    <img :src="img" />
  </div>
</template>

<script lang="ts">
export default {
  name: '404Vue',
}
</script>

<script lang="ts" setup>
import img from '@/assets/img/404.svg'
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;

  img {
    width: 1024 * 0.8px;
    height: 1024 * 0.8px;
  }
}
</style>
