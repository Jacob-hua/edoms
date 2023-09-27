import { ComponentGroup } from '@edoms/editor';

import i18n from '../locales';
const { t } = i18n.global;
const componentGroupList: ComponentGroup[] = [
  {
    title: t('sideBarList.基础组件'),
    items: [
      {
        icon: 'wenben',
        text: t('sideBarList.文本'),
        type: 'text',
      },
      {
        icon: 'anniu',
        text: t('sideBarList.按钮'),
        type: 'button',
      },
      {
        icon: 'tupian',
        text: t('sideBarList.图片'),
        type: 'img',
      },
      {
        icon: 'tupian',
        text: t('sideBarList.轮播图'),
        type: 'carousel',
      },
      {
        icon: 'erweima',
        text: t('sideBarList.二维码'),
        type: 'qrcode',
      },
      {
        icon: 'duoxuankuang',
        text: t('sideBarList.多选框'),
        type: 'checkbox',
      },
      {
        icon: 'zhexiantu',
        text: t('sideBarList.图表'),
        type: 'charts',
      },
    ],
  },
  {
    title: t('sideBarList.基础容器'),
    items: [
      {
        icon: 'zu',
        text: t('sideBarList.组'),
        type: 'container',
      },
      {
        icon: 'mengban',
        text: t('sideBarList.蒙层'),
        type: 'overlay',
      },
      // 高阶组件
      {
        icon: 'tanchuang',
        text: t('sideBarList.弹框'),
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
    title: t('sideBarList.共通组件'),
    items: [
      {
        icon: 'shiyitu',
        text: t('sideBarList.全局示意图'),
        type: 'global-schematic',
      },
      {
        icon: 'zhishideng',
        text: t('sideBarList.多色多态指示灯'),
        type: 'multicolor-polymorphic-light',
      },
      {
        icon: 'zhishideng',
        text: t('sideBarList.多色单态指示灯'),
        type: 'multicolor-single-light',
      },
      {
        icon: 'zhishideng',
        text: t('sideBarList.图片单态指示灯'),
        type: 'multicolor-image-light',
      },
      {
        icon: 'gaojing',
        text: t('sideBarList.告警列表'),
        type: 'warning-table-list',
      },
      {
        icon: 'donghuanjiance',
        text: t('sideBarList.经济指标'),
        type: 'economic-indicators',
      },
      {
        icon: 'xitong',
        text: t('sideBarList.设备运行参数'),
        type: 'equipment-query-operation',
      },
      {
        icon: 'leijishuju',
        text: t('sideBarList.系统累计数据'),
        type: 'system-data-cumulation',
      },
      {
        icon: 'duoxiangnengxiao',
        text: t('sideBarList.运行分析'),
        type: 'operational-analysis',
      },
      {
        icon: 'nengxiaoguankong',
        text: t('sideBarList.能效监测'),
        type: 'energy-monitoring',
      },
      {
        icon: 'xuanfu',
        text: t('sideBarList.悬浮窗'),
        type: 'suspended-window',
      },
      {
        icon: 'shishigongkuang',
        text: t('sideBarList.设备工况'),
        type: 'equipment-condition',
      },
      {
        icon: 'caozuojilu',
        text: t('sideBarList.操作记录'),
        type: 'operation-records',
      },
      {
        icon: 'yunxingcanshu',
        text: t('sideBarList.运行参数'),
        type: 'running-parameter-energy',
      },
      {
        icon: 'feiyongduibi',
        text: t('sideBarList.费用对比'),
        type: 'cost-comparsion',
      },
      {
        icon: 'xitongsheding',
        text: t('sideBarList.系统设定'),
        type: 'system-settings',
      },
      {
        icon: 'shebeishikong',
        text: t('sideBarList.设备实控'),
        type: 'eq-control',
      },
      {
        icon: 'yunxingcanshu',
        text: t('sideBarList.费用对比详情'),
        type: 'cost-comparison-detail',
      },
    ],
  },
  {
    title: t('sideBarList.运行监测配电'),
    items: [
      {
        icon: 'diannengzhiliang',
        text: t('sideBarList.电能质量'),
        type: 'electric-energy-quality',
      },
      {
        icon: 'xitong',
        text: t('sideBarList.智能报告'),
        type: 'intelligence-report-eletric',
      },
      {
        icon: 'yunxingfenxi',
        text: t('sideBarList.运行分析'),
        type: 'operations-analysis',
      },
    ],
  },
  {
    title: t('sideBarList.运行监测冷'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.智能报告'),
        type: 'intelligence-report-cold',
      },
      {
        icon: 'duoxiangnengxiao',
        text: t('sideBarList.负荷预测'),
        type: 'load-forecasting',
      },
    ],
  },
  {
    title: t('sideBarList.运行监测热'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.智能报告'),
        type: 'intelligence-report-heat',
      },
      {
        icon: 'nengxiaoguankong',
        text: t('sideBarList.能效分析'),
        type: 'efficiency-analysis',
      },
      {
        icon: 'duoxiangnengxiao',
        text: t('sideBarList.运行分析'),
        type: 'operations-analysis-heat',
      },
      {
        icon: 'duoxiangnengxiao',
        text: t('sideBarList.优化调控'),
        type: 'optimal-regulation-heat',
      },
    ],
  },
  {
    title: t('sideBarList.运行监测给水'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.智能报告'),
        type: 'intelligence-report-water',
      },
      {
        icon: 'yunxingfenxi',
        text: t('sideBarList.运行分析'),
        type: 'operations-analysis-water',
      },
    ],
  },
  {
    title: t('sideBarList.运行监测风'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.智能报告'),
        type: 'intelligence-report-cloud',
      },
    ],
  },
  {
    title: t('sideBarList.运行监测光伏'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.智能报告'),
        type: 'intelligence-report-pv',
      },
      {
        icon: 'yunxingfenxi',
        text: t('sideBarList.运行分析'),
        type: 'operations-analysis-pv',
      },
      {
        icon: 'xitong',
        text: t('sideBarList.资产信息'),
        type: 'asset-information-pv',
      },
    ],
  },
  {
    title: t('sideBarList.运行监测充电桩'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.智能报告'),
        type: 'intelligence-report-charge',
      },
      {
        icon: 'xitong',
        text: t('sideBarList.设备监测'),
        type: 'equipment-monitoring-charge',
      },
      {
        icon: 'yunxingfenxi',
        text: t('sideBarList.运行分析'),
        type: 'operations-analysis-charge',
      },
      {
        icon: 'chongdiankongzhi',
        text: t('sideBarList.充电控制'),
        type: 'control-charge',
      },
    ],
  },
  {
    title: t('sideBarList.运行监测储能'),
    items: [
      {
        icon: 'feijiashezhi',
        text: t('sideBarList.费价设置'),
        type: 'fee-setting-energy',
      },
      {
        icon: 'yunxingcanshu',
        text: t('sideBarList.运行参数'),
        type: 'running-parameter-energy',
      },
      {
        icon: 'yunxingcanshu',
        text: t('sideBarList.控制面板'),
        type: 'control-panel-energy',
      },
    ],
  },
];

export default componentGroupList;
