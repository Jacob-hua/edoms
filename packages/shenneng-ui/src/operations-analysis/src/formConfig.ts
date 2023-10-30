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
  ...(await useInstanceConfig(request, 'operations-analysis', ['unit'])),
  {
    text: '费价规则',
    name: 'feeRule',
    type: 'textarea',
  },
];
