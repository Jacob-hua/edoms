export default () => [
  {
    text: '摄像头',
    name: 'camera',
    type: 'groupList',
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
    ],
  },
];
