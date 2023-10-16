import { EventEmitter } from 'events';

import { createI18n, I18n } from 'vue-i18n';

import { Callback, EventAction, EventArgs, EventItemConfig, Id, MApp, MethodProps } from '@edoms/schema';
import { getUrlParam, setUrlParam } from '@edoms/utils';

import { bindCommonEventListener, isCommonMethod, triggerCommonMethod } from './events';
import type Node from './Node';
import Page from './Page';
import { calculateMethodProps, fillBackgroundImage, isNumber, style2Obj } from './utils';

interface AppOptionsConfig {
  ua?: string;
  config?: MApp;
  jsEngine?: 'browser' | 'hippy';
  designWidth?: number;
  curPage?: Id;
  transformStyle?: (style: Record<string, any>) => Record<string, any>;
}

interface EventCache {
  eventConfig: EventItemConfig;
  fromCpt: any;
  props?: MethodProps;
}

export interface FileStruct {
  /** 文件名称 */
  fileName: string;
  /** 文件类型 */
  fileType: string;
  /** 文件后缀 */
  fileSuffix: string;
  /** 文件状态 */
  status: 'done' | 'uploading' | 'error';
  /** 文件url */
  url: string;
}

class App extends EventEmitter {
  public config: MApp | undefined;
  public pages = new Map<Id, Page>();

  public page: Page | undefined;

  public jsEngine = 'browser';
  public designWidth = 375;

  public components = new Map();

  public eventQueueMap: Record<string, EventCache[]> = {};

