/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-24 11:07:18
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-12 18:03:41
 */
import { BarChart, CandlestickChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
  ScatterChart,
  MarkLineComponent,
  CandlestickChart,
  MarkAreaComponent,
]);

export default echarts;
