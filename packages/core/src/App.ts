import { EventEmitter } from 'events';

import {
  Callback,
  CodeBlockDSL,
  EventArgs,
  EventItemConfig,
  Id,
  MApp,
  MappingStruct,
  MethodProps,
  VariableSpace,
} from '@edoms/schema';

import Env from './Env';
import { bindCommonEventListener, isCommonMethod, triggerCommonMethod } from './events';
import type Node from './Node';
import Page from './Page';
import Store from './Store';
import { fillBackgroundImage, isNumber, style2Obj } from './utils';

interface AppOptionsConfig {
  ua?: string;
  config?: MApp;
  platform?: 'editor' | 'mobile' | 'tv' | 'pc';
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

class App extends EventEmitter {
  public env;
  public codeDsl: CodeBlockDSL | undefined;
  public pages = new Map<Id, Page>();

  public page: Page | undefined;

  public platform = 'mobile';
  public jsEngine = 'browser';
  public designWidth = 375;

  public components = new Map();

  public eventQueueMap: Record<string, EventCache[]> = {};

  public store = new Store();

  constructor(options: AppOptionsConfig) {
    super();

    this.env = new Env(options.ua);
    // 代码块描述内容在dsl codeBlocks字段
    this.codeDsl = options.config?.codeBlocks;
    options.platform && (this.platform = options.platform);
    options.jsEngine && (this.jsEngine = options.jsEngine);
    options.designWidth && (this.designWidth = options.designWidth);

    // 根据屏幕大小计算出跟节点的font-size，用于rem样式的适配
    if (this.platform === 'mobile' || this.platform === 'editor') {
      const calcFontsize = () => {
        const { width } = document.documentElement.getBoundingClientRect();
        const fontSize = width / (this.designWidth / 100);
        document.documentElement.style.fontSize = `${fontSize}px`;
      };

      calcFontsize();

      document.body.style.fontSize = '14px';

      globalThis.addEventListener('resize', calcFontsize);
    }

    if (options.transformStyle) {
      this.transformStyle = options.transformStyle;
    }

    options.config && this.setConfig(options.config, options.curPage);

    bindCommonEventListener(this);
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
      if (key === 'backgroundImage') {
        value && (results[key] = fillBackgroundImage(value));
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
        results[key] = value;
      }
    });

    return results;
  }

  /**
   * 设置dsl
   * @param config dsl跟节点
   * @param curPage 当前页面id
   */
  public setConfig(config: MApp, curPage?: Id) {
    this.codeDsl = config.codeBlocks;
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
      page = this.pages.get(this.pages.keys().next().value);
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
      this.eventHandler(event, fromCpt, this.calculateMethodProps(event, args));
    });
  }

  private calculateMethodProps(eventConfig: EventItemConfig, eventArgs?: EventArgs): MethodProps {
    const { mappings } = eventConfig;
    if (!mappings) {
      return {};
    }

    return mappings.reduce(
      (props, mapping: MappingStruct) => ({ ...props, [mapping.target]: computeTarge(mapping, eventArgs) }),
      {} as MethodProps
    );

    function computeTarge(mapping: MappingStruct, eventArgs?: EventArgs): any {
      const mappingClassify = {
        [VariableSpace.APP]: () => {},
        [VariableSpace.PAGE]: () => {},
        [VariableSpace.COMPONENT]: () => {},
        [VariableSpace.CONST]: () => mapping.const,
        [VariableSpace.EVENT]: () => mapping?.source && eventArgs?.[mapping?.source],
        [VariableSpace.EXPRESSION]: () => eval(mapping.expression ?? mapping.defaultExpression ?? ''),
        [VariableSpace.TEMPLATE]: () => {},
      };
      // 处理模板
      // if (Object.prototype.toString.call(vars) === '[object Object]') {
      //   const tmp: string = text;
      //   Object.entries(vars).forEach(([key, value]) => {
      //     tmp.value = tmp.value.replace(new RegExp(`{{${key}}}`, 'g'), value);
      //   });
      //   return tmp;
      // }
      if (!mappingClassify[mapping.sourceSpace] || !mappingClassify[mapping.sourceSpace]) {
        return mapping.defaultValue;
      }
      return mappingClassify[mapping.sourceSpace]();
    }
  }

  public emit(name: string | symbol, node: any, args?: EventArgs): boolean {
    if (node?.data?.id) {
      return super.emit(`${String(name)}_${node.data.id}`, node, args);
    }
    return super.emit(name, node, args);
  }

  public eventHandler(eventConfig: EventItemConfig, fromCpt: any, props?: MethodProps) {
    if (!this.page) throw new Error('当前没有页面');

    const { method: methodName, to } = eventConfig;

    const toNode = this.page.getNode(to);
    if (!toNode) throw `ID为${to}的组件不存在`;

    if (isCommonMethod(methodName)) {
      return triggerCommonMethod(methodName, toNode);
    }

    if (!toNode.instance) {
      this.addEventToMap({
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

  public destroy() {
    this.removeAllListeners();
    this.pages.clear();
  }

  private addEventToMap(event: EventCache) {
    if (this.eventQueueMap[event.eventConfig.to]) {
      this.eventQueueMap[event.eventConfig.to].push(event);
    } else {
      this.eventQueueMap[event.eventConfig.to] = [event];
    }
  }
}

export default App;
