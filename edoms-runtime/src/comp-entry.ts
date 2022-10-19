import page from 'E:/edoms-application-ui/packages/ui/src/page/src/index.vue';
import container from 'E:/edoms-application-ui/packages/ui/src/container/src/Container.vue';
import button from 'E:/edoms-application-ui/packages/ui/src/button/src/index.vue';
import text from 'E:/edoms-application-ui/packages/ui/src/text/src/index.vue';
import img from 'E:/edoms-application-ui/packages/ui/src/img/src/index.vue';
import qrcode from 'E:/edoms-application-ui/packages/ui/src/qrcode/src/index.vue';
import overlay from 'E:/edoms-application-ui/packages/ui/src/overlay/src/index.vue';

const components: Record<string, any> = {
  page: page,
  container: container,
  button: button,
  text: text,
  img: img,
  qrcode: qrcode,
  overlay: overlay,
};

const plugins = {};

const entry = {
  components,
  plugins,
};

window.magicPresetComponents = entry;
export default entry;
