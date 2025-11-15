# generator-pptb

Yeoman generator for creating Power Platform Tool Box (PPTB) tools with TypeScript.

[![npm Version](https://img.shields.io/npm/v/generator-pptb)](https://www.npmjs.com/package/generator-pptb)
[![GitHub License](https://img.shields.io/github/license/PowerPlatformToolBox/generator-pptb)](https://github.com/PowerPlatformToolBox/generator-pptb?tab=GPL-3.0-1-ov-file)

## Quick Start

Install Yeoman and the PPTB generator globally:

```bash
npm install -g yo generator-pptb
```

Create a new PPTB tool:

```bash
yo pptb
```

Or create in a specific directory:

```bash
yo pptb my-tool-name
```

If you do not want to download Yeoman and PPTB Generator globally you can run the below command:

```bash
npx --package yo --package generator-pptb -- yo pptb
```

## What is Power Platform Tool Box?

Power Platform Tool Box (PPTB) is a framework for building custom tools that integrate with Microsoft Power Platform. This generator helps you quickly scaffold new PPTB tools with best practices and modern development tooling.

## Features

- 🚀 **Quick scaffolding** - Generate a complete PPTB tool project in seconds
- 🎨 **Multiple frameworks** - Choose from HTML/TypeScript, React, Vue, or Svelte
- 📦 **TypeScript support** - Full TypeScript integration with type definitions
- 🔥 **Modern tooling** - Vite for fast development (React, Vue, Svelte)
- 🎯 **Best practices** - Based on official PPTB sample tools
- 📝 **Pre-configured** - Includes tsconfig, build scripts, and development setup

## Tool Types

The generator supports four different tool types:

### 1. HTML with TypeScript

A simple HTML-first architecture with TypeScript. Perfect for lightweight tools.

**Features:**

- Pure HTML, CSS, and TypeScript
- Direct DOM manipulation
- Minimal dependencies
- Fast build times

**Best for:** Simple tools, forms, data viewers

### 2. React

Modern React 18 application with TypeScript and Vite.

**Features:**

- React 18 with hooks
- TypeScript support
- Vite for fast HMR
- Component-based architecture
- Fluent 9 UI components

**Best for:** Complex UIs, interactive dashboards, data-driven applications

### 3. Vue

Vue 3 Composition API with TypeScript and Vite.

**Features:**

- Vue 3 with Composition API
- TypeScript support
- Vite for fast HMR
- Reactive data binding

**Best for:** Progressive web apps, admin panels, forms

### 4. Svelte

Svelte 5 with TypeScript and Vite.

**Features:**

- Svelte 5 with runes
- TypeScript support
- Vite for fast HMR
- Compiled components (no runtime)

**Best for:** Performance-critical apps, small bundle sizes

## Usage

### Interactive Mode

Simply run:

```bash
yo pptb
```

You'll be prompted to:

1. Choose a tool type (HTML/TypeScript, React, Vue, or Svelte)
2. Enter a tool name
3. Enter a tool identifier (package name)
4. Enter a description
5. Choose a package manager (npm, yarn, or pnpm)
6. Decide whether to initialize a git repository

### Quick Mode

Skip prompts with command-line options:

```bash
yo pptb my-tool --quick
```

### Command-Line Options

- `--quick`, `-q` - Quick mode, use defaults
- `--toolType`, `-t` - Tool type: `html`, `react`, `vue`, or `svelte`
- `--toolDisplayName`, `-n` - Display name of the tool
- `--toolId` - Identifier (package name) of the tool
- `--toolDescription` - Description of the tool
- `--pkgManager` - Package manager: `npm`, `yarn`, or `pnpm`
- `--gitInit` - Initialize git repository (true/false)

**Example:**

```bash
yo pptb my-react-tool \
  --toolType react \
  --toolDisplayName "My React Tool" \
  --toolId "pptb-my-react-tool" \
  --toolDescription "A sample React tool for PPTB" \
  --pkgManager npm \
  --gitInit true
```

## Generated Project Structure

### HTML/TypeScript

```
my-tool/
├── src/
│   ├── index.html      # Main UI
│   ├── index.ts        # Tool logic
│   └── styles.css      # Styling
├── dist/               # Build output
├── package.json
├── tsconfig.json
└── README.md
```

### React/Vue/Svelte

```
my-tool/
├── src/
│   ├── App.tsx|vue|svelte  # Main component
│   ├── main.tsx|ts         # Entry point
│   └── styles.css          # Styling
├── dist/                   # Build output
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development Workflow

After generating your tool:

1. **Install dependencies:**

   ```bash
   cd my-tool
   npm install
   ```

2. **Start development:**

   ```bash
   # For HTML/TypeScript
   npm run watch

   # For React/Vue/Svelte
   npm run dev
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Finalize package for publishing:**

   ```bash
   npm run finalize-package
   ```

   This creates an `npm-shrinkwrap.json` file that locks dependencies for security and ensures consistent installations.

5. **Test in PPTB:**
   - Build your tool
   - Run `npm run finalize-package` to generate shrinkwrap
   - Deploy to npm
   - Install it in PPTB using debug window
   - Load and test from the Tool Box interface

## PPTB API

All generated tools include access to the PPTB APIs via `window.toolboxAPI` and `window.dataverseAPI`.

Full list of API references is [here](https://github.com/PowerPlatformToolBox/desktop-app/blob/main/packages/README.md#api-reference).

> See the generated README in your tool for examples.

## Sample Tools

This generator is based on the official PPTB sample tools:
https://github.com/PowerPlatformToolBox/sample-tools

## Requirements

- Node.js >= 18.0.0
- npm, yarn, or pnpm
- Yeoman (yo)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [Power Platform Tool Box](https://github.com/PowerPlatformToolBox)
- [Sample Tools](https://github.com/PowerPlatformToolBox/sample-tools)
- [Yeoman](https://yeoman.io/)

## Support

For issues and questions:

- Open an issue on [GitHub](https://github.com/PowerPlatformToolBox/generator-pptb/issues)
- Check the [sample tools repository](https://github.com/PowerPlatformToolBox/sample-tools)
