import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

import { MEconomicIndicator } from './type';
const indicatorTypes = [
  {
    text: '用电量',
    value: MEconomicIndicator.ELECTRIC,
  },
  {
    text: '制冷量',
    value: MEconomicIndicator.REFRIGERATION_CAPACITY,
  },
  {
    text: '电费',
    value: MEconomicIndicator.ELECTRICITY_CONSUMPTION,
  },
  {
    text: '制冷成本',
    value: MEconomicIndicator.COLD_COST,
  },
];

// const indicatorTypes = [
//   {
//     text: '用电量',
//     value: MEconomicIndicator.ELECTRICITY_CONSUMPTION,
//   },
//   {
//     text: '用水量',
//     value: MEconomicIndicator.WATER_CONSUMPTION,
//   },
//   {
//     text: '电费',
//     value: MEconomicIndicator.ELECTRIC,
//   },
//   {
//     text: '成本',
//     value: MEconomicIndicator.COST,
//   },
//   {
//     text: '制冷量',
//     value: MEconomicIndicator.COOL_ENERGY_CONSUMPTION,
//   },
//   {
//     text: '能耗',
//     value: MEconomicIndicator.HEAT_ENERGY_CONSUMPTION,
//   },
//   {
//     text: '温度',
//     value: MEconomicIndicator.TEMPERATURE,
//   },
//   {
//     text: '湿度',
//     value: MEconomicIndicator.HUMIDITY,
//   },
//   {
//     text: '辐照量',
//     value: MEconomicIndicator.EXPOSURE,
//   },
//   {
//     text: '累计充电量',
//     value: MEconomicIndicator.Accumulated_Charging_apacity,
//   },
//   {
//     text: '日充电量',
//     value: MEconomicIndicator.Daily_Charging_apacity,
//   },
//   {
//     text: '日充电次数',
//     value: MEconomicIndicator.Daily_Charging_Times,
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
    text: '监测指标',
    name: 'indicators',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指标',
    maxItems: 2,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        name: 'type',
        text: '图标',
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
        name: 'code',
        text: '监测标识',
        type: 'text',
        trim: true,
      },
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'economic-indicators')),
    ],
  },
];
