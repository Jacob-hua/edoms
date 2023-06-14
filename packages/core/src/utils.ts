import dots from 'dot';

import { EventArgs, EventItemConfig, MappingStruct, MethodProps, ValueSpace } from '@edoms/schema';

import Node from './Node';

export const style2Obj = (style: string) => {
  if (typeof style !== 'string') {
    return style;
  }

  const obj: Record<string, any> = {};
  style.split(';').forEach((element) => {
    if (!element) {
      return;
    }

    const items = element.split(':');

    let key = items.shift();
    let value = items.join(':');

    if (!key) return;

    key = key.replace(/^\s*/, '').replace(/\s*$/, '');
    value = value.replace(/^\s*/, '').replace(/\s*$/, '');

    key = key
      .split('-')
      .map((v, i) => (i > 0 ? `${v[0].toUpperCase()}${v.substr(1)}` : v))
      .join('');

    obj[key] = value;
  });
  return obj;
};

export const fillBackgroundImage = (value: string) => {
  if (value && !/^url/.test(value) && !/^linear-gradient/.test(value)) {
    return `url(${value})`;
  }
  return value;
};

export const isNumber = (value: string) => /^(-?\d+)(\.\d+)?$/.test(value);

export interface CalculateMethodPropsArgs {
  fromCpt: Node;
  eventConfig: EventItemConfig;
  toCpt?: Node;
  eventArgs?: EventArgs;
}

export const calculateMethodProps = ({
  fromCpt,
  eventConfig,
  toCpt,
  eventArgs,
}: CalculateMethodPropsArgs): MethodProps => {
  const { mappings } = eventConfig;
  if (!mappings) {
    return {};
  }

  return mappings.reduce(
    (props, mapping: MappingStruct) => ({
      ...props,
      [mapping.target]: computeTarge(mapping, eventArgs),
    }),
    {} as MethodProps
  );

  function computeTarge(mapping: MappingStruct, eventArgs?: EventArgs): any {
    const from = fromCpt.instance ?? {};
    const to = toCpt?.instance ?? {};

    const mappingClassify = {
      [ValueSpace.CONST]: () => mapping.const,
      [ValueSpace.EVENT]: ({ source }: MappingStruct) => source && eventArgs?.[source],
      [ValueSpace.EXPRESSION]: ({ expression }: MappingStruct) =>
        new Function('from, to, event', `return ${expression ?? ''}`)(from, to, eventArgs),
      [ValueSpace.TEMPLATE]: ({ template }: MappingStruct) =>
        dots.template(template ?? '')({
          from,
          to,
          event: eventArgs,
        }),
    };
    if (mapping.ignore || !mappingClassify[mapping.sourceSpace] || !mappingClassify[mapping.sourceSpace]) {
      return mapping.defaultValue;
    }
    return mappingClassify[mapping.sourceSpace](mapping);
  }
};
