import { Request } from '@edoms/editor';

import useInstanceConfig from '../../useInstanceConfig';

export default async (request: Request) => [
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
    text: '设备类型',
    name: 'equipmentTypeList',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加设备',
    items: [
      {
        name: 'key',
        text: '类型名称',
        type: 'text',
      },
      {
        name: 'value',
        text: '类型编码',
        type: 'text',
      },
      ...(await useInstanceConfig(request, 'warning-table-list', ['property', 'propertyType', 'unit'])),
      {
        name: 'equipmentList',
        text: '设备参数',
        type: 'table',
        enableFullscreen: false,
        fixed: false,
        items: [
          {
            label: '设备名称',
            name: 'eqName',
            text: '设备名称',
            type: 'text',
          },
          {
            label: '设备编码',
            name: 'eqCode',
            text: '设备编码',
            type: 'text',
          },
          {
            label: '参数指标',
            name: 'queryList',
            text: '参数指标',
            type: 'table',
            enableFullscreen: false,
            fixed: false,
            items: [
              {
                label: '参数名称',
                name: 'queryName',
                text: '参数名称',
                type: 'text',
              },
              {
                label: '参数单位',
                name: 'queryUnit',
                text: '参数单位',
                type: 'text',
              },
              {
                label: '接口字段',
                name: 'queryApi',
                text: '接口字段',
                type: 'text',
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   text: '表格字段',
  //   name: 'tableTitleList',
  //   type: 'groupList',
  //   labelWidth: '80px',
  //   addButtonText: '添加列',
  //   items: [
  //     {
  //       name: 'key',
  //       text: '名称',
  //       type: 'text',
  //     },
  //     {
  //       name: 'value',
  //       text: '值',
  //       type: 'text',
  //     },
  //     {
  //       name: 'width',
  //       text: '宽度(%)',
  //       type: 'text',
  //     },
  //   ],
  // },
];
