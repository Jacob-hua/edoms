export default async () => {
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
  ];
};
