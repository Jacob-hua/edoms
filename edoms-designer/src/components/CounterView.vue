<template>
  <div>计数器</div>
  <div>
    <el-button type="primary" @click="increment">加+</el-button>
    {{ count }}
    <el-button type="primary" @click="subtraction">减-</el-button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CounterView',
}
</script>

<script lang="ts" setup>
import { useCounterStore } from '../store/counter'
import { computed } from 'vue'

const counterStore = useCounterStore()

const count = computed(() => counterStore.counter)

const increment = () => {
  counterStore.increment()
}

const subtraction = () => {
  counterStore.subtraction()
}
</script>
