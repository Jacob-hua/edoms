import { InstallOptions } from '../type';

let $EDOMS_EDITOR: InstallOptions = {} as any;

const setConfig = (option: InstallOptions): void => {
  $EDOMS_EDITOR = option;
};

const getConfig = (key: keyof InstallOptions): unknown => $EDOMS_EDITOR[key];

export { getConfig, setConfig };
