import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '轮询间隔',
    name: 'intervalDelay',
    type: 'number',
    min: 1,
    step: 1,
    defaultValue: 10,
    append: 's',
  },
  {
    name: 'label',
    text: '标签',
    type: 'text',
    trim: true,
  },
  {
    name: 'indicators',
    text: '指标',
    type: 'groupList',
    labelWidth: '50px',
    addButtonText: '添加指标',
    movable: false,
    maxItems: 3,
    title: (model: any, index: number | string) => `参数 ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'label',
        text: '标签',
        type: 'text',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'global-schematic-chart')),
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
      },
    ],
  },
];
