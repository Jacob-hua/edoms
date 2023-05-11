export default async () => [
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
    text: '设备类型',
    name: 'equipmentTypeList',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加组',
    items: [
      {
        name: 'key',
        text: '类型名称',
        type: 'text',
      },
      {
        name: 'equipmentList',
        text: '设备参数',
        type: 'groupList',
        enableFullscreen: true,
        addButtonText: '添加设备',
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
            name: 'pointList',
            text: '点位名称',
            type: 'groupList',
            enableFullscreen: true,
            addButtonText: '添加点位',
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
    ],
  },
];
