import page from 'E:/edoms-application-ui/packages/ui/src/page/src/event';
import button from 'E:/edoms-application-ui/packages/ui/src/button/src/event';
import overlay from 'E:/edoms-application-ui/packages/ui/src/overlay/src/event';

(function () {
  const events: Record<string, any> = {
    page: page,
    button: button,
    overlay: overlay,
  };

  window.magicPresetEvents = events;
})();
