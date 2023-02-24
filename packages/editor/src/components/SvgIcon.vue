<template>
  <i @mouseover="hovered = true" @mouseout="hovered = false">
    <svg viewBox="0 0 1024 1024" aria-hidden="true">
      <use :fill="hovered ? activeColor : color" :xlink:href="icon" />
    </svg>
  </i>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  symbolId: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: '1em',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  activeColor: {
    type: String,
    default: 'currentColor',
  },
});

const hovered = ref(false);

const icon = computed<string>(() => `#${props.prefix}-${props.symbolId}`);
</script>
