<template>
  <div>
    <el-button type="primary" @click="onIncrement">+</el-button>
    <span>{{ num }}</span>
    <el-button type="primary" @click="onSubtraction">---</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter'
import { computed } from 'vue'

const counter = useCounterStore()

const num = computed(() => counter.counter)

function onIncrement() {
  counter.increment()
}

function onSubtraction() {
  try {
    counter.subtraction()
  } catch (error) {
    console.log(error)
  }
}
</script>
