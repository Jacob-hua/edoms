import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

import { MEnvironmentIndicator } from './type';

const indicatorTypes = [
  {
    text: '温度',
    value: MEnvironmentIndicator.TEMPERATURE,
  },
  {
    text: '湿度',
    value: MEnvironmentIndicator.MOISTURE,
  },
  {
    text: '液体深度',
    value: MEnvironmentIndicator.LIQUID_DEPTH,
  },
  {
    text: '气体',
    value: MEnvironmentIndicator.GAS,
  },
];

export default async (request: Request) => [
  {
    text: '轮询间隔',
    name: 'intervalDelay',
    type: 'number',
    min: 1000,
    step: 1000,
    defaultValue: 10000,
    append: 'ms',
  },
  {
    text: '展示个数',
    name: 'visibleNumber',
    type: 'number',
    min: 0,
    max: 10,
  },
  {
    text: '监测指标',
    name: 'indicators',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加指标',
    maxItems: 10,
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
      /** 注入业务组件的共通字段 */
      ...(await useInstanceConfig(request, 'dynamic-monitoring')),
      {
        name: 'lineColor',
        type: 'colorPicker',
        text: '曲线颜色',
        defaultValue: '#008000',
      },
      {
        name: 'thresholdConfigs',
        text: '阈值设置',
        type: 'table',
        enableFullscreen: false,
        fixed: false,
        items: [
          {
            label: '最小值',
            name: 'minValue',
            text: '最小值',
            type: 'number',
          },
          {
            label: '最大值',
            name: 'maxValue',
            text: '最大值',
            type: 'number',
          },
          {
            label: '告警等级',
            name: 'alarmLevel',
            text: '告警等级',
            type: 'text',
          },
          {
            label: '告警颜色',
            name: 'alarmColor',
            text: '告警颜色',
            type: 'colorPicker',
            defaultValue: '#00ff00',
          },
        ],
      },
    ],
  },
];
