import Button from './button';
import Container from './container';
import DynamicMonitoring from './dynamic-monitoring';
import Img from './img';
import Overlay from './overlay';
import Page from './page';
import Qrcode from './qrcode';
import SettingParameter from './setting-parameter';
import SystemOperatingParameters from './system-operating-parameters';
import Text from './text';
import WarningRunningList from './warning-running-list';
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
  systemOperatingParameters: SystemOperatingParameters,
  warningRunningList: WarningRunningList,
};

export default ui;
