export default () => [
  {
    text: '摄像头',
    name: 'cameras',
    type: 'groupList',
    labelWidth: '80px',
    addButtonText: '添加摄像头',
    items: [
      {
        name: 'cameraName',
        text: '名称',
        type: 'text',
      },
      {
        name: 'videoSource',
        text: '视频源',
        type: 'text',
      },
      {
        name: 'acount',
        text: '账号',
        type: 'text',
      },
      {
        name: 'password',
        text: '密码',
        type: 'text',
      },
    ],
  },
];
