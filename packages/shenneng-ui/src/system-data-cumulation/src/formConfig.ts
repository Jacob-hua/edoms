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
    ...(await useInstanceConfig(request, 'system-cumulative-data', ['unit'])),
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
    {
      text: '查询条件',
      name: 'specificDate',
      type: 'checkbox-group',
      options: [
        {
          text: '日',
          value: 'd',
        },
        {
          text: '月',
          value: 'm',
        },
        {
          text: '年',
          value: 'y',
        },
      ],
    },
    {
      text: 'JSON规则',
      name: 'jsonRule',
      type: 'textarea',
    },
  ];
};
