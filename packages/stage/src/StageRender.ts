import { EventBus, dom, url } from '@edoms/utils';

// import { getHost, injectStyle, isSameDomain } from '@tmagic/utils';

import StageCore from './StageCore';
import style from './style.css?raw';
import type { Runtime, RuntimeWindow, StageRenderConfig } from './types';

export default class StageRender extends EventBus {
  /** 组件的js、css执行的环境，直接渲染为当前window，iframe渲染则为iframe.contentWindow */
  public contentWindow: RuntimeWindow | null = null;

  public runtime: Runtime | null = null;

  public iframe?: HTMLIFrameElement;

  public runtimeUrl?: string;

  public core: StageCore;

  private render?: (renderer: StageCore) => Promise<HTMLElement> | HTMLElement;

  constructor({ core }: StageRenderConfig) {
    super();

    this.core = core;
    this.runtimeUrl = core.config.runtimeUrl || '';
    this.render = core.config.render;

    this.iframe = globalThis.document.createElement('iframe');
    // 同源，直接加载
    this.iframe.src = url.isSameDomain(this.runtimeUrl) ? this.runtimeUrl : '';
    this.iframe.style.cssText = `
      border: 0;
      width: 100%;
      height: 100%;
    `;

    this.iframe.addEventListener('load', this.loadHandler);
  }

  public getMagicApi = () => ({
    onPageElUpdate: (el: HTMLElement) => this.fire('page-el-update', el),
    onRuntimeReady: (runtime: Runtime) => {
      this.runtime = runtime;
      // @ts-ignore
      globalThis.runtime = runtime;
      this.fire('runtime-ready', runtime);
    },
  });

  /**
   * 挂载Dom节点
   * @param el 将页面挂载到该Dom节点上
   */
  public async mount(el: HTMLDivElement) {
    if (this.iframe) {
      if (this.runtimeUrl && !url.isSameDomain(this.runtimeUrl)) {
        // 不同域，使用srcdoc发起异步请求，需要目标地址支持跨域
        let html = await fetch(this.runtimeUrl).then((res) => res.text());
        // 使用base, 解决相对路径或绝对路径的问题
        const base = `${location.protocol}//${url.getHost(this.runtimeUrl)}`;
        html = html.replace('<head>', `<head>\n<base href="${base}">`);
        this.iframe.srcdoc = html;
      }

      el.appendChild<HTMLIFrameElement>(this.iframe);
    } else {
      throw Error('mount 失败');
    }
  }

  public getRuntime = (): Promise<Runtime> => {
    if (this.runtime) return Promise.resolve(this.runtime);
    return new Promise((resolve) => {
      const listener = (runtime: Runtime) => {
        this.off('runtime-ready', listener);
        resolve(runtime);
      };
      this.on('runtime-ready', listener);
    });
  };

  /**
   * 销毁实例
   */
  public destroy(): void {
    this.iframe?.removeEventListener('load', this.loadHandler);
    this.contentWindow = null;
    this.iframe?.remove();
    this.iframe = undefined;
    this.removeAllListeners();
  }

  private loadHandler = async () => {
    this.contentWindow = this.iframe?.contentWindow as RuntimeWindow;

    this.contentWindow.magic = this.getMagicApi();

    if (this.render) {
      const el = await this.render(this.core);
      if (el) {
        this.iframe?.contentDocument?.body?.appendChild(el);
      }
    }

    this.fire('onload');

    this.contentWindow.postMessage(
      {
        tmagicRuntimeReady: true,
      },
      '*'
    );

    dom.injectStyle(this.contentWindow.document, style);
  };
}
