<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <el-button>ElementButton</el-button>
    <EdComponent v-for="config in configs" :key="config.id" :node="config" />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { EdNode } from '@edoms/components'

const configs: Ref<EdNode[]> = ref([
  {
    id: '0',
    type: 'EdButton',
    name: 'EDom',
    text: '按钮',
    disableText: '禁用按钮',
  },
  {
    id: '1',
    type: 'EdButton',
    name: 'EDoms组件2',
  },
  {
    id: '2',
    type: 'EdButton',
    name: 'EDoms组件22222',
  },
])
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
