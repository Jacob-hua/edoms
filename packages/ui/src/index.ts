import Button from './button';
import Container from './container';
import DynamicMonitoring from './dynamic-monitoring';
import Img from './img';
import Overlay from './overlay';
import Page from './page';
import Qrcode from './qrcode';
import SettingParameter from './setting-parameter';
import Text from './text';

const ui: Record<string, any> = {
  page: Page,
  container: Container,
  button: Button,
  text: Text,
  img: Img,
  qrcode: Qrcode,
  overlay: Overlay,
  dynamicMonitoring: DynamicMonitoring,
  settingParameter: SettingParameter,
};

export default ui;
