# <%= displayName %>

<%= description %>

## Features

- ✅ React 18 with TypeScript
- ✅ Vite for fast development and building
- ✅ Access to ToolBox API via `window.toolboxAPI`
- ✅ Connection URL and access token handling
- ✅ Event subscription and handling
- ✅ Hot Module Replacement (HMR) for development

## Structure

```
<%= name %>/
├── src/
│   ├── App.tsx         # Main component
│   ├── main.tsx        # Entry point
│   └── styles.css      # Styling
├── dist/               # Build output
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Installation

Install dependencies:

```bash
npm install
```

## Development

Start development server with HMR:

```bash
npm run dev
```

Build the tool:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
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
