import {
  FolderOpened,
  Grid,
  Operation,
  Picture,
  PictureFilled,
  Setting,
  SwitchButton,
  Tickets,
  Umbrella,
  Warning,
} from '@element-plus/icons-vue';

import { ComponentGroup } from '@edoms/editor';

const componentGroupList: ComponentGroup[] = [
  {
    title: '基础组件',
    items: [
      {
        icon: Tickets,
        text: '文本',
        type: 'text',
      },
      {
        icon: SwitchButton,
        text: '按钮',
        type: 'button',
      },
      {
        icon: PictureFilled,
        text: '图片',
        type: 'img',
      },
      {
        icon: Grid,
        text: '二维码',
        type: 'qrcode',
      },
    ],
  },
  {
    title: '基础容器',
    items: [
      {
        icon: FolderOpened,
        text: '组',
        type: 'container',
      },
      {
        icon: FolderOpened,
        text: '蒙层',
        type: 'overlay',
      },
      // 高阶组件
      {
        icon: Tickets,
        text: '弹窗',
        type: '',
        data: {
          type: 'overlay',
          style: {
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
          name: '弹窗',
          items: [
            {
              type: 'container',
              style: {
                position: 'absolute',
                width: '80%',
                height: '400',
                top: '143.87',
                left: 37.5,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              },
              name: '组',
              items: [],
              layout: 'absolute',
            },
          ],
        },
      },
    ],
  },
  {
    title: '业务组件',
    items: [
      {
        icon: Umbrella,
        text: '动环监测',
        type: 'dynamic-monitoring',
      },
      {
        icon: Setting,
        text: '设定参数',
        type: 'setting-parameter',
      },
      {
        icon: Operation,
        text: '系统运行参数',
        type: 'system-operating-parameters',
      },
      {
        icon: Picture,
        text: '全局示意图',
        type: 'global-schematic',
      },
      {
        icon: Warning,
        text: '告警列表',
        type: 'warning-running-list',
      },
    ],
  },
];

export default componentGroupList;
