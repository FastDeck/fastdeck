# FastDeck — Project Context

## What is FastDeck?

FastDeck is a **Stream Deck-style productivity tool** that lets users configure a grid of action buttons on their mobile/tablet device, which communicate with a desktop application to trigger automated actions — launching apps, running scripts, controlling media, firing key bindings, and more.

Think of it as a **physical Stream Deck, but using your phone or tablet as the panel**, paired wirelessly with your desktop over Bluetooth or a shared WiFi/hotspot network.

---

## The Problem It Solves

Power users — developers, streamers, content creators, and productivity enthusiasts — rely on macro tools and shortcut panels to speed up repetitive tasks. Physical Stream Decks are expensive and tied to a desk. FastDeck makes this capability:

- **Device-agnostic**: Any iOS or Android device becomes a control panel.
- **Wireless**: No USB cables required.
- **Programmable**: Fully custom actions, not just media keys.
- **Extensible**: Plugin marketplace for popular apps (VS Code, OBS, Figma, etc.).

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Mobile Device                    │
│  ┌──────────────────────────────────────────────┐  │
│  │         FastDeck Mobile App (React Native)   │  │
│  │  • Discovers nearby FastDeck servers         │  │
│  │  • Displays the Deck Panel (A×B grid)        │  │
│  │  • Sends action trigger requests via gRPC    │  │
│  └──────────────────────────┬───────────────────┘  │
└─────────────────────────────┼───────────────────────┘
                              │ gRPC (Bluetooth / WiFi)
┌─────────────────────────────┼───────────────────────┐
│                    Desktop Device                   │
│  ┌──────────────────────────▼───────────────────┐  │
│  │       FastDeck Desktop App (Electron)         │  │
│  │  • Runs the gRPC Server                       │  │
│  │  • Executes actions on the host OS            │  │
│  │  • Hosts the drag-and-drop Panel configurator │  │
│  │  • Plugin system / marketplace                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Monorepo Structure

```
FastDeck/tools/
├── CONTEXT.md                    ← You are here (project-level context)
│
├── protos/                       ← Git submodule: github.com/FastDeck/protos
│   │                                Single source of truth for all .proto files
│   ├── proto/services/           ← FastDeck service definitions
│   ├── buf.yaml                  ← buf lint + breaking change config
│   ├── buf.gen.yaml              ← Code generation config (bufbuild/es + connectrpc/es)
│   └── Makefile                  ← make generate / lint / format / commit
│
├── apps/
│   ├── web/                      ← Marketing / docs web app (React + Vite)
│   ├── desktop/                  ← Desktop client (Electron + React + Vite)
│   └── mobile/                   ← Mobile panel (React Native)
│
└── packages/
    └── shared/                   ← Types, constants, utilities (all platforms)
```

Each workspace has its own `CONTEXT.md` with detailed functionality.

---

## Communication Protocol: gRPC

FastDeck uses **gRPC** (via Protocol Buffers) as the communication layer between the mobile app and the desktop server. This was chosen for:

- **Strong typing**: `.proto` files generate type-safe code for both client (mobile) and server (desktop).
- **Performance**: Binary protocol is far more efficient than JSON/REST.
- **Bidirectional streaming**: The server can push panel updates to the client in real-time.
- **Cross-platform**: Works over both Bluetooth (RFCOMM channel) and TCP/IP (WiFi/hotspot).

### Connection Lifecycle

```
Mobile                              Desktop
  │                                    │
  │── Discover (mDNS broadcast) ──────►│
  │◄─ Advertise (server info) ─────────│
  │                                    │
  │── Connect (gRPC handshake) ───────►│
  │◄─ Stream: GridLayout ──────────────│
  │                                    │
  │── TriggerAction(actionId) ────────►│
  │                                    │   executes on OS
  │◄─ ActionResult(status) ────────────│
  │                                    │
  │◄─ Stream: GridUpdate (live) ───────│
```

---

## Action System

### Single Actions (V1)

