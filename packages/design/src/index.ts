import { App } from 'vue';

import { setConfig } from './config';
import { ElMessage, ElMessageBox, PluginOptions } from './type';

export * from './type';
export * from './config';

/* eslint-disable @typescript-eslint/no-unused-vars */
export { default as ElButton } from './Button.vue';
export { default as ElCard } from './Card.vue';
export { default as ElCascader } from './Cascader.vue';
export { default as ElCheckbox } from './Checkbox.vue';
export { default as ElCheckboxGroup } from './CheckboxGroup.vue';
export { default as ElCol } from './Col.vue';
export { default as ElCollapse } from './Collapse.vue';
export { default as ElCollapseItem } from './CollapseItem.vue';
export { default as ElColorPicker } from './ColorPicker.vue';
export { default as ElDatePicker } from './DatePicker.vue';
export { default as ElDialog } from './Dialog.vue';
export { default as ElDivider } from './Divider.vue';
export { default as ElDrawer } from './Drawer.vue';
export { default as ElDropdown } from './Dropdown.vue';
export { default as ElDropdownItem } from './DropdownItem.vue';
export { default as ElDropdownMenu } from './DropdownMenu.vue';
export { default as ElForm } from './Form.vue';
export { default as ElFormItem } from './FormItem.vue';
export { default as ElIcon } from './Icon.vue';
export { default as ElInput } from './Input.vue';
export { default as ElInputNumber } from './InputNumber.vue';
export { default as ElOption } from './Option.vue';
export { default as ElOptionGroup } from './OptionGroup.vue';
export { default as ElPagination } from './Pagination.vue';
export { default as ElPopover } from './Popover.vue';
export { default as ElRadio } from './Radio.vue';
export { default as ElRadioGroup } from './RadioGroup.vue';
export { default as ElRow } from './Row.vue';
export { default as ElScrollbar } from './Scrollbar.vue';
export { default as ElSelect } from './Select.vue';
export { default as ElStep } from './Step.vue';
export { default as ElSteps } from './Steps.vue';
export { default as ElSwitch } from './Switch.vue';
export { default as ElTable } from './Table.vue';
export { default as ElTableColumn } from './TableColumn.vue';
export { default as ElTabPane } from './TabPane.vue';
export { default as ElTabs } from './Tabs.vue';
export { default as ElTag } from './Tag.vue';
export { default as ElTimePicker } from './TimePicker.vue';
export { default as ElTooltip } from './Tooltip.vue';
export { default as ElTree } from './Tree.vue';
export { default as ElUpload } from './Upload.vue';

export const elMessage = {
  error: (msg: string) => {
    console.error(msg);
  },
  success: (msg: string) => {
    console.log(msg);
  },
  warning: (msg: string) => {
    console.warn(msg);
  },
  info: (msg: string) => {
    console.info(msg);
  },
  closeAll: (msg: string) => {},
} as unknown as ElMessage;

export const elMessageBox = {
  alert: (msg: string) => {
    console.log(msg);
  },
  confirm: (msg: string) => {
    console.log(msg);
  },
  close: (msg: string) => {
    console.log(msg);
  },
} as unknown as ElMessageBox;

export default {
  install(app: App, options: PluginOptions) {
    if (options.message) {
      elMessage.error = options.message?.error;
      elMessage.success = options.message?.success;
      elMessage.warning = options.message?.warning;
      elMessage.info = options.message?.info;
      elMessage.closeAll = options.message?.closeAll;
    }

    if (options.messageBox) {
      elMessageBox.alert = options.messageBox?.alert;
      elMessageBox.confirm = options.messageBox?.confirm;
      elMessageBox.prompt = options.messageBox?.prompt;
      elMessageBox.close = options.messageBox?.close;
    }

    app.config.globalProperties.$EDOMS_DESIGN = options;

    setConfig(options);
  },
};
