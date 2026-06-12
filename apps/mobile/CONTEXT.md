# apps/mobile — Context

## What is this?

The `@fastdeck/mobile` workspace is the **React Native application** for iOS and Android. It turns any phone or tablet into a wireless control panel that communicates with the FastDeck desktop server via gRPC.

---

## Responsibilities

| Responsibility | Details |
|---------------|---------|
| **Server discovery** | Scans local network for FastDeck desktop servers via mDNS |
| **Pairing** | Displays found servers; user selects and connects to one |
| **Panel display** | Renders the A×B grid of action buttons as configured on desktop |
| **Action triggering** | Sends `TriggerAction` gRPC calls when a button is tapped |
| **Live updates** | Receives streaming grid updates from the desktop in real-time |

---

## Connection Flow

```
Mobile App                          Desktop Server
     │                                     │
     │──── mDNS query (local network) ────►│
     │◄─── mDNS response (server info) ────│
     │  [User selects server]              │
     │──── gRPC Connect ──────────────────►│
     │◄─── Stream: GridLayout (cells) ─────│
     │  [User taps a button]               │
     │──── TriggerAction(cellId) ─────────►│
     │◄─── ActionResult(status, message) ──│
     │◄─── Stream: GridUpdate (live) ───── │
```

---

## Folder Structure

```
apps/mobile/
│
├── package.json                  # @fastdeck/mobile
├── tsconfig.json                 # Extends ../../tsconfig.base.json
├── metro.config.js               # Metro bundler (monorepo-aware)
├── babel.config.js               # Babel for React Native
├── app.json                      # RN app metadata (name, bundle ID)
├── index.js                      # RN entry point
├── CONTEXT.md                    # ← You are here
│
└── src/
    ├── App.tsx                   # Root — navigation shell
    │
    ├── screens/
    │   ├── Discovery.tsx         # Lists nearby FastDeck servers
    │   ├── Connecting.tsx        # Loading state during handshake
    │   ├── DeckPanel.tsx         # Main screen: A×B button grid
    │   └── Settings.tsx          # Haptic, theme, preferences
    │
    ├── components/
    │   ├── ServerCard.tsx        # Server list item (name, IP, ping)
    │   ├── DeckCell.tsx          # Individual action button
    │   ├── DeckGrid.tsx          # Renders the A×B grid
    │   └── ActionFeedback.tsx    # Toast/ripple on action result
    │
    ├── services/
    │   ├── grpcClient.ts         # gRPC channel + service stub setup
    │   ├── discovery.ts          # mDNS scan for local servers
    │   └── actionService.ts      # Wraps TriggerAction RPC
    │
    ├── store/                    # Zustand state
    │   ├── connectionStore.ts    # Active server connection
    │   ├── gridStore.ts          # Panel grid layout (cells + labels)
    │   └── settingsStore.ts      # User preferences
    │
    └── utils/
        ├── haptics.ts            # Haptic feedback on tap
        └── grid.ts               # A×B dimension helpers
```

---

## gRPC on React Native

**V1 plan**: Use **gRPC-Web** with a lightweight Envoy proxy bundled in the Electron main process. This avoids native module complexity while preserving the `.proto` type contract.

| Approach | Notes |
|---------|-------|
| gRPC-Web + Envoy (V1) | Works with RN's HTTP stack; proxy runs as Electron sidecar |
| react-native-grpc | Native module; complex but full gRPC support (V2 option) |

---

## Key Dependencies (Planned)

| Package | Purpose |
|---------|---------|
| `react-native` | Core mobile framework |
| `@react-navigation/native` | Screen navigation |
| `grpc-web` | gRPC-Web client |
| `react-native-zeroconf` | mDNS discovery |
| `zustand` | State management |
| `react-native-haptic-feedback` | Tactile feedback |
| `@fastdeck/shared` | Shared types |
| `@fastdeck/proto` | Generated gRPC types |
