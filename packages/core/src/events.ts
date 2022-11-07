/**
 * 通用的事件处理
 */

import App from './App';
import Node from './Node';

export interface EventOption {
  label: string;
  value: string;
}

export interface MethodOption extends EventOption {
  props: string[] | undefined;
}

const COMMON_EVENT_PREFIX = 'edoms:common:events:';
const COMMON_METHOD_PREFIX = 'edoms:common:actions:';
const CommonMethod = {
  SHOW: 'show',
  HIDE: 'hide',
  SCROLL_TO_VIEW: 'scrollIntoView',
  SCROLL_TO_TOP: 'scrollToTop',
};

export const DEFAULT_EVENTS: EventOption[] = [{ label: '点击', value: `${COMMON_EVENT_PREFIX}click` }];

export const DEFAULT_METHODS: MethodOption[] = [];

export const getCommonEventName = (commonEventName: string) => {
  if (commonEventName.startsWith(COMMON_EVENT_PREFIX)) return commonEventName;
  return `${COMMON_EVENT_PREFIX}${commonEventName}`;
};

export const isCommonMethod = (methodName: string) => methodName.startsWith(COMMON_METHOD_PREFIX);

// 点击在组件内的某个元素上，需要向上寻找到当前组件
const getDirectComponent = (element: HTMLElement | null, app: App): Node | Boolean => {
  if (!element) {
    return false;
  }

  if (!element.id) {
    return getDirectComponent(element.parentElement, app);
  }

  const node = app.page?.getNode(element.id);
  if (!node) {
    return false;
  }

  return node;
};

const commonClickEventHandler = (app: App, eventName: string, e: any) => {
  const node = getDirectComponent(e.target, app);

  if (node) {
    app.emit(getCommonEventName(eventName), node);
  }
};

export const bindCommonEventListener = (app: App) => {
  window.document.body.addEventListener('click', (e: any) => {
    commonClickEventHandler(app, 'click', e);
  });

  window.document.body.addEventListener(
    'click',
    (e: any) => {
      commonClickEventHandler(app, 'click:capture', e);
    },
    true
  );
};

export const triggerCommonMethod = (methodName: string, node: Node) => {
  const { instance } = node;

  switch (methodName.replace(COMMON_METHOD_PREFIX, '')) {
    case CommonMethod.SHOW:
      instance?.methods?.show();
      break;

    case CommonMethod.HIDE:
      instance?.methods?.hide();
      break;

    case CommonMethod.SCROLL_TO_VIEW:
      instance?.$el?.scrollIntoView({ behavior: 'smooth' });
      break;

    case CommonMethod.SCROLL_TO_TOP:
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;

    default:
      break;
  }
};
