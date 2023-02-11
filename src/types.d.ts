/**
 * Tooltip supported content
 */
type TooltipContent = HTMLElement | DocumentFragment | Node | string;

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

  /**
   * Timout before hiding
   */
  hidingDelay?: number;
}

export type { TooltipOptions, TooltipContent };
