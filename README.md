# 📦 NextTooltip

Tiny tooltip library

[![Edit new](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/next-tooltip-rvctui)

## ⭐️ Features

- Hybrid support - CommonJS and ESM modules
- IIFE bundle for direct browser support without bundler
- Typings bundle
- ESLint - scripts linter
- Stylelint - styles linter
- Prettier - formatter
- Jest - test framework
- Husky + lint-staged - pre-commit git hook set up for formatting

### Future plans
a powerful and flexible tooltip pure JS library based on next-popover

## 📦 Getting Started

### 💎 npm

```
import NextTooltip from 'next-tooltip';

NextTooltip.onHover(item, "<p>next tooltip</p>", {
  placement: "top",
});
```

### 🚀 cdn

```
<link rel="stylesheet" href="https://unpkg.com/next-tooltip@latest/dist/style.css">
<script src="https://unpkg.com/next-tooltip@latest/dist/next-tooltip.umd.js"></script>

const { NextTooltip } = window;

NextTooltip.onHover(item, "<p>next tooltip</p>", {
  placement: "top",
});
```

## ✅ About

- [Next-Tooltip](https://github.com/lyove/next-tooltip) - Next-Tooltip
