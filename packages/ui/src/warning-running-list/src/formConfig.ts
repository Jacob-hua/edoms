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
      min: 1000,
      step: 1000,
      defaultValue: 5000,
    },
    {
      text: '滚屏速度',
      name: 'speed',
      type: 'number',
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 12,
    },
    {
      type: 'switch',
      name: 'isScroll',
      text: '是否滚屏',
      activeValue: true,
      inactiveValue: false,
      defaultValue: true,
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
      min: 1,
      step: 1,
      defaultValue: 1,
    },
  ];
};
