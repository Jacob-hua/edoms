import Button from './button';
import Checkbox from './checkbox';
import Container from './container';
import DynamicMonitoring from './dynamic-monitoring';
import EnergyEfficiencyMonitoring from './energy-efficiency-monitoring';
import GlobalSchematic from './global-schematic';
import Img from './img';
import IndicatorLight from './indicator-light';
import Overlay from './overlay';
import Page from './page';
import Qrcode from './qrcode';
import RunningParameters from './running-parameters';
import SettingParameter from './setting-parameter';
import SystemOperatingParameters from './system-operating-parameters';
import Text from './text';
import TimeWeather from './time-weather';
import Video from './video';
import WarningRunningList from './warning-running-list';

const ui: Record<string, any> = {
  page: Page,
  container: Container,
  button: Button,
  text: Text,
  img: Img,
  qrcode: Qrcode,
  checkbox: Checkbox,
  overlay: Overlay,
  dynamicMonitoring: DynamicMonitoring,
  settingParameter: SettingParameter,
  systemOperatingParameters: SystemOperatingParameters,
  globalSchematic: GlobalSchematic,
  indicatorLight: IndicatorLight,
  warningRunningList: WarningRunningList,
  runningParameters: RunningParameters,
  energyEfficiencyMonitoring: EnergyEfficiencyMonitoring,
  timeWeather: TimeWeather,
  video: Video,
};

export default ui;
