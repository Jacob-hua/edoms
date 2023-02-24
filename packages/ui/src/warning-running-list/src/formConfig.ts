import { Request } from '@editor/type';
export default async (request: Request) => {
  const instances =
    (await request({
      resourceId: `warning-running-list:instance`,
    })) ?? [];
  return [
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
    {
      name: 'instance',
      text: '实例',
      type: 'cascader',
      filterable: true,
      checkStrictly: true,
      options: instances,
    },
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
