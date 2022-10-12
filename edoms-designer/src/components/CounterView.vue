<template>
  <div>计数器</div>
  <div>
    <el-button test-increment type="primary" @click="increment">加+</el-button>
    <span>{{ count }}</span>
    <el-button test-subtraction type="primary" @click="subtraction">减-</el-button>
  </div>
</template>

<script lang="ts" setup name="CounterView">
import { useCounterStore } from '../store/counter';
import { computed } from 'vue';

const counterStore = useCounterStore();

const count = computed(() => counterStore.counter);

const increment = () => {
  counterStore.increment();
};

const subtraction = () => {
  counterStore.subtraction();
};
</script>
