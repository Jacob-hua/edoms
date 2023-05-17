export default {
  title: '电能质量',
  type: 'electric-energy-quality',
  // 三相电颜色
  currentLa: 'rgba(40, 124, 231, 1)',
  currentLb: 'rgba(56, 174, 28, 1)',
  currentLc: 'rgba(193, 114, 29, 1)',
  // 负载率颜色
  loadRate: 'rgba(65, 228, 222, 1)',
  // 三相不平衡率颜色
  threePhasRate: 'rgba(56, 174, 28, 1)',
  // 审核基准
  examine: '50',
  proportion: [
    {
      label: '<15%',
      color: 'rgba(40, 124, 231, 1)',
    },
    {
      label: '15%~30%',
      color: 'rgba(116, 125, 248, 1)',
    },
    {
      label: '30%~50%',
      color: 'rgba(33, 167, 104, 1)',
    },
    {
      label: '>50%',
      color: 'rgba(65, 228, 222, 1)',
    },
  ],
  style: {
    width: '117',
    height: '80',
    backgroundColor: 'rgba(0, 163, 255, 0.1)',
  },
};
