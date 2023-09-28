/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-24 11:45:45
 * @LastEditors: lihao
 * @LastEditTime: 2023-06-08 17:41:21
 */
import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

import { MLineType } from './type';

const lineTypes = [
  {
    text: '曲线',
    value: MLineType.LINE,
  },
  {
    text: '柱状图',
    value: MLineType.BAR,
  },
];

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
    text: '一级分类',
    name: 'classify',
    type: 'groupList',
    labelWidth: '70px',
    addButtonText: '添加分类',
    title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
    items: [
      {
        text: '标签',
        name: 'label',
      },
      {
        text: '二级分类',
        name: 'tabName',
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
            text: '曲线类型',
            name: 'lineType',
            type: 'select',
            options: lineTypes,
            defaultValue: MLineType.LINE,
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
                labelWidth: '70px',
              },
            ],
          },
          {
            name: 'point',
            text: '点位',
            type: 'groupList',
            labelWidth: '50px',
            addButtonText: '添加点位',
            movable: false,
            maxItems: 10,
            title: (model: any, index: number | string) => `参数 ${index} ${model.label ?? ''}`,
            items:[
              {
                text: '点位',
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
                    labelWidth: '70px',
                  },
                ],
              },
            ]
          },
        ],
      },
    ],
  },
  //   {
  //     text: '系统曲线',
  //     name: 'systems',
  //     type: 'groupList',
  //     labelWidth: '70px',
  //     addButtonText: '添加类别',
  //     title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
  //     items: [
  //       {
  //         text: '标签',
  //         name: 'label',
  //       },
  //       {
  //         name: 'indicators',
  //         text: '指标',
  //         type: 'groupList',
  //         labelWidth: '50px',
  //         addButtonText: '添加指标',
  //         movable: false,
  //         maxItems: 10,
  //         title: (model: any, index: number | string) => `参数 ${index} ${model.label ?? ''}`,
  //         items: [
  //           {
  //             name: 'label',
  //             text: '标签',
  //             type: 'text',
  //             trim: true,
  //           },
  //           /** 注入业务组件的共通字段 */
  //           ...(await useInstanceConfig(request, 'operational-analysis')),
  //           {
  //             text: '曲线颜色',
  //             name: 'color',
  //             type: 'colorPicker',
  //             defaultValue: '#287CE8',
  //             labelWidth: '70px',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     text: '设备曲线',
  //     name: 'equipments',
  //     type: 'groupList',
  //     labelWidth: '70px',
  //     addButtonText: '添加类别',
  //     title: (model: any, index: number | string) => `# ${index} ${model.label ?? ''}`,
  //     items: [
  //       {
  //         text: '标签',
  //         name: 'label',
  //       },
  //       {
  //         name: 'indicators',
  //         text: '指标',
  //         type: 'groupList',
  //         labelWidth: '50px',
  //         addButtonText: '添加指标',
  //         movable: false,
  //         maxItems: 10,
  //         title: (model: any, index: number | string) => `参数 ${index} ${model.label ?? ''}`,
  //         items: [
  //           {
  //             name: 'label',
  //             text: '标签',
  //             type: 'text',
  //             trim: true,
  //           },
  //           /** 注入业务组件的共通字段 */
  //           ...(await useInstanceConfig(request, 'operational-analysis')),
  //           {
  //             text: '曲线颜色',
  //             name: 'color',
  //             type: 'colorPicker',
  //             defaultValue: '#287CE8',
  //             labelWidth: '70px',
  //           },
  //         ],
  //       },
  //     ],
  //   },
];
