# <%= displayName %>

<%= description %>

## Features

- ✅ TypeScript with full type safety
- ✅ HTML+CSS+JS architecture
- ✅ Access to ToolBox API via `window.toolboxAPI`
- ✅ Connection URL and access token handling
- ✅ Event subscription and handling

## Structure

```
<%= name %>/
├── src/
│   ├── index.html      # Main UI
│   ├── index.ts        # Tool logic (TypeScript)
│   └── styles.css      # Styling
├── dist/               # Compiled output (after build)
│   ├── index.html
│   ├── index.js
│   ├── index.js.map
│   └── styles.css
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

Install dependencies:

```bash
npm install
```

## Development

Build the tool:

```bash
npm run build
```

Watch mode for development:

```bash
npm run watch
```

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
  type: 'success'
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
