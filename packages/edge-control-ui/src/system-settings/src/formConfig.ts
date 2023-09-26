import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
  {
    text: '标题',
    name: 'title',
    type: 'string',
  },
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
        type: 'text',
      },
      ...(await useInstanceConfig(request, 'equipment-condition')),
    ],
  },
];
