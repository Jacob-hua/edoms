/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-04 13:50:41
 */
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
  /** 注入业务组件的共通字段 */
  ...(await useInstanceConfig(request, 'intelligence-report-heat')),
  {
    text: '建筑',
    name: 'buildings',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加建筑',
    maxItems: 10,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '名称',
        name: 'label',
        defaultValue: '',
      },
      ...(await useInstanceConfig(request, 'intelligence-report-heat')),
    ],
  },
];
