<template>
  <div>运行时页面</div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
}
#app {
  position: relative;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0 !important;
    display: none;
  }
}
</style>
