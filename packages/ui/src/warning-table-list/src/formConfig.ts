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
    text: '告警分类',
    name: 'warningTypeList',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加告警分类',
    items: [
      {
        name: 'key',
        text: '分类名称',
        type: 'text',
      },
      {
        name: 'value',
        text: '分类编码',
        type: 'text',
      },
      ...(await useInstanceConfig(request, 'warning-table-list', ['property', 'propertyType', 'unit'])),
      {
        name: 'thresholdConfigs',
        text: '告警类型',
        type: 'table',
        enableFullscreen: false,
        fixed: false,
        items: [
          {
            label: '名称',
            name: 'warningName',
            text: '名称',
            type: 'text',
          },
          {
            label: '编码',
            name: 'warningCode',
            text: '编码',
            type: 'text',
          },
          {
            label: '颜色',
            name: 'color',
            text: '颜色',
            type: 'colorPicker',
            defaultValue: '#ff0000',
          },
        ],
      },
    ],
  },
  {
    text: '表格字段',
    name: 'tableTitleList',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加列',
    items: [
      {
        name: 'key',
        text: '名称',
        type: 'text',
      },
      {
        name: 'value',
        text: '值',
        type: 'text',
      },
      {
        name: 'width',
        text: '宽度(%)',
        type: 'text',
      },
    ],
  },
];
