import page from 'E:/edoms-application-ui/packages/ui/src/page/src/formConfig';
import container from 'E:/edoms-application-ui/packages/ui/src/container/src/formConfig';
import button from 'E:/edoms-application-ui/packages/ui/src/button/src/formConfig';
import text from 'E:/edoms-application-ui/packages/ui/src/text/src/formConfig';
import img from 'E:/edoms-application-ui/packages/ui/src/img/src/formConfig';
import qrcode from 'E:/edoms-application-ui/packages/ui/src/qrcode/src/formConfig';
import overlay from 'E:/edoms-application-ui/packages/ui/src/overlay/src/formConfig';

(function () {
  const configs: Record<string, any> = {
    page: page,
    container: container,
    button: button,
    text: text,
    img: img,
    qrcode: qrcode,
    overlay: overlay,
  };

  window.magicPresetConfigs = configs;
})();
