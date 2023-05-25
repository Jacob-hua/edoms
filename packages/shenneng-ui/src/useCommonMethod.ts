import { Callback } from '@edoms/schema';

export default (props: any): Record<string, Callback> => {
  const triggerVisible: Callback = ({ visible }: any) => {
    if (['hidden', 'visible'].includes(visible)) {
      props.config.style.visibility = visible;
    } else if (!visible || visible === 'false') {
      props.config.style.visibility = 'hidden';
    } else {
      props.config.style.visibility = 'visible';
    }
  };
  triggerVisible.__depends__ = ['visible'];

  const setStyle: Callback = ({ style }: any) => {
    console.log('设置样式', style);
  };
  setStyle.__depends__ = ['style'];

  return {
    triggerVisible,
    setStyle,
  };
};
