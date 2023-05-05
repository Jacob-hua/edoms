import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  /** 注入业务组件的共通字段 */
  ...(await useInstanceConfig(request, 'electric-energy-quality')),
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
    text: '占比分布',
    name: 'proportion',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 4,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '标签',
        name: 'label',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
      },
    ],
  },
  {
    text: '电流',
    name: 'current',
    type: 'groupList',
    maxItems: 3,
    items: [
      {
        text: '标签',
        name: 'label',
      },
      {
        text: '曲线颜色',
        name: 'color',
        type: 'colorPicker',
      },
    ],
  },
  {
    text: '负载率',
    name: 'load',
    type: 'groupList',
    maxItems: 2,
    items: [
      {
        text: '标签',
        name: 'label',
      },
      {
        text: '曲线颜色',
        name: 'color',
        type: 'colorPicker',
      },
    ],
  },
];
