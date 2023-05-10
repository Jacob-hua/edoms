/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-25 11:03:11
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-09 11:00:12
 */
import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

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
    text: '能效名称',
    name: 'energyName',
    defaultValue: 'COP',
  },
  /** 注入业务组件的共通字段 */
  ...(await useInstanceConfig(request, 'energy-monitoring')),
  {
    text: '最小值',
    name: 'minValue',
  },
  {
    text: '最大值',
    name: 'maxValue',
  },
  {
    type: 'number',
    name: 'bisectionNumber',
    text: '等分数量',
    min: 1,
    max: 12,
    step: 1,
    defaultValue: 11,
  },
  {
    text: '游标',
    type: 'colorPicker',
    name: 'cursorColor',
    defaultValue: '#008000',
  },
  {
    text: '中等',
    name: 'medium',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '最小值',
        name: 'minValue',
      },
      {
        text: '最大值',
        name: 'maxValue',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
        defaultValue: '#E76A2F',
      },
    ],
  },
  {
    text: '良好',
    name: 'good',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '最小值',
        name: 'minValue',
      },
      {
        text: '最大值',
        name: 'maxValue',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
        defaultValue: '#938748',
      },
    ],
  },
  {
    text: '优异',
    name: 'excellent',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    maxItems: 1,
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '最小值',
        name: 'minValue',
      },
      {
        text: '最大值',
        name: 'maxValue',
      },
      {
        text: '颜色',
        name: 'color',
        type: 'colorPicker',
        defaultValue: '#36A763',
      },
    ],
  },
];
