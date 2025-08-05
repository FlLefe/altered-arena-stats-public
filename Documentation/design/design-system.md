# 🎨 Design System – Altered Arena Stats

This document defines the visual identity for the web application Altered Arena Stats. It blends inspiration from the Altered TCG universe with a clean, modern data dashboard style.

---

## 🖋️ Typography

- **Primary font:** [Inter](https://fonts.google.com/specimen/Inter)
- **Fallback:** `sans-serif`
- **Default size:** `16px`
- **Usage:**
  - Headings: `font-weight: 600`
  - Body text: `font-weight: 400`
  - Buttons: `font-weight: 500`

---

## 🌈 Color Palette

### 🎭 Theme Modes

- 🌞 **Light Theme** (default)
- 🌚 **Dark Theme** (based on system or user preference)

### ⚔️ Altered Factions Colors

| Faction | Color  | HEX       |
| ------- | ------ | --------- |
| Axiom   | Brown  | `#884F34` |
| Bravos  | Red    | `#AB2433` |
| Lyra    | Pink   | `#CA4B6C` |
| Muna    | Green  | `#2D6A42` |
| Ordis   | Blue   | `#026190` |
| Yzmir   | Violet | `#6F4F94` |

> These colors will be used for faction-specific tags, filters, or stat backgrounds.

### 🎨 Base UI Palette

| Purpose        | Light Mode | Dark Mode |
| -------------- | ---------- | --------- |
| Background     | `#FFFFFF`  | `#0F0F0F` |
| Surface        | `#F8F9FA`  | `#1A1A1A` |
| Primary Text   | `#1F2937`  | `#E5E7EB` |
| Secondary Text | `#6B7280`  | `#9CA3AF` |
| CTA Primary    | `#0EA5E9`  | `#38BDF8` |
| Danger         | `#DC2626`  | `#F87171` |
| Success        | `#16A34A`  | `#4ADE80` |
| Border         | `#E5E7EB`  | `#374151` |

---

## 🧩 UI Components (via ShadCN)

> All components are based on [ShadCN](https://ui.shadcn.com) with Tailwind utility classes and class variants.

### Buttons

- **Size:** `md` (e.g. `h-10 px-4`)
- **Border radius:** `rounded-lg`
- **Variants:**
  - `default` → main CTA
  - `outline` → secondary action
  - `destructive` → delete/danger
  - `ghost` → subtle/unstyled nav

### Inputs

- **Padding:** `h-10 px-3`
- **States:** focus, error, disabled
- **Accessibility:** always include `label` and `aria-describedby`

### Alerts & Feedback

- **Success:** green background + check icon
- **Error:** red background + warning icon
- **Info:** blue background + info icon

---

## 📐 Layout & Spacing

- **Grid:**
  - Desktop: 12 columns
  - Tablet: 8 columns
  - Mobile: 4 columns
- **Spacing scale:**
  - `8px`, `16px`, `32px` used consistently
- **Tailwind breakpoints:**
  - `sm` → 640px
  - `md` → 768px
  - `lg` → 1024px
  - `xl` → 1280px

---

## 🖼️ Icons & Imagery

- No official logo yet
- Icon set: `lucide-react` (line style)
- Icon size: `20–24px`

---

## ♿ Accessibility

- WCAG AA contrast checked
- Focus states always visible
- Minimum font size: `14px`
- Keyboard navigation supported

---

## 💡 Modes & Transitions

- Dark mode via Tailwind's `dark` class
- Transitions: `ease-in-out`, `150–300ms`
- Motion respect: `prefers-reduced-motion` supported

---

## 🎯 Design Tokens (next step)

→ Will be implemented via Tailwind config and class utilities or as design token files (`theme.ts`, `colors.ts`, etc.)
