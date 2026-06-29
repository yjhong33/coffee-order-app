# Wanted Design System

A faithful, code-first recreation of the **Wanted Design System** — the design
language behind [Wanted](https://www.wanted.co.kr), Korea's leading job-matching
and career platform (Wanted Lab, Inc.). Built for designing on-brand Wanted
interfaces and assets — production or throwaway prototypes.

> **Source of truth:** the attached Figma community file *"Wanted Design System
> (Community)"*. Tokens, type ramp, icons and the wordmark were extracted directly
> from that file; components were re-authored as clean React primitives against the
> extracted tokens. The file is large (770+ component sets, 494 variables) — this
> system captures the full token + foundation layer and the core, high-use
> component families rather than every variant permutation.

---

## What's here

| Area | Location |
|------|----------|
| Global CSS entry | `styles.css` (import this one file) |
| Tokens | `tokens/` — fonts, colors (fig-tokens + aliases), typography, spacing, base |
| Icons | `assets/icons/` — `Icon` component + 54 cleaned glyphs (`icon-data.js`) |
| Brand | `assets/brand/` — `WantedLogo` component |
| Components | `components/<group>/` — actions, selection, forms, content, feedback, navigation |
| UI kit | `ui_kits/wanted/` — interactive job-platform web app |
| Foundation cards | `guidelines/` — Colors, Type, Spacing, Brand specimen cards |

The compiler bundles every `<Name>.jsx`+`<Name>.d.ts` pair into `_ds_bundle.js`,
exposed on `window.WantedDesignSystem_4dbc66`. In card/kit HTML:
`const { Button, Icon } = window.WantedDesignSystem_4dbc66;`

---

## Components (23)

- **Actions** — `Button`, `IconButton`
- **Selection** — `Chip`, `Checkbox`, `Radio`, `Switch`
- **Forms** — `TextField`, `Select`
- **Content** — `Avatar`, `Badge`, `ContentBadge`, `Card`, `Divider`
- **Feedback** — `Alert`, `Toast`, `Tooltip`, `Skeleton`, `ProgressCircular`
- **Navigation** — `Tabs`, `SegmentedControl`, `BottomNavigation`, `ListCell`
- **Brand / Icon** — `WantedLogo`, `Icon`

---

## CONTENT FUNDAMENTALS

How Wanted writes — the product voice is **warm, direct, and encouraging**, never
bureaucratic.

- **Language:** Korean, always **존댓말** (polite "-요/-세요" endings). The product
  speaks *to* the user as a helpful guide: "관심 직무를 고르면 딱 맞는 포지션을 추천해
  드려요." Never 반말, never stiff officialese ("처리되었습니다" → instead "완료됐어요").
- **Person:** addresses the user as "you" implicitly; the service refers to itself as
  원티드. Encouraging and benefit-led ("지원만 해도 합격축하금을 드려요").
- **Casing (Latin):** product/sub-brand names lowercase in the logotype ("wanted"),
  Title Case in running text ("Wanted Match"). Job titles and tech stacks keep their
  conventional casing (React, TypeScript, iOS).
- **Numbers:** Korean units — 만원 for money (합격축하금 1,000만원), D-day countdowns
  (D-3), relative time (2일 전).
- **Tone words:** 간편, 딱 맞는, 함께, 성장, 기회, 축하. Avoid 오류/실패 framing; soften
  to "다시 시도해 주세요".
- **Emoji:** essentially none in the core product UI. Don't add them.
- **Length:** short. Headlines are one breath; body copy two lines max in cards.

---

## VISUAL FOUNDATIONS

- **Color:** a single confident **brand blue `#0066FF`** (`--primary-normal`) carries
  nearly all emphasis — CTAs, links, active states, reward amounts. Neutrals are a
  **cool-grey** ramp; text is expressed as *opacity steps on near-black* (Strong 100%
  → Normal #171717 → Neutral 88% → Alternative 61% → Assistive 28% → Disable 16%)
  rather than distinct greys. Status: green `#00BF40`, red `#FF4242`, orange `#FF9200`.
  A muted **accent palette** (violet, cyan, lime, pink…) is reserved for content tags.
- **Type:** **Pretendard** for all UI (the file uses "Pretendard JP"); **Wanted Sans**
  is the brand display face. A long, optical ramp — Display → Title → Heading →
  Headline → Body → Label → Caption — with letter-spacing tightening as size grows
  and loosening below body size. Headings 600–700, body 400, labels 500.
- **Spacing:** 4px base grid; screen margins 16/20/24/32 by breakpoint; max content
  width ~1060px.
- **Corners:** soft and generous — controls 8–12px, cards 16px, hero surfaces
  20–24px, chips & avatars full-round. Nothing sharp.
- **Backgrounds:** clean and bright — white pages, a faint cool-grey (#F7F7F8) for
  fields and section bands. The one place gradient appears is **brand hero blocks**
  (blue → lighter blue / violet); never behind body content.
- **Cards:** white with either a **hairline** (`inset 0 0 0 1px` at ~22% neutral) or a
  **soft neutral shadow** — never colored glows. Elevation shadows are subtle and grey.
- **Fills & lines:** interactive neutrals are **translucent** (`rgba(112,115,124,…)`)
  at 5 / 8 / 16% — they sit on any background. Hairlines likewise translucent.
- **Animation:** quick and restrained — 120–160ms ease on color/background; press
  states **scale down** (~0.94–0.97); switch knob slides on a cubic curve. No bounce,
  no decorative looping motion.
- **Hover:** solid buttons **darken** (Primary → Strong → Heavy); ghost/outlined gain
  a faint neutral fill; cards lift 2px. **Press:** darker still + slight shrink.
- **Imagery:** photography is bright and human; company tiles in this kit use
  brand-colored gradient blocks as placeholders.
- **Dark mode:** the token set ships a full dark theme (`:root[data-theme="dark"]`).

---

## ICONOGRAPHY

- **System:** Wanted's own line-icon set — geometric, rounded terminals, **24×24**
  grid, ~1.5px optical weight, drawn on a consistent baseline. Most glyphs have a
  **line (outline)** and a **fill** variant (e.g. `bookmark` / `bookmark-fill`).
- **Delivery:** extracted from the Figma file into `assets/icons/icon-data.js` (path
  data) and rendered via the `<Icon name="…" size={24} />` component. Icons paint with
  `currentColor` — set `color` on the element to recolor. 54 glyphs are included
  (navigation, actions, status, chevrons/arrows, toggles like circle/square/check).
- **Not used:** no emoji, no Unicode glyph icons, no icon font. Always use `<Icon>`.
- **Coverage note:** the full Figma set is ~126 glyphs; the 54 most-used UI icons were
  extracted and cleaned. More can be pulled from the source file on request.
- **Logo:** the `wanted` wordmark is vectorized in `assets/brand/WantedLogo.jsx`
  (symbol + wordmark lockup), colorable, defaults to brand blue.

---

## Index / manifest

- `styles.css` — global CSS entry (import only)
- `tokens/` — `fonts.css`, `fig-tokens.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `assets/icons/` — `Icon.jsx`, `icon-data.js`, `icons.card.html`
- `assets/brand/` — `WantedLogo.jsx`
- `components/actions|selection|forms|content|feedback|navigation/` — primitives + `.d.ts` + cards
- `ui_kits/wanted/` — interactive job-platform web app (`index.html`)
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `SKILL.md` — Agent-Skill manifest

## Caveats & substitutions

- **Fonts** are loaded from jsDelivr CDN (Pretendard variable + Wanted Sans variable).
  Self-host the woff2 for production. The Figma file labels the UI face "Pretendard
  JP"; the standard Pretendard build is the closest open distribution.
- Components are clean re-authorings sized to the Wanted spec, not 1:1 copies of every
  Figma variant. The token + foundation layer is complete; the component layer covers
  the core families.
