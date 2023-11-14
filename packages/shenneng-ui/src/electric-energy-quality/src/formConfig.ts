import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '标题',
    name: 'title',
    type: 'string',
  },
  /** 注入业务组件的共通字段 */
  // ...(await useInstanceConfig(request, 'electric-energy-quality')),
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
    labelWidth: '85px',
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
    text: 'LA',
    name: 'currentLa',
    type: 'colorPicker',
    labelWidth: '85px',
  },
  {
    text: 'LB',
    name: 'currentLb',
    type: 'colorPicker',
    labelWidth: '85px',
  },
  {
    text: 'LC',
    name: 'currentLc',
    type: 'colorPicker',
    labelWidth: '85px',
  },
  {
    text: '负载率',
    name: 'loadRate',
    type: 'colorPicker',
    labelWidth: '85px',
  },
  {
    text: '三相不平衡率',
    name: 'threePhasRate',
    type: 'colorPicker',
    labelWidth: '85px',
  },
  {
    text: '考核基准',
    name: 'examine',
    type: 'number',
    labelWidth: '85px',
  },
  {
    text: '电压分析',
    name: 'voltageAnalysis',
    type: 'groupList',
    labelWidth: '85px',
    addButtonText: '选择实例',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '标签',
        name: 'label',
      },
      ...(await useInstanceConfig(request, 'electric-energy-quality', ['unit'])),
    ],
  },
];
