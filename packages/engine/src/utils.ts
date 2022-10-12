import { EdAction, EdActionProp, EdActionPropType } from '@edoms/meta-model';

export const isCommResponse = (responseName: string): boolean => responseName.startsWith('edom-common:');

const EDOMS_ACTION_PREFIX = 'edoms:action:';

export const generateEventName = (actionName: string, comId: string): string => {
  const result = `${actionName}:${comId}`;
  if (result.startsWith(EDOMS_ACTION_PREFIX)) {
    return result;
  }
  return `${EDOMS_ACTION_PREFIX}:${result}`;
};

export const generateEffectProps = (action: EdAction): Record<string, any> => {
  if (!action.props) {
    return {};
  }
  // TODO: 此处需要考虑参数值来自其他作用域的情况，例如：来自action的args，来自context等
  return action.props.reduce((propObj, { argument, type, source }: EdActionProp) => {
    const result = { ...propObj };
    if (type === EdActionPropType.CONST) {
      result[argument] = source;
    } else {
      result[argument] = undefined;
    }
    return result;
  }, {} as Record<string, any>);
};
