import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

// import { MEconomicIndicator } from './type';

// const indicatorTypes = [
//   {
//     text: '用电量',
//     value: MEconomicIndicator.AIRHEAT,
//   },
//   {
//     text: '用水量',
//     value: MEconomicIndicator.AIRCONDITIONING,
//   },
// ];

export default async (request: Request) => [
  {
    text: '标题',
    name: 'title',
    type: 'string',
  },
  {
    text: '子标题',
    name: 'subTitle',
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
    name: 'indicators',
    text: '指标',
    type: 'groupList',
    labelWidth: '50px',
    addButtonText: '添加指标',
    movable: false,
    maxItems: 2,
    title: (model: any, index: number | string) => `参数 ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'label',
        text: '标签',
        type: 'text',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'cost-comparison-detail')),
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
      },
    ],
  },
];
