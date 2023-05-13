/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-24 11:45:45
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-12 13:59:51
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
    defaultValue: 30,
    append: 's',
  },
  {
    text: '系统曲线',
    name: 'systems',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '标签',
        name: 'label',
      },
      {
        name: 'indicators',
        text: '指标',
        type: 'groupList',
        labelWidth: '50px',
        addButtonText: '添加指标',
        movable: false,
        maxItems: 10,
        title: (model: any, index: number | string) => `参数 ${index} ${model.label ?? ''}`,
        items: [
          {
            name: 'label',
            text: '标签',
            type: 'text',
            trim: true,
          },
          /** 注入业务组件的共通字段 */
          ...(await useInstanceConfig(request, 'operational-analysis')),
          {
            text: '曲线颜色',
            name: 'color',
            type: 'colorPicker',
            defaultValue: '#287CE8',
          },
        ],
      },
    ],
  },
  {
    text: '设备曲线',
    name: 'equipments',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加类别',
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '标签',
        name: 'label',
      },
      {
        name: 'indicators',
        text: '指标',
        type: 'groupList',
        labelWidth: '50px',
        addButtonText: '添加指标',
        movable: false,
        maxItems: 10,
        title: (model: any, index: number | string) => `参数 ${index} ${model.label ?? ''}`,
        items: [
          {
            name: 'label',
            text: '标签',
            type: 'text',
            trim: true,
          },
          /** 注入业务组件的共通字段 */
          ...(await useInstanceConfig(request, 'operational-analysis')),
          {
            text: '曲线颜色',
            name: 'color',
            type: 'colorPicker',
            defaultValue: '#287CE8',
          },
        ],
      },
    ],
  },
];
