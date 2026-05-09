# Mini Chess Widget

A tiny draggable chess widget for any website. It includes legal chess rules, a small local bot, board flipping for white or black, opening-book moves, and a post-game move review.

No framework is required.

## GitHub CDN Embed

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/domoro/mini-chess-widget@v0.1.0/dist/mini-chess-widget.css"
/>

<div
  data-floating-chess-widget
  data-title="mini chess"
  data-position="bottom-left"
  data-start-minimized="true"
  data-player-color="white"
  data-bot="tiny"
  data-bot-color="black"
  data-bot-depth="2"
  data-coach="false"
  data-board-light="#eeeed2"
  data-board-dark="#779954"
  data-font-family="Inter, system-ui, sans-serif"
  data-size="320px"
  data-shadow="0 18px 40px rgba(31, 42, 29, 0.14)"
></div>

<script src="https://cdn.jsdelivr.net/gh/domoro/mini-chess-widget@v0.1.0/dist/mini-chess-widget.js"></script>
```

## Custom Element

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/domoro/mini-chess-widget@v0.1.0/dist/mini-chess-widget.css" />

<mini-chess-widget
  title="mini chess"
  position="bottom-left"
  start-minimized="true"
  player-color="white"
  bot="tiny"
  bot-color="black"
  bot-depth="2"
  coach="false"
  board-light="#eeeed2"
  board-dark="#779954"
  font-family="Inter, system-ui, sans-serif"
  size="320px"
  shadow="0 18px 40px rgba(31, 42, 29, 0.14)"
></mini-chess-widget>

<script src="https://cdn.jsdelivr.net/gh/domoro/mini-chess-widget@v0.1.0/dist/mini-chess-widget.js"></script>
```

## npm-ready

```bash
npm install mini-chess-widget
```

```js
import "mini-chess-widget/style.css";
import "mini-chess-widget";

MiniChessWidget.create({
  target: document.querySelector("#chess"),
  title: "mini chess",
  position: "bottom-left",
  startMinimized: true,
  playerColor: "white",
  bot: "tiny",
  botColor: "black",
  botDepth: 2,
  coach: false,
  boardLight: "#eeeed2",
  boardDark: "#779954",
  fontFamily: "Inter, system-ui, sans-serif",
  size: "320px",
  shadow: "0 18px 40px rgba(31, 42, 29, 0.14)",
});
```

## Options

| JavaScript option | Data attribute | Custom element attribute | Default |
| --- | --- | --- | --- |
| `title` | `data-title` | `title` | `mini chess` |
| `position` | `data-position` | `position` | `bottom-right` |
| `startMinimized` | `data-start-minimized` | `start-minimized` | `false` |
| `playerColor` | `data-player-color` | `player-color` | `white` |
| `bot` | `data-bot` | `bot` | `none` |
| `botColor` | `data-bot-color` | `bot-color` | opposite player color |
| `botDepth` | `data-bot-depth` | `bot-depth` | `1` |
| `coach` | `data-coach` | `coach` | `false` |
| `boardLight` | `data-board-light` | `board-light` | `#eeeed2` |
| `boardDark` | `data-board-dark` | `board-dark` | `#779954` |
| `fontFamily` | `data-font-family` | `font-family` | `Lato, Arial, sans-serif` |
| `size` | `data-size` | `size` | `286px` |
| `shadow` | `data-shadow` | `shadow` | `0 18px 40px rgba(31, 42, 29, 0.14)` |
| `fen` | `data-fen` | `fen` | starting position |

Positions: `bottom-right`, `bottom-left`, `top-right`, `top-left`.

Bot modes: use `tiny` to enable the built-in bot, or `none` for local two-player play.

Board colors can be any valid CSS color, including hex, `rgb()`, `hsl()`, or named colors. JavaScript also accepts `lightSquareColor` and `darkSquareColor` as aliases for `boardLight` and `boardDark`.

The font can be any valid CSS font-family stack. JavaScript also accepts `font` as an alias for `fontFamily`.

Size can be a number in JavaScript, which is treated as pixels, or any valid CSS width such as `260px`, `20rem`, or `min(360px, 90vw)`. JavaScript also accepts `width` and `widgetWidth` as aliases for `size`.

Shadow can be any valid CSS `box-shadow` value. Use `shadow: "none"` for a flat widget. JavaScript also accepts `widgetShadow` as an alias.

## API

```js
const widget = MiniChessWidget.create({
  target: document.querySelector("#chess"),
  onMove(move) {
    console.log(move);
  },
});

widget.reset();
widget.destroy();
```

The global API is available as `MiniChessWidget`. `PocketChessWidget` and `FloatingChessWidget` are kept as aliases.

## Local Demo

Open `demo/index.html` in a browser, or serve this package folder with any static server.

```bash
npm run test
npm pack
```

The packed `.tgz` file can be installed into another project before npm publishing:

```bash
npm install ./mini-chess-widget-0.1.0.tgz
```

## GitHub Publishing

Create a public GitHub repository named `mini-chess-widget`, push this package folder, then tag the first release:

```bash
git tag v0.1.0
git push origin main --tags
```
