:root {
  --nt-color-bg: #1d202b;
  --nt-color-font: #cdd1e0;
}

.next-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  border-radius: 9px;
  box-shadow: 0 8px 12px 0 rgba(29, 32, 43, 0.17), 0 4px 5px -3px rgba(5, 6, 12, 0.49);
  z-index: 999;
}

/* arrow */
.next-tooltip::before {
  content: "";
  position: absolute;
  height: 10px;
  width: 10px;
  background-color: var(--nt-color-bg);
  z-index: -1;
}

/* content */
.next-tooltip::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: var(--nt-color-bg);
  border-radius: 4px;
  z-index: -1;
}

.next-tooltip--content {
  color: var(--nt-color-font);
  line-height: 1em;
  padding: 6px 10px;
  text-align: center;
}

.next-tooltip--bottom {
  /* transform: translateY(5px); */
}

.next-tooltip--bottom::before {
  left: 50%;
  top: -4px;
  transform: translateX(-50%) rotate(-45deg);
}

.next-tooltip--top {
  /* transform: translateY(-5px); */
}

.next-tooltip--top::before {
  bottom: -4px;
  left: 50%;
  top: auto;
  transform: translateX(-50%) rotate(-45deg);
}

.next-tooltip--left {
  /* transform: translateX(-5px); */
}

.next-tooltip--left::before {
  left: auto;
  right: 0;
  top: 50%;
  transform: translate(41.6%, -50%) rotate(-45deg);
}

.next-tooltip--right {
  /* transform: translateX(5px); */
}

.next-tooltip--right::before {
  left: 0;
  top: 50%;
  transform: translate(-41.6%, -50%) rotate(-45deg);
}

.next-tooltip--shown {
  opacity: 1;
  transition-duration: .1s;
  /* transform: none; */
}

.next-tooltip--hidden {
  /* display: none; */
  opacity: 0;
}

/* 
 * Animation
 ------------------------------------- */

.next-zoom-enter,
.next-zoom-leave {
  animation-duration: 0.1s;
  animation-fill-mode: both;
  animation-play-state: paused;
}

.next-zoom-enter {
  animation-name: nextZoomIn;
  animation-play-state: running;
  transform: scale(0);
  opacity: 0;
  animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
}

.next-zoom-leave {
  animation-name: nextZoomOut;
  animation-play-state: running;
  animation-timing-function: cubic-bezier(0.78, 0.14, 0.15, 0.86);
  pointer-events: none;
}

@keyframes nextZoomIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes nextZoomOut {
  0% {
    transform: scale(1);
  }

  to {
    transform: scale(0.8);
    opacity: 0;
  }
}
