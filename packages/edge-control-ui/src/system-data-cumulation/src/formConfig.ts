import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

const calculateTypes = [
  {
    text: '无',
    value: 'NONE',
  },
  {
    text: '环比',
    value: 'QOQ',
  },
  {
    text: '同比',
    value: 'YOY',
  },
  {
    text: '全部',
    value: 'ALL',
  },
];

export default async (request: Request) => {
  // const useInstance = await useInstanceConfig(request, 'system-cumulative-data');
  return [
    {
      text: '标题',
      name: 'title',
      type: 'string',
      defaultValue: '系统累计数据',
    },
    {
      text: '子标题',
      name: 'subTitle',
      type: 'string',
      defaultValue: 'System cumulative data',
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
      text: '类别',
      name: 'category',
      type: 'groupList',
      labelWidth: '80px',
      addButtonText: '添加类别',
      maxItems: 10,
      title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
      items: [
        {
          text: '类名',
          name: 'label',
          type: 'text',
          trim: true,
        },
        ...(await useInstanceConfig(request, 'system-data-cumulation')),
        {
          name: 'ratioPrecision',
          text: '比率精度',
          type: 'select',
          options: [
            {
              text: '原始精度',
              value: '',
            },
            {
              text: '0',
              value: '0',
            },
            {
              text: '0.1',
              value: '0.1',
            },
            {
              text: '0.01',
              value: '0.01',
            },
            {
              text: '0.001',
              value: '0.001',
            },
            {
              text: '0.0001',
              value: '0.0001',
            },
            {
              text: '0.00001',
              value: '0.00001',
            },
            {
              text: '0.000001',
              value: '0.000001',
            },
            {
              text: '0.0000001',
              value: '0.0000001',
            },
            {
              text: '0.00000001',
              value: '0.00000001',
            },
          ],
        },
        {
          text: '计算方式',
          name: 'calculateType',
          type: 'select',
          options: calculateTypes,
        },
      ],
    },
  ];
};
