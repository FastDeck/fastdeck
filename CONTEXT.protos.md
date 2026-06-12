# protos — Context (Git Submodule)

> **Submodule**: `git@github.com:FastDeck/protos.git` → mounted at `protos/`
> Do not add files directly into `protos/` — it is an independent repository.

## What is this?

`protos/` is a **Git submodule** containing the **single source of truth for all FastDeck service definitions** — the Protobuf `.proto` files and the tooling to generate type-safe TypeScript code from them.

Changes to `.proto` files are made in the [`FastDeck/protos`](https://github.com/FastDeck/protos) repository directly, then the submodule pointer here is updated to track the new commit.

---

## Repository Details

| Field | Value |
|-------|-------|
| Remote | `git@github.com:FastDeck/protos.git` |
| Local path | `protos/` (root of this monorepo) |
| Tooling | [`buf`](https://buf.build) v2 |
| Code generation | `buf.build/bufbuild/es` + `buf.build/connectrpc/es` |
| Output | `codegen/ts/` (TypeScript, generated inside the submodule) |

---

## Folder Structure

```
protos/                           ← Git submodule root
│
├── buf.yaml                      # buf workspace config — lint + breaking rules
├── buf.gen.yaml                  # Code generation plugins + output dirs
├── Makefile                      # Developer commands: format, lint, generate, commit
├── README.md
├── LICENSE
│
├── proto/                        # All .proto source files
│   ├── google/                   # Google common types (rpc status, error details)
│   │   ├── rpc/
│   │   │   ├── code.proto
│   │   │   ├── error_details.proto
│   │   │   └── status.proto
│   │   └── type/                 # Well-known types (date, money, latlng, etc.)
│   │
│   └── services/                 # FastDeck service definitions
│       └── demo_service/
│           └── demo_service.proto  # Example (UserService)
│
└── codegen/                      # ⚠️ Auto-generated — do not edit manually
    └── ts/                       # TypeScript output (Connect RPC + Protobuf types)
```

---

## Tooling: `buf`

The repo uses [`buf`](https://buf.build) v2 instead of raw `protoc`:

- **Linting** — `STANDARD` ruleset enforces naming conventions and file structure.
- **Breaking change detection** — catches API-breaking changes before they ship.
- **Remote plugins** — no local plugin binaries needed; plugins run via the Buf registry.

### Code Generation Plugins

| Plugin | Purpose |
|--------|---------|
| `buf.build/bufbuild/es:v1.10.0` | Base Protobuf message types in TypeScript |
| `buf.build/connectrpc/es:v1.4.0` | Connect RPC service stubs in TypeScript |

**Connect RPC** is used instead of traditional gRPC-Web. It is compatible with gRPC servers but also supports HTTP/1.1 and JSON — simpler to consume in React Native without needing an Envoy proxy.

---

## Make Commands (run inside `protos/`)

```bash
make generate   # Clean → buf generate → outputs to codegen/ts/
make lint       # buf lint — validate .proto files
make format     # buf format -w — auto-format all .proto files
make all        # format + lint + generate
make commit     # Interactive conventional commit (runs all + git commit)
```

---

## How Apps Consume Generated Types

The `codegen/ts/` output inside the submodule is referenced by `apps/desktop` and `apps/mobile` via relative path imports or a `packages/proto` wrapper workspace.

```typescript
// Option A — Direct relative import (V1, simple)
import { FastDeckServiceClient } from '../../protos/codegen/ts/services/fastdeck/...';

// Option B — packages/proto wrapper (V2, cleaner DX)
import { FastDeckServiceClient } from '@fastdeck/proto';
```

---

## Submodule Workflow

```bash
# Clone monorepo WITH submodule content
git clone --recurse-submodules git@github.com:FastDeck/tools.git

# Initialize submodule after a plain clone
git submodule update --init --recursive

# Pull latest protos from upstream
git submodule update --remote protos
git add protos
git commit -m "chore(protos): update to latest"

# Check submodule status
git submodule status
```
