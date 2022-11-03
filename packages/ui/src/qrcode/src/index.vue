<template>
  <img class="edoms-ui-qrcode" :src="imgUrl" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import QRCode from 'qrcode';

import { MQrcode } from '../../types';
import useApp from '../../useApp';

interface SetQrcodeProps {
  url: string;
}

const props = defineProps<{
  config: MQrcode;
}>();

const { provideMethod } = useApp(props);

const imgUrl = ref(props.config.url);

const setQrcode = provideMethod(
  'setQrcode',
  ({ url = '' }: SetQrcodeProps) => {
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
