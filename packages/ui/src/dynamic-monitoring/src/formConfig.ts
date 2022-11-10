import { Request } from '@edoms/editor';

const indicatorTypes = [
  {
    text: '温度',
    value: 'temperature',
  },
  {
    text: '湿度',
    value: 'moisture',
  },
  {
    text: '液体深度',
    value: 'liquidDepth',
  },
  {
    text: '气体',
    value: 'gas',
  },
];

export default async (request?: Request) => {
  let instances = [];
  if (request) {
    const { instanceOptions } = await request('dynamic-monitoring');
    instances = instanceOptions;
  }

  return [
    {
      text: '展示指标数',
      name: 'visibleNumber',
      type: 'number',
      min: 0,
    },
    {
      text: '监测指标',
      name: 'indicators',
      type: 'groupList',
      labelWidth: '80px',
      addButtonText: '添加指标',
      title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
      items: [
        {
          name: 'type',
          text: '指标',
          type: 'select',
          options: indicatorTypes,
        },
        {
          name: 'label',
          text: '标签',
          type: 'text',
          trim: true,
        },
        {
          name: 'instance',
          text: '实例',
          type: 'cascader',
          options: instances,
        },
        {
          name: 'property',
          text: '属性',
          type: 'select',
          options: () => {
            return [];
          },
        },
        {
          name: 'expectedMax',
          text: '预期最大值',
          type: 'number',
        },
        {
          name: 'expectedMin',
          text: '预期最小值',
          type: 'number',
        },
        {
          name: 'targetMax',
          text: '目标最大值',
          type: 'number',
        },
        {
          name: 'targetMin',
          text: '目标最小值',
          type: 'number',
        },
      ],
    },
  ];
};