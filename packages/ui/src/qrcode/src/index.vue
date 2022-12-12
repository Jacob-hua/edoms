<template>
  <img class="edoms-ui-qrcode" :src="imgUrl" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import QRCode from 'qrcode';

import useApp from '../../useApp';

import { MQrcode } from './type';

const props = defineProps<{
  config: MQrcode;
}>();

const { provideMethod } = useApp(props);

const imgUrl = ref(props.config.url);

const setQrcode = provideMethod(
  'setQrcode',
  ({ url = '' }) => {
    QRCode.toDataURL(url, (e: any, url: string) => {
      if (e) console.error(e);
      imgUrl.value = url;
    });
  },
  ['url']
);

watch(
  () => props.config.url,
  (url = '') => setQrcode({ url }),
  {
    immediate: true,
  }
);
</script>
