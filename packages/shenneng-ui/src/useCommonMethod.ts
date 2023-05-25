import { Callback } from '@edoms/schema';

function parseCSSString(cssString: string): Record<string, string> {
  const styleObj: Record<string, string> = {};

  const styleArray: string[] = cssString.split(';');

  for (let i = 0; i < styleArray.length; i++) {
    const styleItem: string = styleArray[i].trim();

    if (styleItem !== '') {
      const stylePair: string[] = styleItem.split(':');
      const property: string = stylePair[0].trim();
      const value: string = stylePair[1].trim();

      styleObj[property] = value;
    }
  }

  return styleObj;
}

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
    props.config.style = {
      ...props.config.style,
      ...parseCSSString(style),
    };
  };
  setStyle.__depends__ = ['style'];

  return {
    triggerVisible,
    setStyle,
  };
};
