# apps/desktop — Context

## What is this?

The `@fastdeck/desktop` workspace is the **core of FastDeck** — the Electron.js desktop application that runs on the user's Mac, Windows, or Linux machine.

It serves two primary roles:
1. **The gRPC Server** — Listens for connections from paired mobile devices and executes actions on the host OS.
2. **The Configurator UI** — A rich React-based interface for building, editing, and managing Deck Panels with drag-and-drop.

---

## Responsibilities

| Responsibility | Details |
|---------------|---------|
| **gRPC server** | Accepts mobile connections and handles `TriggerAction` RPCs |
| **Action execution** | Runs scripts, launches apps, fires key bindings, controls media |
| **Panel configurator** | Drag-and-drop A×B grid editor for assigning actions to cells |
| **Plugin system** | Loads, manages, and sandboxes third-party plugin packages |
| **Server advertisement** | Broadcasts presence over mDNS so mobile devices can discover it |
| **Profile management** | Stores and switches between named profiles/layouts |

---

## Architecture: Main vs Renderer Process

Electron splits work between two process types:

```
┌──────────────────────────────────────────────────────┐
│                  Electron Main Process               │
│  (Node.js — full OS access)                          │
│                                                      │
│  • gRPC server (@grpc/grpc-js)                       │
│  • Action executor (child_process, robotjs, etc.)    │
│  • Plugin loader                                     │
│  • mDNS advertiser (bonjour/mdns)                    │
│  • IPC handlers (exposes safe APIs to renderer)      │
└─────────────────────────┬────────────────────────────┘
                          │ contextBridge / IPC
┌─────────────────────────▼────────────────────────────┐
│                Electron Renderer Process             │
│  (React + Vite — sandboxed, no direct Node access)  │
│                                                      │
│  • Panel grid configurator UI                        │
│  • Plugin marketplace UI                             │
│  • Settings / profile management UI                  │
│  • Calls preload-exposed APIs only                   │
└──────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
apps/desktop/
│
├── package.json                  # @fastdeck/desktop — Electron, grpc-js, React
├── tsconfig.json                 # Extends ../../tsconfig.base.json
├── electron.vite.config.ts       # electron-vite config (main + renderer)
├── CONTEXT.md                    # ← You are here
│
├── src/
│   │
│   ├── main/                     # Electron Main Process (Node.js context)
│   │   ├── index.ts              # Entry: creates BrowserWindow, starts server
│   │   ├── server/
│   │   │   ├── grpcServer.ts     # gRPC server bootstrap + service registration
│   │   │   └── FastDeckService.ts # gRPC service implementation
│   │   ├── actions/              # Action executor modules
│   │   │   ├── index.ts          # Action dispatcher (routes by ActionType)
│   │   │   ├── shell.ts          # RUN_COMMAND, RUN_SCRIPT
│   │   │   ├── launchApp.ts      # LAUNCH_APP
│   │   │   ├── openUrl.ts        # OPEN_URL
│   │   │   ├── mediaControl.ts   # MEDIA_CONTROL (play/pause/skip/volume)
│   │   │   ├── keyBinding.ts     # KEY_BINDING (robotjs / nut.js)
│   │   │   └── createFolder.ts   # CREATE_FOLDER
│   │   ├── plugins/
│   │   │   ├── pluginLoader.ts   # Discovers and loads plugin packages
│   │   │   └── pluginRegistry.ts # Registers plugin-provided action types
│   │   ├── discovery/
│   │   │   └── mdnsAdvertiser.ts # mDNS service broadcasting
│   │   └── ipc/
│   │       └── handlers.ts       # contextBridge IPC bridge for renderer
│   │
│   ├── preload/                  # Preload script (secure bridge)
│   │   └── index.ts              # Exposes safe IPC methods via contextBridge
│   │
│   └── renderer/                 # Electron Renderer Process (React UI)
│       ├── index.html            # Renderer HTML entry
│       ├── main.tsx              # React DOM root
│       ├── App.tsx               # Root React component / router
│       ├── index.css             # Design system (shared tokens)
│       │
│       ├── pages/
│       │   ├── Dashboard.tsx     # Default view: profile overview
│       │   ├── GridEditor.tsx    # Drag-and-drop panel configurator
│       │   ├── ActionEditor.tsx  # Form to configure a single action
│       │   ├── Plugins.tsx       # Plugin marketplace + installed list
│       │   └── Settings.tsx      # Server port, theme, preferences
│       │
│       └── components/
│           ├── Grid/
│           │   ├── DeckGrid.tsx  # A×B grid renderer
│           │   └── DeckCell.tsx  # Individual draggable cell
│           ├── ActionForm/       # Per-action-type configuration forms
│           └── Sidebar/          # Navigation sidebar
```

---

## Action Execution

All actions are dispatched through a central `ActionDispatcher` in the main process:

```
gRPC TriggerAction request
        │
        ▼
ActionDispatcher (main/actions/index.ts)
        │
        ├─ ActionType.RUN_COMMAND   → shell.ts   → child_process.exec()
        ├─ ActionType.RUN_SCRIPT    → shell.ts   → child_process.execFile()
        ├─ ActionType.LAUNCH_APP    → launchApp.ts → open / shell.openExternal()
        ├─ ActionType.OPEN_URL      → openUrl.ts  → shell.openExternal()
        ├─ ActionType.MEDIA_CONTROL → mediaControl.ts → OS media keys
        ├─ ActionType.KEY_BINDING   → keyBinding.ts  → nut.js / robotjs
        ├─ ActionType.CREATE_FOLDER → createFolder.ts → fs.mkdir()
        └─ ActionType.MULTI         → loop: dispatch each child action
```

---

## Plugin System

A plugin is an npm package that:
1. Exports a `FastDeckPlugin` object (defined in `@fastdeck/shared`).
2. Declares new `ActionType` identifiers.
3. Provides executor functions for those action types.
4. Optionally provides React components for the configurator UI.

```typescript
// Example plugin structure
export const plugin: FastDeckPlugin = {
  id: 'fastdeck-vscode',
  name: 'VS Code',
  version: '1.0.0',
  actions: [
    { type: 'VSCODE_OPEN_FILE', execute: (payload) => { ... } },
    { type: 'VSCODE_RUN_TASK', execute: (payload) => { ... } },
  ],
};
```

---

## Key Dependencies (Planned)

| Package | Purpose |
|---------|---------|
| `electron` | Desktop runtime |
| `electron-vite` | Vite integration for main + renderer |
| `@grpc/grpc-js` | gRPC server implementation |
| `@grpc/proto-loader` | Loads `.proto` files at runtime |
| `bonjour-service` | mDNS service advertisement |
| `@nut-tree-fork/nut-js` | Cross-platform key binding / automation |
| `react@18` | Renderer UI framework |
| `@dnd-kit/core` | Drag-and-drop for the grid configurator |
| `@fastdeck/shared` | Shared types, constants, action interfaces |
| `@fastdeck/proto` | Generated gRPC types |
