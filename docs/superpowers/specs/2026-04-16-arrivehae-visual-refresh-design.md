# ArriveHae Visual Refresh Design

## Context

This document defines the visual refresh for the ArriveHae web MVP.

The goal is not to invent a new style from scratch. The approved direction is to translate the dark premium mood from the user's `stitch.zip` reference into a Korean transit app experience that feels polished on a laptop while still reading as a mobile app interface.

This visual refresh applies to the presentation-critical surfaces:

- Home screen
- Route selection screen
- Tracking screen
- Arrival alert modal

It does not change the core product architecture, route logic, tracking model, or alert model already defined in the MVP design spec.

## Design North Star

The product should feel like a calm but high-focus transit companion.

Three qualities define the target look:

- Cold tech premium
- Soft glass layering
- Korean commuter clarity

The interface should feel more like a premium mobile app than a desktop website. On a laptop, the UI should appear as a centered mobile app shell with a strong sense of atmosphere, not a generic responsive page.

## Source Reference

The primary visual reference is the user's `stitch.zip` package, especially these dark-mode screens:

- `stitch/_6/screen.png` for the home screen mood
- `stitch/_7/screen.png` for the live tracking layout
- `stitch/_8/screen.png` for the alert modal treatment

The supporting system guidance comes from `stitch/serene_wayfinding/DESIGN.md`, with one intentional adaptation:

- The original reference leans editorial and sanctuary-like
- ArriveHae keeps the same softness and layering, but shifts the tone slightly toward tech precision and transit readability

## Product Framing

The brand stays in English as `ArriveHae`.

All user-facing interface copy should be Korean, because the target user is Korean and the demo context is Korean public transit usage.

The final experience should communicate this balance:

- Brand identity in English
- Product comprehension in Korean

## Layout Model

The product should render as a mobile-app-like shell inside the browser.

### App Shell Rules

- Target shell width: `390px` to `430px`
- Shell height: tall portrait canvas sized to fit laptop viewport
- Shell placement: centered
- Outer stage: dark atmospheric background with subtle gradient bloom
- Shell shape: oversized radius with soft clipping

### Structural Regions

Every main surface should share the same shell logic:

- Top app bar
- Scrollable content body
- Bottom tab navigation

Desktop-style top navigation must not appear alongside the mobile shell.

## Typography

The approved typography direction is cold tech premium.

### Font Pairing

- Brand, numbers, route labels, high-emphasis metrics: `Sora`
- Korean body copy, buttons, helper text, settings text: `Pretendard Variable`

### Usage Rules

- `ArriveHae` wordmark uses `Sora`
- Remaining-stop numbers, ETA, route number chips, line badges use `Sora`
- Body paragraphs, form labels, button text, settings descriptions use `Pretendard Variable`
- Large metrics should feel sharp and slightly futuristic
- Korean text should remain highly legible and neutral

### Hierarchy

- Hero values should be large and visually compressed
- Supporting text should drop in weight and contrast quickly
- The screen should never feel typographically noisy

## Color System

The palette should closely follow the approved dark reference.

### Core Colors

- Background: `#060B14`
- Deep surface: `#101827`
- Elevated surface: `#151E31`
- Lavender accent: `#A595FD`
- Lavender glow: `rgba(165, 149, 253, 0.22)`
- Mint accent: `#7DE7C5`
- Secondary blue: `#8FC7F7`
- Primary text: `#F3F7FF`
- Muted text: `#97A6BF`

### Status Colors

- Active or success states: mint
- Current position or selected route: lavender
- Info or secondary transit context: soft blue
- Warning states: muted rose, not bright alarm red

### Layering Rule

Hard borders should be minimized. Separation should come primarily from:

- tonal shifts
- opacity
- blur
- glow
- spacing

If a border is necessary, it should read as a ghost outline rather than a sharp edge.

## Surface Language

The UI should use soft floating panels instead of rigid rectangular containers.

### Card Treatment

- Large corner radii
- Dark translucent surfaces
- Light blur on elevated panels
- Subtle internal glow or ambient shadow
- No harsh 1px card grid look

### Glass Rule

Use glass selectively:

- navigation surfaces
- overlays
- modal containers
- key floating cards

Do not make the whole app uniformly frosted. The effect should feel intentional and sparse.

## Component Rules

