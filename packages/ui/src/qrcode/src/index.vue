<template>
  <img class="edoms-ui-qrcode" :src="imgUrl" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import QRCode from 'qrcode';

import { MQrcode } from '../../types';
import useApp from '../../useApp';

const props = defineProps<{
  config: MQrcode;
}>();

useApp(props);

const imgUrl = ref();

watch(
  () => props.config.url,
  (url = '') => {
    QRCode.toDataURL(url, (e: any, url: string) => {
      if (e) console.error(e);
      imgUrl.value = url;
    });
  },
  {
    immediate: true,
  }
);
</script>
