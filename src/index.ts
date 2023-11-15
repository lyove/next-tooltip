import "./index.css";

/**
 * @desc Debounce
 * @param {function} fn
 * @param {number} delay
 * @param {Boolean} immediate
 */
function debounce(fn: () => any, delay: number, immediate: boolean) {
  if (typeof fn != "function") {
    throw new Error("fn is not a function");
  }
  let timer: any = null;
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer);
    }
    if (!timer && immediate) {
      fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}

/**
 * Throttle
 * @param {function} fn
 * @param {number} delay
 */
function throttle(fn: () => any, delay: number) {
  if (typeof fn != "function") {
    throw new Error("fn is not a function");
  }
  let pre = 0;
  let timer: any = null;
  return function (...args: any) {
    if (Date.now() - pre > delay) {
      clearTimeout(timer);
      timer = null;
      pre = Date.now();
      fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}

/**
 * Tooltip supported content
 */
type TooltipContent = HTMLElement | DocumentFragment | Node | string | null;

/**
 * Tooltip placement
 */
type Placement = "top" | "right" | "bottom" | "left";

/**
 * Base options interface for tooltips
 */
interface TooltipOptions {
  /**
   * Tooltip placement: top|bottom|left|right
   */
  placement?: Placement;

  /**
   * Tooltip top margin
   */
  marginTop?: number;

  /**
   * Tooltip left margin
   */
  marginLeft?: number;

  /**
   * Tooltip right margin
   */
  marginRight?: number;

  /**
   * Tooltip bottom margin
   */
  marginBottom?: number;

  /**
   * Timout before showing
   */
  delay?: number;
}

export type { TooltipOptions, TooltipContent };

/**
 *
 * Tiny any beautiful tooltips module.
 *
 * https://github.com/lyove/next-tooltip
 *
 * @author Lyove
 * @licence MIT
 */
export default class Tooltip {
  /**
   * Config options
   */
  private options: TooltipOptions = {
    placement: "top",
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    delay: 200,
  };

  /**
   * Tooltip classNames
   */
  private get classNames() {
    return {
      tooltip: "next-tooltip",
      contentClass: "next-tooltip--content",
      enterClass: "next-zoom-enter",
      leaveClass: "next-zoom-leave",
      shownClass: "next-tooltip--shown",
      hiddenClass: "next-tooltip--hidden",
      placementClass: {
        left: "next-tooltip--left",
        bottom: "next-tooltip--bottom",
        right: "next-tooltip--right",
        top: "next-tooltip--top",
      },
    };
  }

  /**
   * Module nodes
   */
  private nodes: {
    wrapper: HTMLElement | null;
    content: HTMLElement | null;
  } = {
    wrapper: null,
    content: null,
  };

  /**
   * Offset above the Tooltip
   */
  private offsetTop = 10;

  /**
   * Offset at the left from the Tooltip
   */
  private offsetLeft = 10;

  /**
   * Offset at the right from the Tooltip
   */
  private offsetRight = 10;

  /**
   * Store timeout before showing to clear it on hide
   */
  private showingTimeout: any;

  /**
   * Store timeout before hiding
   */
  private hidingTimeout: any;

  /**
   * mouse enter time
   */
  private enterTime = 0;

  /**
   * mouse leave time
   */
  private leaveTime = 0;

  /**
   * Module constructor
   */
  constructor() {
    this.loadStyles();
  }

  /**
   * Module Preparation method
   */
  private prepare() {
    const wrapNode = document.querySelectorAll(`.${this.classNames.tooltip}`);
    if (wrapNode?.length > 0) {
      wrapNode.forEach((item) => {
        item.parentNode?.removeChild(item);
      });
    }
    this.nodes.wrapper = this.createElement("div", [
      this.classNames.tooltip,
      this.classNames.hiddenClass,
    ]);
    this.nodes.content = this.createElement("div", this.classNames.contentClass);

    this.append(this.nodes.wrapper, this.nodes.content);
    this.append(document.body, this.nodes.wrapper);
  }

  /**
   * Mouseover/Mouseleave decorator
   *
   * @param {HTMLElement} trigger - target element to place Tooltip near that
   * @param {TooltipContent} content — any HTML Element of String that will be used as content
   * @param {TooltipOptions} options — Available options {@link TooltipOptions}
   */
  public onHover(trigger: HTMLElement, content: TooltipContent, options: TooltipOptions) {
    const placement = options.placement || this.options.placement;
    const delay = Number(options.delay) || this.options.delay || 100;
    const mergedOptions = {
      ...this.options,
      ...options,
      placement,
      delay,
    };

    trigger.addEventListener(
      "mouseenter",
      throttle(() => {
        this.show(trigger, content, mergedOptions);
      }, delay + 300),
    );

    trigger.addEventListener(
      "mouseleave",
      throttle(() => {
        this.hide(mergedOptions);
      }, delay + 300),
    );
  }

  /**
   * Show Tooltip near passed element with specified HTML content
   *
   * @param {HTMLElement} element - target element to place Tooltip near that
   * @param {TooltipContent} content — any HTML Element of String that will be used as content
   * @param {TooltipOptions} options — Available options {@link TooltipOptions}
   */
  public show(element: HTMLElement, content: TooltipContent, options: TooltipOptions) {
    if (!(element instanceof Node)) {
      throw new Error(
        `[Next Tooltip] Wrong type of «trigger». It should be an instance of Node. But ${typeof element} given.`,
      );
    }

    if (!this.nodes.wrapper) {
      this.prepare();
    }

    const { wrapper, content: curContent } = this.nodes;
    const { placement, delay = 100 } = options;
    const { shownClass, hiddenClass, enterClass, leaveClass, placementClass } = this.classNames;

    this.enterTime = Date.now();

    wrapper?.classList.remove(...Object.values(placementClass));

    // content
    if (curContent instanceof HTMLElement) {
      curContent.innerHTML = "";
    }
    if (typeof content === "string") {
      const htmlNode = document.createElement("div");
      htmlNode.innerHTML = content;
      curContent?.appendChild(htmlNode);
    } else if (content instanceof Node) {
      curContent?.appendChild(content);
    }

    // placement
    switch (placement) {
      case "top":
        this.placeTop(element);
        break;

      case "left":
        this.placeLeft(element);
        break;

      case "right":
        this.placeRight(element);
        break;

      case "bottom":
      default:
        this.placeBottom(element);
        break;
    }

    const duration = this.leaveTime - Date.now();
    if (duration < delay && this.hidingTimeout) {
      clearTimeout(this.hidingTimeout);
      wrapper?.classList.remove(leaveClass);
    }

    wrapper?.classList.remove(hiddenClass);

    // add animation class
    wrapper?.classList.add(enterClass);

    this.showingTimeout = setTimeout(() => {
      wrapper?.classList.remove(enterClass);
      wrapper?.classList.add(shownClass);
    }, delay);
  }

  /**
   * Hide toolbox tooltip and clean content
   * @param {TooltipOptions} options — Available options {@link TooltipOptions}
   */
  public hide(options: TooltipOptions = {}) {
    const { wrapper } = this.nodes;
    const { delay = this.options.delay || 100 } = options;
    const { shownClass, hiddenClass, leaveClass } = this.classNames;

    this.leaveTime = Date.now();

    if (Date.now() - this.enterTime < delay && this.showingTimeout) {
      clearTimeout(this.showingTimeout);
    }

    wrapper?.classList.remove(shownClass);

    // add animation class
    wrapper?.classList.add(leaveClass);

    this.hidingTimeout = setTimeout(() => {
      wrapper?.classList.remove(leaveClass);
      wrapper?.classList.add(hiddenClass);
      this.destroy();
    }, delay);
  }

  /**
   * Release DOM and event listeners
   */
  public destroy() {
    const { wrapper } = this.nodes;
    if (wrapper && document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
    this.nodes = {
      wrapper: null,
      content: null,
    };
  }

  /**
   * Append css file
   */
  private loadStyles() {
    const id = "next-tooltip-style";

    if (document.getElementById(id)) {
      return;
    }

    const styles = new URL("./index.css", import.meta.url);
    const tag = this.createElement("style", "", {
      textContent: styles.toString(),
      id,
    });

    /**
     * Append styles at the top of HEAD tag
     */
    this.prepend(document.head, tag);
  }

  /**
   * Calculates element coords and moves tooltip bottom of the element
   *
   * @param {HTMLElement} element
   */
  private placeBottom(element: HTMLElement) {
    const { wrapper } = this.nodes;
    if (wrapper instanceof HTMLElement) {
      const elementRect = element.getBoundingClientRect();
      const left = elementRect.left + element.clientWidth / 2 - wrapper.offsetWidth / 2;
      const top =
        elementRect.bottom + window.scrollY + this.offsetTop + (this.options?.marginTop || 0);

      this.applyPlacement("bottom", left, top);
    }
  }

  /**
   * Calculates element coords and moves tooltip top of the element
   *
   * @param {HTMLElement} element
   */
  private placeTop(element: HTMLElement) {
    const { wrapper } = this.nodes;
    if (wrapper instanceof HTMLElement) {
      const elementRect = element.getBoundingClientRect();
      const left = elementRect.left + element.clientWidth / 2 - wrapper.offsetWidth / 2;
      const top = elementRect.top + window.scrollY - wrapper.clientHeight - this.offsetTop;

      this.applyPlacement("top", left, top);
    }
  }

  /**
   * Calculates element coords and moves tooltip left of the element
   *
   * @param {HTMLElement} element
   */
  private placeLeft(element: HTMLElement) {
    const { wrapper } = this.nodes;
    if (wrapper instanceof HTMLElement) {
      const elementRect = element.getBoundingClientRect();
      const left =
        elementRect.left - wrapper.offsetWidth - this.offsetLeft - (this.options.marginLeft || 0);
      const top =
        elementRect.top + window.scrollY + element.clientHeight / 2 - wrapper.offsetHeight / 2;

      this.applyPlacement("left", left, top);
    }
  }

  /**
   * Calculates element coords and moves tooltip right of the element
   *
   * @param {HTMLElement} element
   * @param {TooltipOptions} showingOptions
   */
  private placeRight(element: HTMLElement) {
    const { wrapper } = this.nodes;
    if (wrapper instanceof HTMLElement) {
      const elementRect = element.getBoundingClientRect();
      const left = elementRect.right + this.offsetRight + (this.options.marginRight || 0);
      const top =
        elementRect.top + window.scrollY + element.clientHeight / 2 - wrapper.offsetHeight / 2;

      this.applyPlacement("right", left, top);
    }
  }

  /**
   * Set wrapper position
   */
  private applyPlacement(place: Required<TooltipOptions>["placement"], left: number, top: number) {
    const { wrapper } = this.nodes;
    if (wrapper instanceof HTMLElement) {
      wrapper.classList.add(this.classNames.placementClass[place]);
      wrapper.style.left = `${left}px`;
      wrapper.style.top = `${top}px`;
    }
  }

  /**
   * Helper for making Elements with classname and attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of classname
   * @param  {Object} attributes        - any attributes
   * @return {HTMLElement}
   */
  private createElement(
    tagName: string,
    classNames: string | string[],
    attributes = {},
  ): HTMLElement {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    Object.entries(attributes).forEach(([key, val]) => val && el.setAttribute(key, `${val}`));

    return el;
  }

  /**
   * Append one or several elements to the parent
   *
   * @param  {Element|DocumentFragment} parent    - where to append
   * @param  {Element|Element[]} elements - element or elements list
   */
  private append(
    parent: Element | DocumentFragment,
    elements: Element | Element[] | DocumentFragment,
  ) {
    if (Array.isArray(elements)) {
      elements.forEach((el) => parent.appendChild(el));
    } else {
      parent.appendChild(elements);
    }
  }

  /**
   * Append element or a couple to the beginning of the parent elements
   *
   * @param {Element} parent - where to append
   * @param {Element|Element[]} elements - element or elements list
   */
  private prepend(parent: Element, elements: Element | Element[]) {
    if (Array.isArray(elements)) {
      elements = elements.reverse();
      elements.forEach((el) => parent.prepend(el));
    } else {
      parent.prepend(elements);
    }
  }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = new Tooltip();
} else {
  (window as any).NextTooltip = new Tooltip();
}
