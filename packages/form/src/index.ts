import { App } from 'vue';

import Container from './containers/Container.vue';
import Fieldset from './containers/Fieldset.vue';
import GroupList from './containers/GroupList.vue';
import Panel from './containers/Panel.vue';
import Row from './containers/Row.vue';
import MStep from './containers/Step.vue';
import Table from './containers/Table.vue';
import Tabs from './containers/Tabs.vue';
import Cascader from './fields/Cascader.vue';
import Checkbox from './fields/Checkbox.vue';
import CheckboxGroup from './fields/CheckboxGroup.vue';
import ColorPicker from './fields/ColorPicker.vue';
import Date from './fields/Date.vue';
import Daterange from './fields/Daterange.vue';
import DateTime from './fields/DateTime.vue';
import Display from './fields/Display.vue';
import DynamicField from './fields/DynamicField.vue';
import Hidden from './fields/Hidden.vue';
import Link from './fields/Link.vue';
import Number from './fields/Number.vue';
import RadioGroup from './fields/RadioGroup.vue';
import Select from './fields/Select.vue';
import Switch from './fields/Switch.vue';
import Text from './fields/Text.vue';
import Textarea from './fields/Textarea.vue';
import Time from './fields/Time.vue';
import { setConfig } from './utils/config';
import Form from './Form.vue';
import FormDialog from './FormDialog.vue';

import './theme/index.scss';

export * from './schema';
export * from './utils/form';
export * from './utils/useAddField';

export { default as MForm } from './Form.vue';
export { default as MFormDialog } from './FormDialog.vue';
export { default as MContainer } from './containers/Container.vue';
export { default as MFieldset } from './containers/Fieldset.vue';
export { default as MPanel } from './containers/Panel.vue';
export { default as MRow } from './containers/Row.vue';
export { default as MTabs } from './containers/Tabs.vue';
export { default as MTable } from './containers/Table.vue';
export { default as MGroupList } from './containers/GroupList.vue';
export { default as MText } from './fields/Text.vue';
export { default as MNumber } from './fields/Number.vue';
export { default as MTextarea } from './fields/Textarea.vue';
export { default as MHidden } from './fields/Hidden.vue';
export { default as MDate } from './fields/Date.vue';
export { default as MDateTime } from './fields/DateTime.vue';
export { default as MTime } from './fields/Time.vue';
export { default as MCheckbox } from './fields/Checkbox.vue';
export { default as MSwitch } from './fields/Switch.vue';
export { default as MDaterange } from './fields/Daterange.vue';
export { default as MColorPicker } from './fields/ColorPicker.vue';
export { default as MCheckboxGroup } from './fields/CheckboxGroup.vue';
export { default as MRadioGroup } from './fields/RadioGroup.vue';
export { default as MDisplay } from './fields/Display.vue';
export { default as MLink } from './fields/Link.vue';
export { default as MSelect } from './fields/Select.vue';
export { default as MCascader } from './fields/Cascader.vue';
export { default as MDynamicField } from './fields/DynamicField.vue';

const defaultInstallOpt = {};

const install = (app: App, opt: any) => {
  const option = Object.assign(defaultInstallOpt, opt);

  // eslint-disable-next-line no-param-reassign
  app.config.globalProperties.$EDOMS_FORM = option;
  setConfig(option);

  app.component('MForm', Form);
  app.component('MFormDialog', FormDialog);
  app.component('MFormContainer', Container);
  app.component('MFormFieldset', Fieldset);
  app.component('MFormGroupList', GroupList);
  app.component('MFormPanel', Panel);
  app.component('MFormRow', Row);
  app.component('MFormStep', MStep);
  app.component('MFormTable', Table);
  app.component('MFormTab', Tabs);
  app.component('MFieldsText', Text);
  app.component('MFieldsNumber', Number);
  app.component('MFieldsTextarea', Textarea);
  app.component('MFieldsHidden', Hidden);
  app.component('MFieldsDate', Date);
  app.component('MFieldsDatetime', DateTime);
  app.component('MFieldsDaterange', Daterange);
  app.component('MFieldsTime', Time);
  app.component('MFieldsCheckbox', Checkbox);
  app.component('MFieldsSwitch', Switch);
  app.component('MFieldsColorPicker', ColorPicker);
  app.component('MFieldsCheckboxGroup', CheckboxGroup);
  app.component('MFieldsRadioGroup', RadioGroup);
  app.component('MFieldsDisplay', Display);
  app.component('MFieldsLink', Link);
  app.component('MFieldsSelect', Select);
  app.component('MFieldsCascader', Cascader);
  app.component('MFieldsDynamicField', DynamicField);
};

export default {
  install,
};