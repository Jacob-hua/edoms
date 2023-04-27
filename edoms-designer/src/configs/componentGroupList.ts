import { ComponentGroup } from '@edoms/editor';

const componentGroupList: ComponentGroup[] = [
  {
    title: '基础组件',
    items: [
      {
        icon: 'wenben',
        text: '文本',
        type: 'text',
      },
      {
        icon: 'anniu',
        text: '按钮',
        type: 'button',
      },
      {
        icon: 'tupian',
        text: '图片',
        type: 'img',
      },
      {
        icon: 'erweima',
        text: '二维码',
        type: 'qrcode',
      },
      {
        icon: 'duoxuankuang',
        text: '多选框',
        type: 'checkbox',
      },
      {
        icon: 'zhexiantu',
        text: '图表',
        type: 'charts',
      },
    ],
  },
  {
    title: '基础容器',
    items: [
      {
        icon: 'zu',
        text: '组',
        type: 'container',
      },
      {
        icon: 'mengban',
        text: '蒙层',
        type: 'overlay',
      },
      // 高阶组件
      {
        icon: 'tanchuang',
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
        icon: 'donghuanjiance',
        text: '动环监测',
        type: 'dynamic-monitoring',
      },
      {
        icon: 'shedingcanshu',
        text: '设定参数',
        type: 'setting-parameter',
      },
      {
        icon: 'xitong',
        text: '系统运行参数',
        type: 'system-operating-parameters',
      },
      {
        icon: 'shiyitu',
        text: '全局示意图',
        type: 'global-schematic',
      },
      {
        icon: 'gaojing',
        text: '告警列表',
        type: 'warning-running-list',
      },
      {
        icon: 'nengxiaoguankong',
        text: '能效监测',
        type: 'energy-efficiency-monitoring',
      },
      {
        icon: 'zhishideng',
        text: '指示灯',
        type: 'indicator-light',
      },
      {
        icon: 'canshuquxian',
        text: '参数曲线',
        type: 'running-parameters',
      },
      {
        icon: 'tianqi',
        text: '时间天气',
        type: 'time-weather',
      },
      {
        icon: 'jiankong',
        text: '监控视频',
        type: 'video',
      },
      {
        icon: 'xuanfu',
        text: '移动悬浮',
        type: 'global-schematic-chart',
      },
      {
        icon: 'duoxiangnengxiao',
        text: '多项能效监测',
        type: 'multiple-energy-monitoring',
      },
      {
        icon: 'shishigongkuang',
        text: '运行工况',
        type: 'equipment-condition',
      },
      {
        icon: 'leijishuju',
        text: '系统累计数据',
        type: 'system-cumulative-data',
      },
      {
        icon: 'shebei',
        text: '设备运行参数',
        type: 'equipment-operating-parameter',
      },
      {
        icon: 'gaojing',
        text: '告警管理',
        type: 'warning-table-list',
      },
      {
        icon: 'donghuanjiance',
        text: '经济指标',
        type: 'economic-indicators',
      },
      {
        icon: 'yunxingfenxi',
        text: '运行分析',
        type: 'operational-analysis',
      },
      {
        icon: 'nengxiaoguankong',
        text: '能效监测',
        type: 'energy-monitoring',
      },
      {
        icon: 'zhinengbaogao',
        text: '智能报告',
        type: 'intelligence-report',
      },
    ],
  },
];

export default componentGroupList;
