import defaultAdapter from './defaultAdapter';
import { PluginOptions } from './type';

let $EDOMS_DESIGN: PluginOptions = {};

const setConfig = (options: PluginOptions): void => {
  $EDOMS_DESIGN = options;
};

const getConfig = (key: string): any => $EDOMS_DESIGN[key] || (defaultAdapter as any)[key];

export { getConfig, setConfig };
