import page from 'E:/edoms-application-ui/packages/ui/src/page/src/initValue';
import container from 'E:/edoms-application-ui/packages/ui/src/container/src/initValue';
import button from 'E:/edoms-application-ui/packages/ui/src/button/src/initValue';
import text from 'E:/edoms-application-ui/packages/ui/src/text/src/initValue';
import img from 'E:/edoms-application-ui/packages/ui/src/img/src/initValue';
import qrcode from 'E:/edoms-application-ui/packages/ui/src/qrcode/src/initValue';
import overlay from 'E:/edoms-application-ui/packages/ui/src/overlay/src/initValue';

(function () {
  const values: Record<string, any> = {
    page: page,
    container: container,
    button: button,
    text: text,
    img: img,
    qrcode: qrcode,
    overlay: overlay,
  };

  window.magicPresetValues = values;
})();
