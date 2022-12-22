import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '轮询间隔',
    name: 'intervalDelay',
    type: 'number',
    min: 1000,
    step: 1000,
    defaultValue: 10000,
  },
  {
    text: '系统曲线',
    name: 'systems',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指标',
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'label',
        text: '标签',
        type: 'text',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'running-parameters')),
      {
        name: 'parameters',
        text: '参数',
        type: 'table',
        items: [
          {
            label: '标签',
            name: 'label',
          },
          {
            label: '名称',
            name: 'name',
          },
          {
            label: '颜色',
            name: 'color',
            type: 'colorPicker',
          },
        ],
      },
    ],
  },
  {
    text: '设备曲线',
    name: 'equipments',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指标',
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'label',
        text: '标签',
        type: 'text',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'running-parameters')),
      {
        name: 'parameters',
        text: '参数',
        type: 'table',
        items: [
          {
            label: '标签',
            name: 'label',
          },
          {
            label: '名称',
            name: 'name',
          },
          {
            label: '颜色',
            name: 'color',
            type: 'colorPicker',
          },
        ],
      },
    ],
  },
];
