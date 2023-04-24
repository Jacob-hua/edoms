export default (props: any) => {
  function triggerVisible({ visible }: any) {
    if (!visible || visible === 'false') {
      props.config.style.visibility = 'hidden';
    } else {
      props.config.style.visibility = 'visible';
    }
  }
  triggerVisible.__depends__ = ['visible'];
  return {
    triggerVisible,
  };
};
