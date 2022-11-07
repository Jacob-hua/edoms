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

export const calculateMethodProps = (
  fromCpt: Node,
  eventConfig: EventItemConfig,
  eventArgs?: EventArgs
): MethodProps => {
  const { mappings } = eventConfig;
  if (!mappings) {
    return {};
  }

  return mappings.reduce(
    (props, mapping: MappingStruct) => ({ ...props, [mapping.target]: computeTarge(fromCpt, mapping, eventArgs) }),
    {} as MethodProps
  );

  function computeTarge(fromCpt: Node, mapping: MappingStruct, eventArgs?: EventArgs): any {
    const appStore = fromCpt.app.store;
    const pageStore = fromCpt.page?.store ?? {};
    const cptStore = fromCpt.store;

    const mappingClassify = {
      [ValueSpace.APP]: ({ source }: MappingStruct) => source && fromCpt.app.store.get(source),
      [ValueSpace.PAGE]: ({ source }: MappingStruct) => source && fromCpt.page?.store.get(source),
      [ValueSpace.COMPONENT]: ({ source }: MappingStruct) => source && fromCpt.store.get(source),
      [ValueSpace.CONST]: () => mapping.const,
      [ValueSpace.EVENT]: ({ source }: MappingStruct) => source && eventArgs?.[source],
      [ValueSpace.EXPRESSION]: ({ expression, defaultExpression }: MappingStruct) =>
        new Function('app, page, cpt, event', `return ${expression ?? defaultExpression ?? ''}`)(
          appStore,
          pageStore,
          cptStore,
          eventArgs
        ),
      [ValueSpace.TEMPLATE]: ({ template }: MappingStruct) =>
        dots.template(template ?? '')({
          app: appStore,
          page: pageStore,
          cpt: cptStore,
          event: eventArgs,
        }),
    };
    if (!mappingClassify[mapping.sourceSpace] || !mappingClassify[mapping.sourceSpace]) {
      return mapping.defaultValue;
    }
    return mappingClassify[mapping.sourceSpace](mapping);
  }
};