| Action Type | Description |
|-------------|-------------|
| `CREATE_FOLDER` | Creates a directory at a specified path |
| `RUN_SCRIPT` | Executes a script file (shell, Python, etc.) |
| `RUN_COMMAND` | Runs a raw terminal command |
| `LAUNCH_APP` | Opens an application by name or path |
| `OPEN_URL` | Opens a URL in the default browser |
| `MEDIA_CONTROL` | Play/Pause/Skip/Volume control of desktop media |
| `KEY_BINDING` | Triggers a keyboard shortcut on the desktop |

### Multi Actions (V1)

A **Multi Action** is an ordered sequence of Single Actions executed one-by-one. Each step can have an optional delay before the next action fires.

```
Multi Action Example: "Start Dev Session"
  1. LAUNCH_APP    → Terminal
  2. RUN_COMMAND   → cd ~/project && yarn dev
  3. LAUNCH_APP    → VS Code
  4. OPEN_URL      → http://localhost:3000
```

---

## Plugin System (Desktop)

The desktop app will support a **plugin marketplace** where third-party developers can publish action packs for popular apps.

- **Plugin**: A self-contained package that registers new action types.
- **Example plugins**:
  - `fastdeck-vscode`: Open file, run task, toggle terminal
  - `fastdeck-obs`: Start/stop stream, switch scenes
  - `fastdeck-figma`: Navigate frames, toggle prototypes
- **Discovery**: Plugins are listed in an in-app marketplace, installable with one click.

---

## The Panel Grid

The Deck Panel is an **A × B configurable grid** where A and B can be any positive integer.

- Each **cell** holds one action (Single or Multi).
- Each cell can be assigned:
  - A custom **icon** (emoji, image, or SF Symbol on iOS).
  - A custom **label**.
  - A **background color** or **gradient**.
- Cells are arranged via **drag-and-drop** in the desktop configurator.
- Multiple **pages/profiles** can be created and switched between.

---

## Version Roadmap

### V1 — Core (Current Target)
- ✅ Monorepo setup (this session)
- 🔲 gRPC `.proto` definitions
- 🔲 Desktop app (Electron): gRPC server, OS action execution
- 🔲 Mobile app (React Native): Server discovery, panel display, action trigger
- 🔲 All 7 single action types
- 🔲 Multi action support
- 🔲 Basic drag-and-drop grid configurator

### V2 — Polish
- 🔲 Plugin marketplace MVP
- 🔲 Multiple profiles/pages
- 🔲 Custom icons and themes
- 🔲 macOS/Windows/Linux installers

### V3 — Ecosystem
- 🔲 Plugin SDK and developer docs
- 🔲 Cloud sync of profiles
- 🔲 Tablet-optimized layout
- 🔲 Web dashboard

---

## Tech Stack Summary

| Layer | Technology | Why |
|-------|-----------|-----|
| Desktop UI | React + Vite (Electron renderer) | Familiar, fast HMR, great ecosystem |
| Desktop runtime | Electron | Cross-platform native OS access |
| Mobile | React Native | iOS + Android from one codebase |
| Communication | gRPC + Protobuf | Fast, typed, streaming |
| Discovery | mDNS / Bonjour | Zero-config local network discovery |
| Monorepo | Yarn Workspaces | Simple, widely compatible |
| Shared code | TypeScript | End-to-end type safety |
| Web (marketing) | React + Vite | Consistent with desktop renderer stack |

---

## Development Principles

1. **Type-safe everywhere** — TypeScript across all packages; Protobuf as the contract for network communication.
2. **Shared code first** — Business logic, action types, and constants live in `packages/shared` and are consumed by all apps.
3. **Proto as the source of truth** — The `.proto` file defines the API; all implementations must conform to it.
4. **Platform-native feel** — The desktop app should feel native on macOS/Windows/Linux; the mobile app should respect iOS and Android design conventions.
5. **Extensibility from day one** — The plugin system architecture is designed in from V1, not bolted on later.
