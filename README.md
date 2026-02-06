# Emscripten Online

A web-based, client side, Emscripten development environment with code editor, HTML preview, and integrated terminal.

![Emscripten Online Screenshot](https://placehold.co/800x450/333333/FFFFFF?text=Emscripten+Online)

## Features

- Monaco Editor (VS Code editor)
- Real-time HTML preview
- Integrated terminal (xterm.js)
- Resizable panels (SplitGrid)

## Installation & Development

Use [just](https://github.com/casey/just) and `make` to run commands (install them with any package manager).

```bash
just dev
```

### Build

```bash
just build
```

### Other useful commands:

- Preview the build: `just preview`
- Lint the code: `just lint`
- Format the code: `just format`
- Build cpython: `just build-cpython`
