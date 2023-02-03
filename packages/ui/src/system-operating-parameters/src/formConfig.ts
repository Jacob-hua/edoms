import { Request } from '@editor/type';

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
    text: '展示参数',
    name: 'visibleNumber',
    type: 'number',
    min: 0,
    max: 4,
  },
  {
    type: 'groupList',
    text: '设置参数',
    name: 'parameters',
    labelWidth: '80px',
    defaultValue: [],
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'name',
        text: '参数名称',
        type: 'text',
        placeholder: '请填写参数名称',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'system-operation-parameters')),
    ],
  },
];
