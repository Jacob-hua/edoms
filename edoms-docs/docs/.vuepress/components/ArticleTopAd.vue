<template>
    <div>
        <div>
            <button @click="sendMassage">表单</button>
        </div>
        <m-form></m-form>
        <Preview :option="dataVal"></Preview>
    </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import type { MForm } from '@edoms/form';
import Preview from './Preview.vue';
const dataVal = ref<number>(0)
const sendMassage = (() => {
    dataVal.value = dataVal.value + 1;
})

</script>