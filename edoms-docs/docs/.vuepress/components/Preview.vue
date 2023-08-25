<template>
    <div>
        预览: 表单按钮被点击了{{ props.option }}次
    </div>
</template>
<script setup lang="ts">

const props = defineProps<{
    option: number;
}>();
</script>