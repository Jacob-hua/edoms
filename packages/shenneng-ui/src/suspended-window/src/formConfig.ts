/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-04 10:29:53
 */
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
    text: '监测指标',
    name: 'indicators',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指标',
    maxItems: 10,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'label',
        text: '标签',
        type: 'text',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'suspended-window')),
    ],
  },
];
