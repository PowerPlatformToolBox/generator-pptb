# <%= displayName %>

<%= description %>

## Features

- ✅ Svelte 5 with TypeScript
- ✅ Vite for fast development and building
- ✅ Access to ToolBox API via `window.toolboxAPI`
- ✅ Connection URL and access token handling
- ✅ Event subscription and handling
- ✅ Hot Module Replacement (HMR) for development

## Structure

```
<%= name %>/
├── src/
│   ├── App.svelte      # Main component
│   ├── main.ts         # Entry point
│   ├── styles.css      # Styling
│   └── vite-env.d.ts   # Type definitions
├── dist/               # Build output
├── index.html
├── package.json
├── tsconfig.json
├── svelte.config.js
└── vite.config.ts
```

## Installation

**Build the tool:**

```bash
npm run build
```

**Dev build with sourcemaps (watch mode):**

```bash
npm run dev-watch
```

**Validate tool package:**

```bash
npm run validate
```

**Shrinkwrap package:**

```bash
npm run finalize-package
```

or;

```bash
npm shrinkwrap
```

**Publish new version:**

```bash
npm run publish-package
```

_Further tool development documentation is available @ https://docs.powerplatformtoolbox.com/tool-development_

## Usage in ToolBox

1. Build the tool using `npm run build`
2. Install the tool in ToolBox
3. Load and use the tool from the ToolBox interface

## API Usage

The tool demonstrates various ToolBox API features:

### Getting Connection Context

```typescript
const context = await window.toolboxAPI.getToolContext();
console.log(context.connectionUrl);
console.log(context.accessToken);
```

### Showing Notifications

```typescript
await window.toolboxAPI.showNotification({
    title: 'Success',
    body: 'Operation completed',
    type: 'success',
});
```

### Subscribing to Events

```typescript
window.toolboxAPI.onToolboxEvent((event, payload) => {
    console.log('Event:', payload.event);
    console.log('Data:', payload.data);
});
```

## License

MIT
