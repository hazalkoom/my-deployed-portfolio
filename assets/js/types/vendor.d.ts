/**
 * Global Type Definitions
 * Type stubs for vendor libraries and global interfaces
 */

// Bootstrap
declare namespace Bootstrap {
  class Modal {
    constructor(element: HTMLElement, options?: Record<string, any>);
    show(): void;
    hide(): void;
    dispose(): void;
  }
}

declare function bootstrapModal(element: HTMLElement): Bootstrap.Modal;

// AOS (Animate On Scroll)
interface AOSOptions {
  duration?: number;
  offset?: number;
  delay?: number;
  once?: boolean;
  easing?: string;
  startEvent?: string;
}

declare namespace AOS {
  function init(options?: AOSOptions): void;
  function refresh(): void;
  function refreshHard(): void;
}

// Typed.js
interface TypedOptions {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  startDelay?: number;
  loop?: boolean;
  loopCount?: number;
  showCursor?: boolean;
  cursorChar?: string;
  attr?: string;
  bindInputFocusEvents?: boolean;
  contentType?: 'html' | 'null';
  onBegin?: (self: any) => void;
  onComplete?: (self: any) => void;
  preStringTyped?: (arrayPos: number, self: any) => void;
  onStringTyped?: (arrayPos: number, self: any) => void;
  onLastStringBackspaced?: (self: any) => void;
  onTypingPaused?: (arrayPos: number, self: any) => void;
  onTypingResumed?: (arrayPos: number, self: any) => void;
  onReset?: (self: any) => void;
  onStop?: (arrayPos: number, self: any) => void;
  onStart?: (arrayPos: number, self: any) => void;
  onDestroy?: (self: any) => void;
}

declare class Typed {
  constructor(element: string | HTMLElement, options: TypedOptions);
  destroy(): void;
  reset(): void;
}

// GLightbox
interface GLightboxOptions {
  selector?: string;
  selectText?: string;
  titlePosition?: 'top' | 'bottom';
  descPosition?: 'top' | 'bottom' | 'bottom-inside';
  zoomable?: boolean;
  draggable?: boolean;
  dragAutoSnap?: boolean;
  autoplayVideos?: boolean;
  keyboardNavigation?: boolean;
  closeButton?: boolean;
  loop?: boolean;
  width?: string | number;
  height?: string | number;
  html?: string;
  beforeSlideChange?: () => void;
  afterSlideChange?: () => void;
  beforeOpen?: () => void;
  afterOpen?: () => void;
  beforeClose?: () => void;
  afterClose?: () => void;
}

interface GLightboxInstance {
  open(source?: string | HTMLElement): void;
  close(): void;
  reload(): void;
  setElements(elements: Array<any>): void;
  nextSlide(): void;
  prevSlide(): void;
  goToSlide(index: number): void;
  destroy(): void;
}

declare function GLightbox(options?: GLightboxOptions): GLightboxInstance;

// Swiper
interface SwiperOptions {
  loop?: boolean;
  pagination?: {
    el?: string | HTMLElement;
    type?: 'bullets' | 'fraction' | 'progressbar' | 'custom';
    clickable?: boolean;
  };
  navigation?: {
    nextEl?: string | HTMLElement;
    prevEl?: string | HTMLElement;
  };
  autoplay?: boolean | { delay: number; disableOnInteraction?: boolean };
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
  speed?: number;
  spaceBetween?: number;
  slidesPerView?: number | 'auto';
  centeredSlides?: boolean;
  keyboard?: boolean;
  scrollbar?: {
    el?: string | HTMLElement;
    hide?: boolean;
    draggable?: boolean;
  };
  breakpoints?: Record<number, SwiperOptions>;
  on?: Record<string, Function>;
}

declare class Swiper {
  constructor(element: string | HTMLElement, options?: SwiperOptions);
  slideNext(): void;
  slidePrev(): void;
  slideTo(index: number, speed?: number, runCallbacks?: boolean): void;
  destroy(): void;
}

// Sentry
interface SentryOptions {
  dsn?: string;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
  attachStacktrace?: boolean;
  initialScope?: Record<string, any>;
  beforeSend?: (event: any, hint: any) => any;
  breadcrumbs?: Record<string, boolean>;
  [key: string]: any;
}

declare namespace Sentry {
  function init(options: SentryOptions): void;
  function captureException(error: Error | string): void;
  function captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void;
  function captureEvent(event: Record<string, any>): void;
  function setTag(key: string, value: string): void;
  function setUser(user: Record<string, any>): void;
}

// Web Vitals
interface Metric {
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

type MetricHandler = (metric: Metric) => void;

declare namespace webVitals {
  function getCLS(callback: MetricHandler): void;
  function getFCP(callback: MetricHandler): void;
  function getFID(callback: MetricHandler): void;
  function getLCP(callback: MetricHandler): void;
  function getTTFB(callback: MetricHandler): void;
}

// Global augmentation
declare global {
  interface Window {
    AOS: typeof AOS;
    Typed: typeof Typed;
    GLightbox: typeof GLightbox;
    Swiper: typeof Swiper;
    Sentry: typeof Sentry;
    webVitals?: typeof webVitals;
    PortfolioUtils?: any;
    gtag?: Function;
  }

  var gtag: Function | undefined;
}

export {};
