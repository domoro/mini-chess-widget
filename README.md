# Mini Chess Widget

A tiny, themeable, dependency-free chess widget for any website.

## Play

Drop a floating chess board into a static site, blog, portfolio, or app. The widget is draggable, responsive, and can start minimized so it stays out of the way until someone wants to play.

## Review

Mini Chess Widget includes legal chess rules, board flipping for white or black, opening-book moves, and a post-game move review. It does not call a chess API or cloud engine; the bot is a tiny local browser engine that uses an opening book plus a lightweight minimax-style search.

## Theme

Board colors, font, size, and shadow can be changed with attributes, data attributes, JavaScript options, or CSS variables.

```html
<mini-chess-widget
  bot="tiny"
  board-light="#eeeed2"
  board-dark="#779954"
  font-family="Inter, system-ui, sans-serif"
  size="320px"
  shadow="0 18px 40px rgba(31, 42, 29, 0.14)"
></mini-chess-widget>
```

## Install

Add the stylesheet in your page `<head>`.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/domoro/mini-chess-widget@v0.1.0/dist/mini-chess-widget.css"
/>
```

Add the script before the closing `</body>` tag.

```html
<script src="https://cdn.jsdelivr.net/gh/domoro/mini-chess-widget@v0.1.0/dist/mini-chess-widget.js"></script>
```

Then choose one of the usage patterns below.

## Usage

### Custom Element

Best for static sites, blogs, and normal HTML pages. Put this anywhere inside `<body>`, usually near the end of the page.

```html
<mini-chess-widget bot="tiny"></mini-chess-widget>
```

Full example:

```html
<mini-chess-widget
  title="mini chess"
  position="bottom-left"
  start-minimized="true"
  player-color="white"
  bot="tiny"
  bot-color="black"
  bot-depth="2"
></mini-chess-widget>
```

Or tell your agent:

```txt
Add Mini Chess Widget to my page. Put the stylesheet in <head>, the script before </body>, and place <mini-chess-widget bot="tiny"></mini-chess-widget> near the end of <body>.
```

### Data Attribute Embed

Best for site builders, CMS pages, or places where custom elements are awkward. Put this `div` inside `<body>`.

```html
<div
  data-floating-chess-widget
  data-title="mini chess"
  data-position="bottom-left"
  data-start-minimized="true"
  data-bot="tiny"
></div>
```

### JavaScript API

Best for apps that want to mount or destroy the widget manually. Add a target element in `<body>`.

```html
<div id="chess"></div>
```

Then run this after the widget script has loaded.

```js
MiniChessWidget.create({
  target: document.querySelector("#chess"),
  title: "mini chess",
  position: "bottom-left",
  startMinimized: true,
  playerColor: "white",
  bot: "tiny",
  botDepth: 2,
  onMove(move) {
    console.log(move);
  },
});
```

## API Reference

### `<mini-chess-widget />`

| Attribute | Type | Description |
| --- | --- | --- |
| `title` | `string` | Header label. Default: `mini chess` |
| `position` | `bottom-right \| bottom-left \| top-right \| top-left` | Starting corner. Default: `bottom-right` |
| `start-minimized` | `boolean` | Start as a small collapsed bar. Default: `false` |
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
  board-light="#f0d9b5"
  board-dark="#6a994e"
  font-family="Georgia, serif"
  size="300px"
  shadow="none"
></mini-chess-widget>
```

Or override CSS custom properties after loading the widget stylesheet:

```css
.fcw-root {
  --fcw-board-light: #f0d9b5;
  --fcw-board-dark: #6a994e;
  --fcw-font-family: Inter, system-ui, sans-serif;
  --fcw-widget-width: 320px;
  --fcw-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
}
```

| Variable | Default | Description |
| --- | --- | --- |
| `--fcw-board-light` | `#eeeed2` | Light squares |
| `--fcw-board-dark` | `#779954` | Dark squares |
| `--fcw-font-family` | `Lato, Arial, sans-serif` | Widget UI font |
| `--fcw-widget-width` | `286px` | Open widget width |
| `--fcw-shadow` | `0 18px 40px rgba(31, 42, 29, 0.14)` | Panel shadow |

## Accessibility

- The board uses grid semantics.
- Squares are buttons with coordinate labels.
- Review navigation supports previous and next controls.
- The widget is keyboard-friendly for reviewing completed games.

## Local Demo

Open `demo/index.html` in a browser.

## License

MIT