### Home Screen

The home screen should sell the product immediately.

### Role

- Brand impression
- Fast destination input
- Recent route re-entry

### Content Priority

1. Korean functional headline
2. Search and route input
3. Quick destination cards
4. Recent route list

### Visual Rules

- The hero should feel elegant, not busy
- Search surfaces should be large pill inputs
- Quick destination cards should use the lavender and mint pairing
- The background map texture can exist, but it must not compete with the input flow

### Example Korean Tone

- `지금 어디서 내려야 할지 놓치지 마세요`
- `출발지`
- `도착지`
- `길찾기`
- `최근 경로`

## Route Selection Screen

This screen should optimize comparison and confidence.

### Role

- Let users scan multiple options quickly
- Make transfer burden obvious
- Support a confident route selection in one glance

### Route Card Structure

- Total travel time
- Arrival time
- Transfer count
- Major line chips
- One-line journey summary

### Example Summary Tone

- `버스 12정거장 후 2호선으로 환승`
- `지하철 4개 역 이동 후 도보 3분`

### Visual Rules

- Recommended route gets lavender emphasis
- Secondary routes should remain calm and readable
- Cards should have stronger information hierarchy than the reference home cards
- CTA should be visually obvious without looking like enterprise software

## Tracking Screen

This is the most important screen in the presentation.

### Role

- Keep the user focused on when to get off
- Show progress clearly
- Build tension before the alert moment

### Content Priority

1. Remaining stops or stations
2. Next transfer or next stop
3. Current line or route context
4. Timing until next alert
5. Demo controls

### Visual Rules

- Remaining stop count must be the largest text on the screen
- Current position should glow in lavender
- Next stop name should use mint emphasis
- The tracking timeline should feel alive, not static
- Demo controls should look integrated, not developer-only

### Example Korean Tone

- `2정거장 남았어요`
- `다음 하차: 서울역`
- `곧 환승할 시간이에요`
- `도착 전 알림 준비 중`

## Alert Modal

The alert modal is the signature moment.

### Role

- Stop the user at the exact right moment
- Feel premium and urgent without panic

### Structure

- Large vibration or alert icon
- Short Korean headline
- One sentence of concrete guidance
- One dominant CTA
- Optional small snooze action

### Example Korean Tone

- `곧 내릴 시간이에요`
- `서울역까지 2정거장 남았어요`
- `다음 역에서 하차 준비를 해주세요`
- `확인`
- `1분 뒤 다시 알림`

### Visual Rules

- Strong center composition
- Deep blurred background
- Large lavender CTA
- Breathing room between icon, message, and action

## Navigation

The bottom tab bar should remain visible and app-like.

### Rules

- Rounded floating bar
- Three or four tabs maximum
- Active tab indicated by filled or glowing treatment
- Labels in Korean

Suggested tabs:

- `홈`
- `경로`
- `알림`
- `설정`

## Korean Copy Standard

All visible interface copy should be localized into Korean unless the text is part of the brand identity.

### Keep in English

- `ArriveHae`

### Convert to Korean

- buttons
- labels
- system states
- notifications
- helper text
- settings
- route summaries

### Tone

- clear
- short
- commuter-friendly
- not poetic
- not overly formal

The app should sound like a polished Korean consumer app, not a translated prototype.

## Motion

Motion should be minimal but meaningful.

### Approved Motion Types

- soft page entrance
- subtle card fade and rise
- route progress pulse
- alert modal scale and fade

### Avoid

- bouncy gimmick animation
- noisy hover theatrics
- excessive shimmer

## Accessibility and Readability

The reference mood should not override readability.

### Requirements

- Text contrast must remain strong on dark surfaces
- Korean copy must be legible at mobile size
- Critical CTA buttons must be easy to distinguish
- Remaining-stop metrics must be readable at a glance from presentation distance

## Non-Goals

This refresh does not introduce:

- a light theme
- desktop-web navigation patterns
- map-heavy information dominance
- English-first product copy
- bright utility-app colors

## Implementation Guidance

The visual implementation should be done as a system, not as isolated screen patches.

The implementation should update:

- design tokens
- global shell styling
- typography loading
- reusable card, chip, button, and modal treatments
- Korean UI copy across core presentation screens

The result should feel like one coherent product, not a set of individually prettified screens.