  public i18n: I18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') ?? navigator.language,
  });

  constructor(options: AppOptionsConfig) {
    super();
    options.jsEngine && (this.jsEngine = options.jsEngine);
    options.designWidth && (this.designWidth = options.designWidth);

    // 根据屏幕大小计算出根节点的font-size，用于rem样式的适配
    const calcFontsize = () => {
      const { width } = document.documentElement.getBoundingClientRect();
      const fontSize = width / (this.designWidth / 100);
      document.documentElement.style.fontSize = `${fontSize}px`;
    };

    calcFontsize();

    document.body.style.fontSize = '14px';

    globalThis.addEventListener('resize', calcFontsize);

    if (options.transformStyle) {
      this.transformStyle = options.transformStyle;
    }

    this.config = options.config;
    options.config && this.setConfig(options.config, options.curPage);

    bindCommonEventListener(this);
  }

  public get t(): Function {
    return this.i18n.global.t;
  }

  public setMessage(message: Record<string, any>) {
    Object.keys(message).forEach((locale) => {
      this.i18n.global.mergeLocaleMessage(locale, message[locale]);
    });
  }

  /**
   * 将dsl中的style配置转换成css，主要是将数子转成rem为单位的样式值，例如100将被转换成1rem
   * @param style Object
   * @returns Object
   */
  public transformStyle(style: Record<string, any> | string) {
    if (!style) {
      return {};
    }

    let styleObj: Record<string, any> = {};
    const results: Record<string, any> = {};

    if (typeof style === 'string') {
      styleObj = style2Obj(style);
    } else {
      styleObj = { ...style };
    }

    const whiteList = ['zIndex', 'opacity', 'fontWeight'];
    Object.entries(styleObj).forEach(([key, value]) => {
      if (key === 'backgroundImage' && value) {
        if (typeof value === 'string') {
          results[key] = fillBackgroundImage(value);
        } else if (Array.isArray(value) && value.length > 0) {
          results[key] = fillBackgroundImage(this.generateImageSrc(value[0]));
        } else {
          results[key] = '';
        }
      } else if (key === 'transform' && typeof value !== 'string') {
        const values = Object.entries(value as Record<string, string>)
          .map(([transformKey, transformValue]) => {
            if (!transformValue.trim()) return '';
            if (transformKey === 'rotate' && isNumber(transformValue)) {
              transformValue = `${transformValue}deg`;
            }
            return `${transformKey}(${transformValue})`;
          })
          .join(' ');
        results[key] = !values.trim() ? 'none' : values;
      } else if (!whiteList.includes(key) && value && /^[-]?[0-9]*[.]?[0-9]*$/.test(value)) {
        results[key] = `${value / 100}rem`;
      } else {
        value && (results[key] = value);
      }
    });

    return results;
  }

  public generateImageSrc(fileStruct: FileStruct): string {
    const isLocalPreview = getUrlParam('localPreview');
    const { fileSuffix, url } = fileStruct;
    if (isLocalPreview) {
      return `http://k8s.isiact.com/edoms-designtime-service-dev/edoms/design-time/file/preview?contentId=${url}`;
    }
    return `${window.location.origin}/static/${url}${fileSuffix}`;
  }

  public getStaticSrc(fileStruct: FileStruct): string {
    const isLocalPreview = getUrlParam('localPreview');
    const { fileSuffix, url } = fileStruct;
    if (isLocalPreview) {
      return `http://k8s.isiact.com/edoms-designtime-service-dev/edoms/design-time/file/download`;
    }
    return `${window.location.origin}/static/${url}${fileSuffix}`;
  }

  /**
   * 设置dsl
   * @param config dsl跟节点
   * @param curPage 当前页面id
   */
  public setConfig(config: MApp, curPage?: Id) {
    console.log(config, curPage);
    this.config = config;
    this.pages = new Map();
    config.items?.forEach((page) => {
      this.pages.set(
        page.id,
        new Page({
          config: page,
          app: this,
        })
      );
    });

    this.setPage(curPage || this.page?.data?.id);
  }

  public setPage(id?: Id) {
    let page;

    if (id) {
      page = this.pages.get(id);
    }

    if (!page) {
      if (this.config?.index) {
        page = this.pages.get(this.config?.index);
      } else {
        page = this.pages.get(this.pages.keys().next().value);
      }
    }

    this.page = page;

    this.bindEvents();
  }

  public registerComponent(type: string, Component: any) {
    this.components.set(type, Component);
  }

  public unregisterComponent(type: string) {
    this.components.delete(type);
  }

  public resolveComponent(type: string) {
    return this.components.get(type);
  }

  public bindEvents() {
    if (!this.page) return;

    this.removeAllListeners();

    for (const [, value] of this.page.nodes) {
      value.events?.forEach((event) => this.bindEvent(event, `${value.data.id}`));
    }
  }

  public bindEvent(event: EventItemConfig, id: string) {
    const { name } = event;
    this.on(`${name}_${id}`, (fromCpt: Node, args?: EventArgs) => {
      this.eventHandler(event, fromCpt, args);
    });
  }

  public emit(name: string | symbol, node: any, args?: EventArgs): boolean {
    if (node?.data?.id) {
      return super.emit(`${String(name)}_${node.data.id}`, node, args);
    }
    return super.emit(name, node, args);
  }

  public eventHandler(eventConfig: EventItemConfig, fromCpt: any, args?: EventArgs) {
    if (!this.page) throw new Error('当前没有页面');

    const { action, to, page, method: methodName } = eventConfig;

    if (action === EventAction.COMPONENT_LINKAGE && to && methodName) {
      this.componentLinkageHandler(eventConfig, fromCpt, args);
    } else if (action === EventAction.ROUTE_SETTING && page) {
      setUrlParam('page', `${page}`);
    }
  }

  public destroy() {
    this.removeAllListeners();
    this.pages.clear();
  }

  private componentLinkageHandler(eventConfig: EventItemConfig, fromCpt: any, args?: EventArgs) {
    if (!this.page) throw new Error('当前没有页面');
    const { to, method: methodName } = eventConfig;
    if (!to || !methodName) {
      return;
    }
    const toNode = this.page.getNode(to);
    if (!toNode) {
      console.error(`ID为${to}的组件不存在`);
      return;
    }

    if (isCommonMethod(methodName)) {
      return triggerCommonMethod(methodName, toNode);
    }
    const props = calculateMethodProps({
      fromCpt,
      eventConfig,
      eventArgs: args,
      toCpt: toNode,
    });
    if (!toNode.instance) {
      this.addEventQueueMap({
        eventConfig,
        fromCpt,
        props,
      });
    } else if (toNode.instance.methods && typeof toNode.instance.methods[methodName] === 'function') {
      const method = toNode.instance.methods[methodName] as Callback;
      let methodProps: MethodProps = { fromCpt };
      if (method.__depends__) {
        methodProps = method.__depends__.reduce(
          (methodProps, dependKey: string) => ({ ...methodProps, [dependKey]: props?.[dependKey] }),
          methodProps
        );
      }
      method(methodProps);
    }
  }

  private addEventQueueMap(event: EventCache) {
    if (!event.eventConfig.to) {
      return;
    }
    if (this.eventQueueMap[event.eventConfig.to]) {
      this.eventQueueMap[event.eventConfig.to].push(event);
    } else {
      this.eventQueueMap[event.eventConfig.to] = [event];
    }
  }
}

export default App;
