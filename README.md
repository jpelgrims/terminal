# Terminal

[**Documentation**]() | [**Examples**]()

---

**Terminal is your one-stop shop for building graphical terminal applications.**

* **Intuitive**: No need to mess around with ANSI escape sequences anymore
* **Fast**: Optimized rendering enables dynamic graphics in the terminal
* **Featureful**: All the functionality you expect is there, and more!

## Features

* **Optimized rendering**: Terminal drawing operations are queued and then applied all at once on terminal refresh. Double buffering is used to only redraw dirty (i.e. changed) cells.
* **24-bit true color support**: Use the full RGB range of colors in your application.
* **Canvas API**: Draw pixels, shapes and images on the terminal. Vertical resoluton is doubled by using half-block unicode characters.

## Usage

```typescript
import { Terminal, TerminalCanvas, Colors } from "https://deno.land/x/terminal@0.1.0-dev.1/src/mod.ts";

// The terminal canvas layer allows for direct interaction with the terminal
const terminal = new Terminal();
terminal.initialize();
terminal.setCell(3, 4, "!", Colors.WHITE, Colors.BLACK);
terminal.refresh();

// Don't want to work with a terminal-centric API? Use the canvas layer to work directly with pixels and images
const canvas = new TerminalCanvas();
canvas.drawPixel(2, 4, Colors.RED);
canvas.drawImage(4, 5, img);
canvas.render();
```

The library consists of two interfaces: the `Terminal` interface and the `TerminalCanvas` interface.

The `Terminal` interface provides gives you direct access to the terminal. It provides functions to clear the screen, modify terminal cells and grab incoming terminal input events.

* `Terminal.initialize`: Initialize the terminal.
* `Terminal.setCell`: Modify a terminal cell
* `Terminal.refresh`: Flush everything to the terminal
* `Terminal.close`: Close the terminal. It's important to always call this, because otherwise the terminal you're running on may be left in an unusable state.

The `TerminalCanvas` is a wrapper of the `Terminal` that provides a canvas-like API for pixel-based drawing operations.

* `TerminalCanvas.drawPixel`: Draw a pixel
* `TerminalCanvas.drawLine`: Draw a line
* `TerminalCanvas.drawRectangle`: Draw a (filled) rectangle
* `TerminalCanvas.drawPath`: Draw a path between a series of points
* `TerminalCanvas.drawShape`: Draw a (filled) shape
* `TerminalCanvas.drawImage`: Draw an image
* `TerminalCanvas.render`: Flush everything to the screen.

Want to know more? Take a look at the [documentation](), or go directly to the [examples]() to get started.

## Installation

No installation is required, just import the features you want directly from the deno.land url where the library is hosted:

```typescript
import { Terminal } from "https://deno.land/x/terminal@0.1.0-dev.1/src/mod.ts";
```