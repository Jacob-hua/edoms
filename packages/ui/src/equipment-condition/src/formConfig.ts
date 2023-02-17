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
    append: 'ms',
  },
  {
    text: '设备工况',
    name: 'conditions',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加设备',
    title: (model: any, index: number | string) => `# ${index} ${model.group ?? ''}`,
    items: [
      {
        name: 'label',
        text: '设备',
        type: 'string',
      },
      {
        name: 'group',
        text: '归属组',
        type: 'string',
      },
      {
        name: 'lineColor',
        text: '曲线颜色',
        type: 'color',
      },
      {
        name: 'color',
        text: '数值颜色',
        type: 'color',
      },
      {
        text: '参数',
        name: 'indicators',
        type: 'groupList',
        labelWidth: '50px',
        addButtonText: '添加参数',
        title: (model: any, index: number | string) => `# ${index}`,
        items: [
          {
            name: 'label',
            text: '标签',
            type: 'string',
          },
          ...(await useInstanceConfig(request, 'equipment-condition')),
        ],
      },
    ],
  },
];
