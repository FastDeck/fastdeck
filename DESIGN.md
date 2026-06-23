---
name: Fastdeck
colors:
  surface: '#121317'
  surface-dim: '#121317'
  surface-bright: '#38393d'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b1f'
  surface-container: '#1e1f23'
  surface-container-high: '#292a2e'
  surface-container-highest: '#343539'
  on-surface: '#e3e2e7'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e3e2e7'
  inverse-on-surface: '#2f3034'
  outline: '#8b90a0'
  outline-variant: '#414755'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e69'
  primary-container: '#4b8eff'
  on-primary-container: '#00285c'
  inverse-primary: '#005bc1'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#c8c6c8'
  on-tertiary: '#303032'
  tertiary-container: '#919092'
  on-tertiary-container: '#29292b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e4'
  tertiary-fixed-dim: '#c8c6c8'
  on-tertiary-fixed: '#1b1b1d'
  on-tertiary-fixed-variant: '#474649'
  background: '#121317'
  on-background: '#e3e2e7'
  surface-variant: '#343539'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  deck-gutter: 12px
  sidebar-width: 280px
---

## Brand & Style

The design system for this desktop configurator is rooted in a "Dark Mode Pro" aesthetic, balancing industrial precision with high-performance digital utility. The target audience consists of streamers, developers, and power users who require a focused, distraction-free environment that prioritizes legibility and rapid recognition.

The style is a synthesis of **Minimalism** and **Modern Corporate**, utilizing heavy contrast and subtle depth to mimic the physical tactile nature of a hardware deck. Surfaces should feel high-end and weighted, using semi-matte finishes and crisp hardware-inspired details. The emotional response is one of control, efficiency, and professional-grade reliability.

## Colors

The palette is optimized for high-contrast visibility in low-light environments.

- **Primary (Electric Blue):** Reserved for active states, primary call-to-actions, and focused hardware keys.
- **Background Tiers:** The base interface uses a deep `#121212`. The Secondary Gray (`#1E1E1E`) is used for the main canvas/layout, while the Slate (`#2C2C2E`) serves as the "raised" surface for interactive cards and deck slots.
- **Status Accents:** Success, Warning, and Error colors are used sparingly for live status indicators, connectivity alerts, and destructive actions to ensure immediate user recognition without cluttering the visual field.

## Typography

Inter is used across the system for its exceptional legibility and neutral, technical feel. A strict hierarchy ensures that button labels and configuration metadata are easily distinguishable.

- **Display & Headlines:** Use tight letter spacing and bold weights to anchor the sections of the configurator.
- **Label-caps:** Specifically used for small metadata and hardware button labels to maximize clarity at small sizes.
- **Monospaced Accents:** For developer-facing plugins or technical hardware IDs, Geist (or a similar mono font) is used to provide a "code-like" precision.

## Layout & Spacing

The layout follows a precise **4px grid system** to ensure mathematical alignment across the dense UI.

- **Configurator Canvas:** A fixed-grid layout that mirrors the physical hardware (e.g., 3x5 or 4x8 grids).
- **Sidebars:** Fixed-width sidebars (280px) house the plugin library and property inspector, using `md` (16px) padding for internal content.
- **Responsiveness:** On smaller desktop windows, sidebars collapse into icons, and the deck grid scales proportionally to maintain the aspect ratio of the physical device keys.

## Elevation & Depth

To simulate a professional hardware interface, depth is achieved through **Tonal Layers** and **Inner Glows**.

- **Level 0 (Base):** Deepest black, used for the application background.
- **Level 1 (Panels):** `#1E1E1E` with a subtle 1px border of `#2C2C2E`.
- **Level 2 (Interactive Cards):** `#2C2C2E`. These elements use a 1px top-highlight (white at 5% opacity) to simulate a light source from above.
- **Active States:** Elements being edited or "pressed" use a subtle inner shadow to imply a physical depress, combined with an outer glow of the Primary Electric Blue.
- **Shadows:** Use large, highly diffused shadows (e.g., `0px 8px 24px rgba(0,0,0,0.5)`) for floating modals or dragged plugin icons.

