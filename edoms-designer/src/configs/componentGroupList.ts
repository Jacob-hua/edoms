import { ComponentGroup } from '@edoms/editor';

import i18n from '../locales';
const { t } = i18n.global;
const componentGroupList: ComponentGroup[] = [
  {
    title: t('sideBarList.basicCom'),
    items: [
      {
        icon: 'wenben',
        text: t('sideBarList.text'),
        type: 'text',
      },
      {
        icon: 'anniu',
        text: t('sideBarList.btn'),
        type: 'button',
      },
      {
        icon: 'tupian',
        text: t('sideBarList.picture'),
        type: 'img',
      },
      {
        icon: 'tupian',
        text: t('sideBarList.rotationChart'),
        type: 'carousel',
      },
      {
        icon: 'erweima',
        text: t('sideBarList.QRcode'),
        type: 'qrcode',
      },
      {
        icon: 'duoxuankuang',
        text: t('sideBarList.checkbox'),
        type: 'checkbox',
      },
      {
        icon: 'zhexiantu',
        text: t('sideBarList.chart'),
        type: 'charts',
      },
    ],
  },
  {
    title: t('sideBarList.baseContainer'),
    items: [
      {
        icon: 'zu',
        text: t('sideBarList.group'),
        type: 'container',
      },
      {
        icon: 'mengban',
        text: t('sideBarList.smegma'),
        type: 'overlay',
      },
      // 高阶组件
      {
        icon: 'tanchuang',
        text: t('sideBarList.bulletBox'),
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
    title: t('sideBarList.commonComponents'),
    items: [
      {
        icon: 'shiyitu',
        text: t('sideBarList.global_schematic'),
        type: 'global-schematic',
      },
      {
        icon: 'zhishideng',
        text: t('sideBarList.multicolor_polymorphic_light'),
        type: 'multicolor-polymorphic-light',
      },
      {
        icon: 'zhishideng',
        text: t('sideBarList.multicolor_single_light'),
        type: 'multicolor-single-light',
      },
      {
        icon: 'zhishideng',
        text: t('sideBarList.multicolor_image_light'),
        type: 'multicolor-image-light',
      },
      {
        icon: 'gaojing',
        text: t('sideBarList.warning_table_list'),
        type: 'warning-table-list',
      },
      {
        icon: 'donghuanjiance',
        text: t('sideBarList.economic_indicators'),
        type: 'economic-indicators',
      },
      {
        icon: 'xitong',
        text: t('sideBarList.equipment_query_operation'),
        type: 'equipment-query-operation',
      },
      {
        icon: 'leijishuju',
        text: t('sideBarList.system_data_cumulation'),
        type: 'system-data-cumulation',
      },
      {
        icon: 'duoxiangnengxiao',
        text: t('sideBarList.operational_analysis'),
        type: 'operational-analysis',
      },
      {
        icon: 'nengxiaoguankong',
        text: t('sideBarList.energy_monitoring'),
        type: 'energy-monitoring',
      },
      {
        icon: 'xuanfu',
        text: t('sideBarList.suspended_window'),
        type: 'suspended-window',
      },
      {
        icon: 'shishigongkuang',
        text: t('sideBarList.equipment_condition'),
        type: 'equipment-condition',
      },
      {
        icon: 'caozuojilu',
        text: t('sideBarList.operation_records'),
        type: 'operation-records',
      },
      {
        icon: 'yunxingcanshu',
        text: t('sideBarList.running_parameter_energy'),
        type: 'running-parameter-energy',
      },
    ],
  },
  {
    title: t('sideBarList.operational_monitoring_electric'),
    items: [
      {
        icon: 'diannengzhiliang',
        text: t('sideBarList.electric_energy_quality'),
        type: 'electric-energy-quality',
      },
      {
        icon: 'xitong',
        text: t('sideBarList.intelligence_report'),
        type: 'intelligence-report-eletric',
      },
      {
        icon: 'yunxingfenxi',
        text: t('sideBarList.operational_analysis'),
        type: 'operations-analysis',
      },
    ],
  },
  {
    title: t('sideBarList.operational_monitoring_cold'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.intelligence_report'),
        type: 'intelligence-report-cold',
      },
      {
        icon: 'duoxiangnengxiao',
        text: t('sideBarList.load_forecasting'),
        type: 'load-forecasting',
      },
    ],
  },
  {
    title: t('sideBarList.operational_monitoring_heat'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.intelligence_report'),
        type: 'intelligence-report-heat',
      },
      {
        icon: 'nengxiaoguankong',
        text: t('sideBarList.efficiency_analysis'),
        type: 'efficiency-analysis',
      },
      {
        icon: 'duoxiangnengxiao',
        text: t('sideBarList.operational_analysis'),
        type: 'operations-analysis-heat',
      },
      {
        icon: 'duoxiangnengxiao',
        text: t('sideBarList.optimal_regulation'),
        type: 'optimal-regulation-heat',
      },
    ],
  },
  {
    title: t('sideBarList.operational_monitoring_water'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.intelligence_report'),
        type: 'intelligence-report-water',
      },
      {
        icon: 'yunxingfenxi',
        text: t('sideBarList.operational_analysis'),
        type: 'operations-analysis-water',
      },
    ],
  },
  {
    title: t('sideBarList.operational_monitoring_cloud'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.intelligence_report'),
        type: 'intelligence-report-cloud',
      },
    ],
  },
  {
    title: t('sideBarList.operational_monitoring_pv'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.intelligence_report'),
        type: 'intelligence-report-pv',
      },
      {
        icon: 'yunxingfenxi',
        text: t('sideBarList.operational_analysis'),
        type: 'operations-analysis-pv',
      },
      {
        icon: 'xitong',
        text: t('sideBarList.asset_information'),
        type: 'asset-information-pv',
      },
    ],
  },
  {
    title: t('sideBarList.operational_monitoring_charge'),
    items: [
      {
        icon: 'xitong',
        text: t('sideBarList.intelligence_report'),
        type: 'intelligence-report-charge',
      },
      {
        icon: 'xitong',
        text: t('sideBarList.equipment_monitoring'),
        type: 'equipment-monitoring-charge',
      },
      {
        icon: 'yunxingfenxi',
        text: t('sideBarList.operational_analysis'),
        type: 'operations-analysis-charge',
      },
      {
        icon: 'chongdiankongzhi',
        text: t('sideBarList.control_charge'),
        type: 'control-charge',
      },
    ],
  },
  {
    title: t('sideBarList.operational_monitoring_energy'),
    items: [
      {
        icon: 'feijiashezhi',
        text: t('sideBarList.fee_setting'),
        type: 'fee-setting-energy',
      },
      {
        icon: 'yunxingcanshu',
        text: t('sideBarList.running_parameter'),
        type: 'running-parameter-energy',
      },
      {
        icon: 'yunxingcanshu',
        text: t('sideBarList.control_panel'),
        type: 'control-panel-energy',
      },
    ],
  },
];

export default componentGroupList;
