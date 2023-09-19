import { Request } from '@editor/type';

import useInstanceConfig from '../../useInstanceConfig';
export default async (request: Request) => {
  return [
    {
      text: '标题',
      name: 'title',
      type: 'string',
      defaultValue: '告警管理',
    },
    {
      text: '子标题',
      name: 'subTitle',
      type: 'string',
      defaultValue: 'Abnormal alarm',
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
      type: 'switch',
      name: 'isVirtual',
      text: '虚拟数据',
      activeValue: '1',
      inactiveValue: '0',
      defaultValue: '1',
    },
    ...(await useInstanceConfig(request, 'warning-table-list', ['property', 'propertyType', 'unit', 'precision'])),
    {
      text: '时间范围',
      name: 'timeSpan',
      type: 'number',
      min: 0.5,
      step: 0.5,
      defaultValue: 1,
      append: '小时',
    },
  ];
};
