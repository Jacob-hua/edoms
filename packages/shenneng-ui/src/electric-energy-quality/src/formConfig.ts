import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  /** 注入业务组件的共通字段 */
  ...(await useInstanceConfig(request, 'operational-analysis')),
  {
    text: '最小值',
    name: 'minValue',
    defaultValue: '',
  },
  {
    text: '最大值',
    name: 'maxValue',
    defaultValue: '',
  },
  {
    type: 'number',
    name: 'bisectionNumber',
    text: '等分数量',
    min: 1,
    max: 10,
    step: 1,
    defaultValue: 5,
  },
  {
    text: '游标',
    type: 'colorPicker',
    name: 'cursorColor',
    defaultValue: '#008000',
  },
  {
    text: '优异',
    name: 'excellent',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '最小值',
        name: 'minValue',
        defaultValue: '',
      },
      {
        text: '最大值',
        name: 'maxValue',
        defaultValue: '',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
      },
    ],
  },
  {
    text: '良好',
    name: 'good',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '最小值',
        name: 'minValue',
        defaultValue: '',
      },
      {
        text: '最大值',
        name: 'maxValue',
        defaultValue: '',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
      },
    ],
  },
  {
    text: '中等',
    name: 'medium',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '最小值',
        name: 'minValue',
        defaultValue: '',
      },
      {
        text: '最大值',
        name: 'maxValue',
        defaultValue: '',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
      },
    ],
  },
];
