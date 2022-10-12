import { dom, EventBus, throttle } from '@edoms/utils';
import { createMaskContent, createWrapper } from './utils';
import Workshop from './WorkShop';
import { Mode, MouseButton } from './enum';

const throttleTime = 100;

class Mask extends EventBus {
  public workshop: Workshop;
  public wrapper: HTMLDivElement;

  public content: HTMLDivElement = createMaskContent();
  public wrapperWidth: number = 0;
  public wrapperHeight: number = 0;
  public width: number = 0;
  public height: number = 0;
  public scrollTop: number = 0;
  public scrollLeft: number = 0;
  public maxScrollTop: number = 0;
  public maxScrollLeft: number = 0;
  public shiftKeyDown: Boolean = false;

  public page: HTMLElement | null = null;
  public scrollParent: HTMLElement | null = null;

  private mode: Mode = Mode.ABSOLUTE;
  private pageResizeObserver: ResizeObserver | null = null; // 监听page盒子或边框盒子尺寸变化
  private wrapperResizeObserver: ResizeObserver | null = null; // 监听wrapper盒子或边框盒子尺寸变化
  public intersectionObserver: IntersectionObserver | null = null; // 异步观察目标元素与祖先元素或顶级视窗交叉状态的方法

  constructor(workshop: Workshop) {
    super();

    this.workshop = workshop;
    this.wrapper = createWrapper();

    this.wrapper.appendChild(this.content);
    this.content.addEventListener('mousedown', this.mouseDownHandler);
    this.content.addEventListener('wheel', this.mouseWheelHandler);
    this.content.addEventListener('mousemove', this.highlightHandler);
    this.content.addEventListener('mouseleave', this.mouseLeaveHandler);
    globalThis.document.addEventListener('keydown', (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.shiftKey) {
        this.shiftKeyDown = true;
      }
    });
    globalThis.document.addEventListener('keyup', (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.shiftKey) {
        this.shiftKeyDown = false;
      }
    });
  }

  private highlightHandler = throttle((event: MouseEvent): void => {
    this.fire('highlight', event);
  }, throttleTime);

  private mouseDownHandler = (event: MouseEvent): void => {
    this.fire('clearHighlight');
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (![MouseButton.LEFT, MouseButton.RIGHT].includes(event.button)) {
      return;
    }

    if (!this.shiftKeyDown && (event.target as HTMLDivElement).className.indexOf('moveable-area') !== -1) {
      return;
    }

    if ((event.target as HTMLDivElement).className.indexOf('moveable-control') !== -1) {
      return;
    }

    this.content.removeEventListener('mousemove', this.highlightHandler);

    if (this.shiftKeyDown) {
      this.fire('beforeMultiSelect', event);
    } else {
      this.fire('beforeSelect', event);
      globalThis.document.addEventListener('mouseup', this.mouseUpHandler);
    }
  };

  private mouseUpHandler = (): void => {
    globalThis.document.removeEventListener('mouseup', this.mouseUpHandler);
    this.content.addEventListener('mousemove', this.highlightHandler);
    this.fire('select');
  };

  private mouseWheelHandler = (event: WheelEvent): void => {
    this.fire('clearHighlight');
    if (!this.page) {
      throw new Error('page is not exist');
    }

    const { deltaX, deltaY } = event;

    if (this.page.clientHeight < this.wrapperHeight && deltaY) {
      return;
    }

    if (this.page.clientWidth < this.wrapperWidth && deltaX) {
      return;
    }

    if (this.maxScrollTop > 0) {
      this.scrollTop = this.scrollTop + deltaY;
    }

    if (this.maxScrollLeft > 0) {
      this.scrollLeft = this.scrollLeft + deltaX;
    }

    this.scroll();
    this.fire('scroll', event);
  };

  private mouseLeaveHandler = (): void => {
    setTimeout(() => this.fire('clearHighlight'), throttleTime);
  };

  public mount(element: HTMLDivElement): void {
    if (!this.content) {
      throw new Error('This content is not exist');
    }
    element.appendChild(this.wrapper);
  }

  public destroy(): void {
    this.content?.remove();
    this.page = null;
    this.scrollParent = null;
    this.pageResizeObserver?.disconnect();
    this.wrapperResizeObserver?.disconnect();
    this.content.removeEventListener('mouseleave', this.mouseLeaveHandler);
  }

  public setLayout(element: HTMLElement): void {
    this.setMode(dom.isFixedParent(element) ? Mode.FIXED : Mode.ABSOLUTE);
  }

  public setMode(mode: Mode): void {
    this.mode = mode;
    if (mode === Mode.FIXED) {
      this.content.style.width = `${this.wrapperWidth}px`;
      this.content.style.height = `${this.wrapperHeight}px`;
    } else {
      this.content.style.width = `${this.width}px`;
      this.content.style.height = `${this.height}px`;
    }
  }

  public observe(page: HTMLElement): void {
    if (!page) {
      return;
    }

    this.page = page;
    this.scrollParent =
      dom.getScrollParent(page) || this.workshop.renderer.contentWindow?.document.documentElement || null;
    this.pageResizeObserver?.disconnect();
    this.wrapperResizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const { target, intersectionRatio } = entry;
            if (intersectionRatio <= 0) {
              this.scrollIntoView(target);
            }
            this.intersectionObserver?.unobserve(target);
          });
        },
        {
          root: this.scrollParent, // 监听对象
          rootMargin: '0px', // 计算交叉时添加到根边界盒的偏移量，有效的缩小或扩大根的判定范围从而满足需求，例如：rootMargin: 10px表示相距10px时触发监听
          threshold: 1.0, // 阈值，表示交叉区域与边界区域的比率，当监听对象的任何阈值被超越时，都会通知监听。
        }
      );
    }

    if (typeof ResizeObserver !== 'undefined') {
      this.pageResizeObserver = new ResizeObserver((entries) => {
        const [entry] = entries;
        const { clientHeight, clientWidth } = entry.target;
        this.setWidth(clientWidth);
        this.setHeight(clientHeight);
        this.scroll();
      });

      this.pageResizeObserver.observe(page);

      this.wrapperResizeObserver = new ResizeObserver((entries) => {
        const [entry] = entries;
        const { clientHeight, clientWidth } = entry.target;
        this.wrapperWidth = clientWidth;
        this.wrapperHeight = clientHeight;
        this.fixMaxScrollLeft();
        this.fixMaxScrollTop();
      });

      this.wrapperResizeObserver.observe(this.wrapper);
    }
  }

  public watch(page: HTMLElement): void {
    if (!page) {
      return;
    }

    this.page = page;
    this.scrollParent =
      dom.getScrollParent(page) || this.workshop.renderer.contentWindow?.document.documentElement || null;
  }

  public scrollIntoView(element: Element): void {
    element.scrollIntoView();
    if (!this.scrollParent) {
      return;
    }
    this.scrollLeft = this.scrollParent.scrollLeft;
    this.scrollTop = this.scrollParent.scrollTop;
    this.scroll();
  }

  private scroll() {
    this.fixScrollValue();
    if (this.scrollParent) {
      this.scrollParent.scrollTo({
        top: this.scrollTop,
        left: this.scrollLeft,
      });
    }
    let scrollTop = this.scrollTop;
    let scrollLeft = this.scrollLeft;
    if (this.mode === Mode.FIXED) {
      scrollLeft = 0;
      scrollTop = 0;
    }
    this.scrollTo(scrollLeft, scrollTop);
  }

  private scrollTo(scrollLeft: number, scrollTop: number): void {
    this.content.style.transform = `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`;
  }

  private fixScrollValue(): void {
    this.scrollTop = Math.min(Math.max(0, this.scrollTop), this.maxScrollTop);
    this.scrollLeft = Math.min(Math.max(0, this.scrollLeft), this.maxScrollLeft);
  }

  private setWidth(width: number): void {
    this.width = width;
    this.content.style.width = `${width}px`;
  }

  private setHeight(height: number): void {
    this.height = height;
    this.content.style.height = `${height}px`;
  }

  private fixMaxScrollLeft(): void {
    this.maxScrollLeft = Math.max(this.width - this.wrapperWidth, 0);
  }

  private fixMaxScrollTop(): void {
    this.maxScrollTop = Math.max(this.height - this.wrapperHeight, 0);
  }
}

export default Mask;
