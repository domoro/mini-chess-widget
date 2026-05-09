# Mini Chess Widget

A tiny, themeable, dependency-free chess widget for any website.

It includes legal chess rules, board flipping, a tiny local browser bot, opening-book moves, and post-game review. It does not call a chess API or cloud engine.

## Install

### npm

```bash
npm install mini-chess-widget
```

```js
import "mini-chess-widget/style.css";
import "mini-chess-widget";
```

### CDN

Add the stylesheet in your page `<head>`.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/domoro/mini-chess-widget@v0.1.1/dist/mini-chess-widget.css"
/>
```

Add the script before the closing `</body>` tag.

```html
<script src="https://cdn.jsdelivr.net/gh/domoro/mini-chess-widget@v0.1.1/dist/mini-chess-widget.js"></script>
```

## Usage

### Custom Element

Put this anywhere inside `<body>`, usually near the end of the page.

```html
<mini-chess-widget bot="tiny"></mini-chess-widget>
```

```html
<mini-chess-widget
  title="mini chess"
  position="bottom-left"
  start-minimized="true"
  player-color="white"
  bot="tiny"
  bot-color="black"
  bot-depth="2"
  board-light="#eeeed2"
  board-dark="#779954"
  font-family="Lato, Arial, sans-serif"
  size="286px"
  shadow="0 18px 40px rgba(31, 42, 29, 0.14)"
></mini-chess-widget>
```

### Data Attribute Embed

Use this for site builders or CMS pages where custom elements are awkward.

```html
<div
  data-floating-chess-widget
  data-title="mini chess"
  data-position="bottom-left"
  data-start-minimized="true"
  data-bot="tiny"
  data-board-light="#eeeed2"
  data-board-dark="#779954"
  data-font-family="Lato, Arial, sans-serif"
  data-size="286px"
  data-shadow="0 18px 40px rgba(31, 42, 29, 0.14)"
></div>
```

### JavaScript

```html
<div id="chess"></div>
```

```js
MiniChessWidget.create({
  target: document.querySelector("#chess"),
  title: "mini chess",
  position: "bottom-left",
  startMinimized: true,
  playerColor: "white",
  bot: "tiny",
  botDepth: 2,
  boardLight: "#eeeed2",
  boardDark: "#779954",
  fontFamily: "Lato, Arial, sans-serif",
  size: "286px",
  shadow: "0 18px 40px rgba(31, 42, 29, 0.14)",
  onMove(move) {
    console.log(move);
  },
});
```

## API

### `<mini-chess-widget />`

| Attribute | Type | Description |
| --- | --- | --- |
| `title` | `string` | Header label. Default: `mini chess` |
| `position` | `bottom-right \| bottom-left \| top-right \| top-left` | Starting corner. Default: `bottom-right` |
| `start-minimized` | `boolean` | Start as a collapsed bar. Default: `false` |
| `player-color` | `white \| black` | Human side and board orientation. Default: `white` |
| `bot` | `tiny \| none` | Enable the built-in browser bot. Default: `none` |
| `bot-color` | `white \| black` | Bot side. Default: opposite player color |
| `bot-depth` | `number` | How far the bot searches. `2` is a good default |
| `coach` | `boolean` | Reserved for coach/review display. Default: `false` |
| `fen` | `string` | Optional starting position |

### `MiniChessWidget.create(options)`

```js
const widget = MiniChessWidget.create({
  target: document.querySelector("#chess"),
  bot: "tiny",
});

widget.reset();
widget.destroy();
```

The global API is available as `MiniChessWidget`. `PocketChessWidget` and `FloatingChessWidget` are kept as aliases.

## Theming

Use attributes:

```html
<mini-chess-widget
  board-light="#eeeed2"
  board-dark="#779954"
  font-family="Lato, Arial, sans-serif"
  size="286px"
  shadow="0 18px 40px rgba(31, 42, 29, 0.14)"
></mini-chess-widget>
```

`board-dark` also controls the widget accent color by default, including the title, board border, active buttons, and review controls.

Or override CSS custom properties after loading the widget stylesheet:

```css
.fcw-root {
  --fcw-board-light: #eeeed2;
  --fcw-board-dark: #779954;
  --fcw-font-family: Lato, Arial, sans-serif;
  --fcw-widget-width: 286px;
  --fcw-shadow: 0 18px 40px rgba(31, 42, 29, 0.14);
}
```

| Variable | Default | Description |
| --- | --- | --- |
| `--fcw-board-light` | `#eeeed2` | Light squares |
| `--fcw-board-dark` | `#779954` | Dark squares |
| `--fcw-green` | `var(--fcw-board-dark)` | Active button and accent fill |
| `--fcw-green-deep` | `var(--fcw-board-dark)` | Title, board border, and control text |
| `--fcw-font-family` | `Lato, Arial, sans-serif` | Widget UI font |
| `--fcw-widget-width` | `286px` | Open widget width |
| `--fcw-shadow` | `0 18px 40px rgba(31, 42, 29, 0.14)` | Panel shadow |

## Accessibility

- The board uses grid semantics.
- Squares are buttons with coordinate labels.
- Review navigation supports previous and next controls.
- The widget is keyboard-friendly for reviewing completed games.
