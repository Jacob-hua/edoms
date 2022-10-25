let $EDOMS_FORM = {} as any;

const setConfig = (option: any): void => {
  $EDOMS_FORM = option;
};

const getConfig = (key: string): unknown => $EDOMS_FORM[key];

export { getConfig, setConfig };