## Shapes

The shape language is sophisticated and modern.

- **Standard UI Elements:** Use `rounded-lg` (16px) for main deck buttons and primary cards to create a friendly but technical feel.
- **Small Controls:** Input fields and secondary buttons use `rounded-md` (8px) for a tighter, more compact look.
- **Consistency:** All borders should be 1px or 1.5px thick, never exceeding 2px, to maintain a high-fidelity, "retina-ready" appearance.

## Components

- **Deck Keys:** These are the primary component. They feature a `16px` radius, a subtle gradient from top-to-bottom, and a 1px `#FFFFFF10` border. When a plugin is assigned, the icon is centered with a 2px gap from the bottom label.
- **Action Buttons:** Primary buttons are solid `#007AFF` with white text. Secondary buttons are outlined or semi-transparent gray backgrounds.
- **Input Fields:** Darker than the container background, with a subtle focus ring in Electric Blue.
- **Chips/Badges:** Used for plugin categories (e.g., "System," "Twitch," "OBS"). These are low-profile with `8px` rounded corners and small uppercase labels.
- **Plugin Library Cards:** High-quality imagery for previews should be clipped to the card's `12px` border radius, using a subtle overlay to ensure text legibility over the image.
- **Switch/Toggle:** Minimalist pill-shape using a high-contrast background for the "on" state to ensure visual clarity at a glance.---
  name: Fastdeck
  colors:
  surface: '#121317'
  surface-dim: '#121317'
  surface-bright: '#38393d'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b1f'
  surface-container: '#1e1f23'
  surface-container-high: '#292a2e'
  surface-container-highest: '#343539'
  on-surface: '#e3e2e7'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e3e2e7'
  inverse-on-surface: '#2f3034'
  outline: '#8b90a0'
  outline-variant: '#414755'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e69'
  primary-container: '#4b8eff'
  on-primary-container: '#00285c'
  inverse-primary: '#005bc1'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#c8c6c8'
  on-tertiary: '#303032'
  tertiary-container: '#919092'
  on-tertiary-container: '#29292b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e4'
  tertiary-fixed-dim: '#c8c6c8'
  on-tertiary-fixed: '#1b1b1d'
  on-tertiary-fixed-variant: '#474649'
  background: '#121317'
  on-background: '#e3e2e7'
  surface-variant: '#343539'
  typography:
  display-lg:
  fontFamily: Inter
  fontSize: 32px
  fontWeight: '700'
  lineHeight: 40px
  letterSpacing: -0.02em
  headline-md:
  fontFamily: Inter
  fontSize: 24px
  fontWeight: '600'
  lineHeight: 32px
  letterSpacing: -0.01em
  title-sm:
  fontFamily: Inter
  fontSize: 18px
  fontWeight: '600'
  lineHeight: 24px
  body-md:
  fontFamily: Inter
  fontSize: 14px
  fontWeight: '400'
  lineHeight: 20px
  label-caps:
  fontFamily: Inter
  fontSize: 12px
  fontWeight: '700'
  lineHeight: 16px
  letterSpacing: 0.05em
  mono-sm:
  fontFamily: Geist
  fontSize: 12px
  fontWeight: '500'
  lineHeight: 16px
  rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
  spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  deck-gutter: 12px
  sidebar-width: 280px

---

## Brand & Style

The design system for this desktop configurator is rooted in a "Dark Mode Pro" aesthetic, balancing industrial precision with high-performance digital utility. The target audience consists of streamers, developers, and power users who require a focused, distraction-free environment that prioritizes legibility and rapid recognition.

The style is a synthesis of **Minimalism** and **Modern Corporate**, utilizing heavy contrast and subtle depth to mimic the physical tactile nature of a hardware deck. Surfaces should feel high-end and weighted, using semi-matte finishes and crisp hardware-inspired details. The emotional response is one of control, efficiency, and professional-grade reliability.

