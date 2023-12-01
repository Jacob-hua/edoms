/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-06-13 11:25:36
 */
// import { Request } from '@edoms/editor';

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
    text: '实例',
    name: 'classify',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加实例',
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '标签',
        name: 'label',
      },
      {
        text: '实例属性',
        name: 'codes',
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'intelligence-report-pv')),
    ],
  },
];
