# Web Design Specification: FastDeck

## 1. Executive Summary

**FastDeck** is a high-performance, Stream Deck-style productivity tool that lets users configure a grid of action buttons on their mobile/tablet device, which communicate with a desktop application to trigger automated actions. The web platform serves as the marketing, product showcase, and documentation site. It prioritizes zero-latency feel, visual feedback, and responsive layouts.

---

## 2. Product Vision

To showcase a premium wireless control deck experience that connects mobile panels to desktops over gRPC. The site highlights ease of setup, macro configurations, the plugin marketplace, and cross-platform compatibility.

---

## 3. Design Identity & System Tokens

The web application utilizes a custom design system powered by **Chakra UI v3**, configured in [theme.ts](file:///Users/mr.robot/z-stash/FastDeck/fastdeck/shared/common/src/components/theme/theme.ts):

### 3.1 Theme Modes

- **Multi-Mode Support:** Robust dark and light mode support with preference detection and seamless theme switching.
- **Obsidian Flux (Dark Mode):** Deep neutral background (`#121416`) with dark slate panel cards and glassmorphic overlays.
- **Light Mode Layout:** Clean neutral background (soft gray `#F8F9FA`) with cards in white (`#FFFFFF`).

### 3.2 Color System

- **Primary Accent:** Slate Blue / Primary (`#bac8d7` / `primary` token)
- **Secondary Utility:** Cool gray (`#5b5f63`)
- **Success Green:** Connected alerts (`#28a745` / `success.400`)
- **Warning Amber:** Warning overlays (`#ffc107` / `warning.400`)
- **Error Red:** System/input errors (`#ba1a1a` / `error.400`)
- **Neutral Palette:** Tiered gray system from `#e3e3e3` (100) down to `#121416` (Obsidian surface) for structured border/background boundaries.

### 3.3 Typography

- **Primary Fonts:** `Geist` (Sans-serif) for headings, `Hanken Grotesk` for body elements.
- **Monospace Fonts:** `JetBrains Mono` for gRPC logs and configuration keys.

### 3.4 Shapes & Shadows

- **Corner Radius:** Standardized `0.5rem` (8px) for buttons, input forms, and controls; `1rem` (16px) for large display containers and cards.
- **Elevation:** Ambient shadows and glassmorphism backdrop filters are used to convey depth and premium feel.

---

## 4. Core Feature Requirements

### 4.1 Interactive Landing Simulator

- **FastDeck gRPC Console:** Displays real-time log simulation of phone-to-desktop action triggering.
- **Interactive Button Grid:** Lets users click simulated macro keys to see immediate command execution logs.

### 4.2 Documentation Page

- **Topic Categories:** Easy navigation between Quick Start, Architecture, API Reference, and Setup Guides.
- **Theme/Language Selector:** Fully localized docs in English, Spanish, Russian, Chinese, Hindi, and Japanese.

---

## 5. Technical Constraints & Framework Integration

- **UI Framework:** React (18.3+) + Chakra UI v3
- **State & Query Routing:** Zustand v5 for application states; React Query for remote API cache management.
- **Responsiveness:** Collapses into a mobile-friendly single-column layout with a top/bottom menu bar below a 600px screen width.
- **Localization Integration:** Dynamic translation keys fetched via `i18next` locales in [locales](file:///Users/mr.robot/z-stash/FastDeck/fastdeck/shared/common/src/localization/locales/).