## Colors

The palette is optimized for high-contrast visibility in low-light environments.

- **Primary (Electric Blue):** Reserved for active states, primary call-to-actions, and focused hardware keys.
- **Background Tiers:** The base interface uses a deep `#121212`. The Secondary Gray (`#1E1E1E`) is used for the main canvas/layout, while the Slate (`#2C2C2E`) serves as the "raised" surface for interactive cards and deck slots.
- **Status Accents:** Success, Warning, and Error colors are used sparingly for live status indicators, connectivity alerts, and destructive actions to ensure immediate user recognition without cluttering the visual field.

## Typography

Inter is used across the system for its exceptional legibility and neutral, technical feel. A strict hierarchy ensures that button labels and configuration metadata are easily distinguishable.

- **Display & Headlines:** Use tight letter spacing and bold weights to anchor the sections of the configurator.
- **Label-caps:** Specifically used for small metadata and hardware button labels to maximize clarity at small sizes.
- **Monospaced Accents:** For developer-facing plugins or technical hardware IDs, Geist (or a similar mono font) is used to provide a "code-like" precision.

## Layout & Spacing

The layout follows a precise **4px grid system** to ensure mathematical alignment across the dense UI.

- **Configurator Canvas:** A fixed-grid layout that mirrors the physical hardware (e.g., 3x5 or 4x8 grids).
- **Sidebars:** Fixed-width sidebars (280px) house the plugin library and property inspector, using `md` (16px) padding for internal content.
- **Responsiveness:** On smaller desktop windows, sidebars collapse into icons, and the deck grid scales proportionally to maintain the aspect ratio of the physical device keys.

## Elevation & Depth

To simulate a professional hardware interface, depth is achieved through **Tonal Layers** and **Inner Glows**.

- **Level 0 (Base):** Deepest black, used for the application background.
- **Level 1 (Panels):** `#1E1E1E` with a subtle 1px border of `#2C2C2E`.
- **Level 2 (Interactive Cards):** `#2C2C2E`. These elements use a 1px top-highlight (white at 5% opacity) to simulate a light source from above.
- **Active States:** Elements being edited or "pressed" use a subtle inner shadow to imply a physical depress, combined with an outer glow of the Primary Electric Blue.
- **Shadows:** Use large, highly diffused shadows (e.g., `0px 8px 24px rgba(0,0,0,0.5)`) for floating modals or dragged plugin icons.

## Shapes

The shape language is sophisticated and modern.

- **Standard UI Elements:** Use `rounded-lg` (16px) for main deck buttons and primary cards to create a friendly but technical feel.
- **Small Controls:** Input fields and secondary buttons use `rounded-md` (8px) for a tighter, more compact look.
- **Consistency:** All borders should be 1px or 1.5px thick, never exceeding 2px, to maintain a high-fidelity, "retina-ready" appearance.

## Components

- **Deck Keys:** These are the primary component. They feature a `16px` radius, a subtle gradient from top-to-bottom, and a 1px `#FFFFFF10` border. When a plugin is assigned, the icon is centered with a 2px gap from the bottom label.
- **Action Buttons:** Primary buttons are solid `#007AFF` with white text. Secondary buttons are outlined or semi-transparent gray backgrounds.
- **Input Fields:** Darker than the container background, with a subtle focus ring in Electric Blue.
- **Chips/Badges:** Used for plugin categories (e.g., "System," "Twitch," "OBS"). These are low-profile with `8px` rounded corners and small uppercase labels.
- **Plugin Library Cards:** High-quality imagery for previews should be clipped to the card's `12px` border radius, using a subtle overlay to ensure text legibility over the image.
- **Switch/Toggle:** Minimalist pill-shape using a high-contrast background for the "on" state to ensure visual clarity at a glance.
