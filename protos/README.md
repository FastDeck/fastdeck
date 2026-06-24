# FastDeck Protocol Buffers & gRPC Services

This folder contains the Protocol Buffer schemas and gRPC service definitions that serve as the single source of truth for communication between FastDeck clients (mobile/tablet panels) and the FastDeck desktop server.

## Overview

FastDeck uses **gRPC** via Protocol Buffers for fast, type-safe, bidirectional streaming communication over both local TCP networks (WiFi/hotspot) and Bluetooth (RFCOMM).

```
  Mobile Client                                       Desktop Server
  ┌────────────────┐                                ┌────────────────┐
  │  Deck Panel UI │                                │  gRPC Service  │
  │                │    ─── GetDeckInfoRequest ──►  │                │
  │                │    ◄── GetDeckInfoResponse ──  │                │
  │                │                                │                │
  │                │    ◄── StreamDeckUpdates ────  │                │
  │                │        (Server-sent Stream)    │                │
  │                │                                │                │
  │                │    ─── TriggerActionRequest ─► │ (Executes OS   │
  │                │    ◄── TriggerActionResponse ─ │  action flow)  │
  └────────────────┘                                └────────────────┘
```

---

## Service Definition: `DeckService`

The core API service is defined in [`proto/services/deck.proto`](file:///Users/mr.robot/z-stash/FastDeck/fastdeck/protos/proto/services/deck.proto) under the package `fastdeck.services.v1`.

### Endpoints

| RPC Method | Request Type | Response Type | Pattern | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GetDeckInfo` | `GetDeckInfoRequest` | `GetDeckInfoResponse` | Unary | Fetches server metadata (name, version, profiles) and the current active profile (grid dimensions, cell layouts, and bound actions). |
| `StreamDeckUpdates` | `StreamDeckUpdatesRequest` | `StreamDeckUpdatesResponse` | Server Streaming | Establishes a stream where the server pushes real-time grid changes, active profile switches, or single-cell modifications to the client. |
| `TriggerAction` | `TriggerActionRequest` | `TriggerActionResponse` | Unary | Requests the server to execute an action. Actions can be triggered either by a unique `action_id` or by specific `row` and `col` cell coordinates. |
| `SwitchProfile` | `SwitchProfileRequest` | `SwitchProfileResponse` | Unary | Switches the active panel configuration profile to a different layout on the server. |

---

## Action System Shemas

The action configuration payload schemas are defined in [`proto/services/action.proto`](file:///Users/mr.robot/z-stash/FastDeck/fastdeck/protos/proto/services/action.proto).

### 1. Action Types (`ActionType` Enum)
- `ACTION_TYPE_CREATE_FOLDER`: Create a directory at a path.
- `ACTION_TYPE_RUN_SCRIPT`: Execute a shell or script file.
- `ACTION_TYPE_RUN_COMMAND`: Run a terminal command.
- `ACTION_TYPE_LAUNCH_APP`: Start a desktop application.
- `ACTION_TYPE_OPEN_URL`: Open a browser URL.
- `ACTION_TYPE_MEDIA_CONTROL`: Control desktop media (Play, Pause, Volume, etc.).
- `ACTION_TYPE_KEY_BINDING`: Trigger a native keyboard shortcut.

### 2. Multi-Actions
A `MultiAction` allows executing a sequence of actions sequentially.
- **`MultiActionStep`**: Combines an `Action` with an integer `delay_ms` specifying the duration to wait before firing the next step.
- **`MultiAction`**: Contains a list of `MultiActionStep` objects.

---

## Grid Layout & Cell Schema

Defined in [`proto/services/deck.proto`](file:///Users/mr.robot/z-stash/FastDeck/fastdeck/protos/proto/services/deck.proto):

- **`Cell`**: Represents an individual button on the panel grid.
  - `row` / `col` (int32): Position coordinates in the grid layout.
  - `label` (string): Text displayed on the button.
  - `icon` (string): Button icon representation (could be an Emoji character, local/remote image path, or platform-native SF Symbol string).
  - `background` (string): Button styling colors (HEX value or CSS-compliant gradient string).
  - `action` (`CellAction`): A wrapper containing either a single `Action` or a `MultiAction` block.
  - `is_enabled` (bool): Button active/disabled state.

- **`Grid`**: Represents the layout matrix.
  - `rows` / `cols` (int32): Total grid dimensions.
  - `cells` (repeated `Cell`): Array of configured buttons inside the grid.

- **`Profile`**: Defines a full panel layout mapping.
  - `id` (string): Unique profile ID.
  - `name` (string): Profile name.
  - `grid` (`Grid`): Layout grid containing cells.

---

## Building and Compiling Protos

FastDeck manages schema generation, formatting, and lint rules using the **Buf Build** utility.

### Prerequisite
Ensure `buf` is installed on your local machine:
```bash
brew install bufbuild/buf/buf
```

### Makefile CLI Help Commands
A [`Makefile`](file:///Users/mr.robot/z-stash/FastDeck/fastdeck/protos/Makefile) is provided inside the `protos/` folder for convenience:

- **Lint checking**:
  ```bash
  make lint
  ```
  Runs `buf lint` validation over all proto files to verify schema correctness and consistency.

- **Formatting checking**:
  ```bash
  make format
  ```
  Runs `buf format -w` to format all proto files in-place according to the standard Protocol Buffer style guide.

- **Code generation**:
  ```bash
  make generate
  ```
  Generates TypeScript static classes and Connect-ES RPC clients under the `gen/` directory based on the `buf.gen.yaml` config.
