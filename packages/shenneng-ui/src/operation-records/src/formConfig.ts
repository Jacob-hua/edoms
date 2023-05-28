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
    ...(await useInstanceConfig(request, 'warning-table-list', ['property', 'propertyType', 'unit', 'precision'])),
  ];
};
