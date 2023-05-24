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
    title: '共通组件',
    items: [
      {
        icon: 'shiyitu',
        text: '全局示意图',
        type: 'global-schematic',
      },
      {
        icon: 'zhishideng',
        text: '多色多态指示灯',
        type: 'multicolor-polymorphic-light',
      },
      {
        icon: 'zhishideng',
        text: '多色单态指示灯',
        type: 'multicolor-single-light',
      },
      {
        icon: 'gaojing',
        text: '告警列表',
        type: 'warning-table-list',
      },
      {
        icon: 'donghuanjiance',
        text: '经济指标',
        type: 'economic-indicators',
      },
      {
        icon: 'xitong',
        text: '设备运行参数',
        type: 'equipment-query-operation',
      },
      {
        icon: 'leijishuju',
        text: '系统累计数据',
        type: 'system-data-cumulation',
      },
      {
        icon: 'duoxiangnengxiao',
        text: '运行分析',
        type: 'operational-analysis',
      },
      {
        icon: 'nengxiaoguankong',
        text: '能效监测',
        type: 'energy-monitoring',
      },
      {
        icon: 'xuanfu',
        text: '悬浮窗',
        type: 'suspended-window',
      },
    ],
  },
  {
    title: '运行监测-配电',
    items: [
      {
        icon: 'diannengzhiliang',
        text: '电能质量',
        type: 'electric-energy-quality',
      },
      {
        icon: 'xitong',
        text: '智能报告',
        type: 'intelligence-report-eletric',
      },
      {
        icon: 'yunxingfenxi',
        text: '运行分析',
        type: 'operations-analysis',
      },
    ],
  },
  {
    title: '运行监测-冷',
    items: [
      {
        icon: 'xitong',
        text: '智能报告',
        type: 'intelligence-report-cold',
      },
      {
        icon: 'duoxiangnengxiao',
        text: '运行分析(冷 弹窗)',
        type: 'operations-analysis-cold',
      },
    ],
  },
  {
    title: '运行监测-热',
    items: [
      {
        icon: 'xitong',
        text: '智能报告',
        type: 'intelligence-report-heat',
      },
      {
        icon: 'nengxiaoguankong',
        text: '能效分析',
        type: 'efficiency-analysis',
      },
      {
        icon: 'duoxiangnengxiao',
        text: '运行分析(热 弹窗)',
        type: 'operations-analysis-heat',
      },
      {
        icon: 'duoxiangnengxiao',
        text: '负荷预测(冷 弹窗)',
        type: 'load-forecasting',
      },
      {
        icon: 'duoxiangnengxiao',
        text: '优化调控',
        type: 'optimal-regulation-heat',
      },
    ],
  },
  {
    title: '运行监测-给水',
    items: [
      {
        icon: 'xitong',
        text: '智能报告',
        type: 'intelligence-report-water',
      },
    ],
  },
  {
    title: '运行监测-风',
    items: [
      {
        icon: 'xitong',
        text: '智能报告',
        type: 'intelligence-report-cloud',
      },
    ],
  },
];

export default componentGroupList;
