import { dateFormat, isNumber } from '@edoms/utils';

export default () => {
  const formatTime = (time: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (typeof time === 'number') {
      time = `${time}`;
    } else if (typeof time === 'string' && isNumber(time)) {
      time = new Date(Number(time));
    }
    return dateFormat(time, '-', format);
  };
  return {
    formatTime,
  };
};
