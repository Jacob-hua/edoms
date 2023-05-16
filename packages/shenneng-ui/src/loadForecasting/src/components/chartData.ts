// import * as echarts from 'echarts/core';
export default {
  color: ['rgba(40, 124, 231, 1)', 'rgba(65, 228, 222, 1)'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
        color: '#FFFFFF',
        width: 1,
        shadowColor: '#FFFFFF',
        opacity: 0.2,
      },
    },
    backgroundColor: '#0b2234',
    borderColor: '#204C6F',
    formatter: (params: any) => {
      return `
        <div>
            <span style="color: #ffffff; font-size: 12px">时间: </span>
            <span style="color: #41e4de; font-size: 12px">${params[0].axisValue}</span>
        </div>
        <div>
            <span style="color: #ffffff; font-size: 12px">${params[0]?.seriesName}:</span>
            <span style="color: #41e4de; font-size: 12px">${params[0]?.value}</span>
        </div>
        <div>
            <span style="color: #ffffff; font-size: 12px">${params[1]?.seriesName}:</span>
            <span style="color: #41e4de; font-size: 12px">${params[1]?.value}</span>
        </div>
      `;
    },
  },
  legend: {
    icon: 'rect',
    position: 'middle',
    // top: 10,
    type: 'plain',
    itemHeight: 2,
    itemWidth: 14,
    itemGap: 30,
    textStyle: {
      fontSize: 12,
      color: '#eff7ff',
      fontWeight: 'bold',
    },
    // data: ['实际值', '预测值'],
    data: [
      {
        name: '实际值',
        itemStyle: {
          borderColor: 'rgba(40, 124, 231, 1)',
        },
      },
      {
        name: '预测值',
        itemStyle: {
          borderColor: 'rgba(65, 228, 222, 1)',
        },
      },
    ],
  },
  grid: {
    top: '15%',
    left: '3%',
    right: '3%',
    bottom: '8%',
  },
  xAxis: [
    {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#a4daff',
          opacity: 0.2,
        },
      },
      axisLabel: {
        show: true,
        color: 'rgba(234, 245, 255, 0.5)',
      },
      splitLine: {
        show: false,
      },
      boundaryGap: false,
      axisTick: {
        show: false,
      },
      data: [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
      ],
    },
  ],

  yAxis: [
    {
      type: 'value',
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        type: 'solid',
        width: 1,
        lineStyle: {
          color: '#a4daff',
          type: 'dashed',
          opacity: 0.2,
        },
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: 'rgba(234, 245, 255, 0.5)',
        },
      },
      axisTick: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: '实际值',
      type: 'line',
      showAllSymbol: true,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [20, 15, 22, 23, 32, 17, 32, 11, 20, 22, 35, 17, 31, 13, 22, 15, 35, 25],
      smooth: true,
      itemStyle: {
        borderWidth: 2,
        color: 'rgba(40, 124, 232, 1)',
        borderColor: '#fff',
      },
      lineStyle: {
        normal: {
          width: 1,
          color: 'rgba(40, 124, 231, 1)',
        },
      },
    },
    {
      name: '预测值',
      type: 'line',
      showAllSymbol: true,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [30, 10, 20, 21, 35, 15, 30, 10, 20, 21, 35, 15, 30, 10, 25, 11, 30, 15, 20, 20, 15, 21, 35, 25],
      smooth: true,
      itemStyle: {
        borderWidth: 2,
        color: 'rgba(65, 228, 222, 1)',
        borderColor: '#fff',
      },
      lineStyle: {
        normal: {
          width: 1,
          color: 'rgba(65, 228, 222, 1)',
        },
      },
    },
  ],
};
