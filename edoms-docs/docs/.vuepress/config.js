import { defineUserConfig, defaultTheme } from 'vuepress';

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: '组件化平台',
  description: 'E-DOMs 静态站点',
  host: '0.0.0.0',
  port: 8800,
  open: true,
  theme: defaultTheme({
    // 添加侧边栏
    sidebar: {
      '/': [
        {
          text: '基础组件',
          collapsible: true,
          children: [
            '/component/basiccomponents/text.md',
            '/component/basiccomponents/button.md',
            '/component/basiccomponents/picture.md',
            '/component/basiccomponents/carousel.md',
            '/component/basiccomponents/QRcode.md',
            '/component/basiccomponents/checkbox.md',
            '/component/basiccomponents/chart.md',
          ],
        },
        {
          text: '基础容器',
          collapsible: true,
          children: [
            '/component/baseContainer/bulletBox.md',
            '/component/baseContainer/group.md',
            '/component/baseContainer/smegma.md',
          ],
        },
        {
          text: '共通组件',
          collapsible: true,
          children: [
            '/component/publicComponents/economic-indicators.md',
            '/component/publicComponents/energy-monitoring.md',
            '/component/publicComponents/equipment-condition.md',
            '/component/publicComponents/equipment-query-operation.md',
            '/component/publicComponents/global-schematic.md',
            '/component/publicComponents/image-light.md',
            '/component/publicComponents/operation-records.md',
            '/component/publicComponents/operational-analysis.md',
            '/component/publicComponents/polymorphic-light.md',
            '/component/publicComponents/running-parameter-energy.md',
            '/component/publicComponents/single-light.md',
            '/component/publicComponents/suspended-window.md',
            '/component/publicComponents/system-data-cumulation.md',
            '/component/publicComponents/warning-table-list.md',
          ],
        },
        {
          text: '业务组件',
          collapsible: true,
          children: [
            '/component/businessComponents/asset-information.md',
            '/component/businessComponents/control-charge.md',
            '/component/businessComponents/control-panel.md',
            '/component/businessComponents/efficiency-analysis.md',
            '/component/businessComponents/electric-energy-quality.md',
            '/component/businessComponents/equipment-monitoring.md',
            '/component/businessComponents/fee-setting-energy.md',
            '/component/businessComponents/intelligence-report.md',
            '/component/businessComponents/load-forecasting.md',
            '/component/businessComponents/operations-analysis.md',
            '/component/businessComponents/optimal-regulation.md',
            '/component/businessComponents/running-parameter.md',
          ],
        },
      ],
    },
  })
});
