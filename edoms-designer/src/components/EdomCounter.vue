<template>
  <div>
    dddd1111
    <el-button type="primary" @click="onIncrement">+</el-button>
    <span>{{ num }}</span>
    <el-button type="primary" @click="onSubtraction">---</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useCounterStore } from '@/store/counter'
import { computed } from 'vue'

const counter = useCounterStore()

const num = computed(() => counter.counter)

function onIncrement() {
  counter.increment()
}

function onSubtraction() {
  counter.subtraction()
}
</script>
