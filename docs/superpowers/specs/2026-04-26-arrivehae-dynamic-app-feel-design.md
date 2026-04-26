# ArriveHae Dynamic App Feel Design

## Context

This document extends the approved ArriveHae visual refresh with a second layer: motion, responsiveness, and live-demo behavior.

The current UI is visually polished, but it still reads too much like a static presentation board or a finished mockup. The goal of this design is to make the product feel like a real app that is actively running, reacting, and guiding the user through a transit trip.

This work focuses on the presentation layer and playback behavior for the laptop demo. It does not replace the existing route search, tracking, or alert logic. It adds a stronger sense of state progression and live interaction on top of the current MVP.

## Problem Statement

The current build feels static for three reasons:

- screen transitions are mostly instantaneous
- cards and panels appear as finished layouts, not as reactive UI
- the trip demo does not yet feel like a continuously running experience

The user's goal is not decorative animation. The goal is a product that feels like an actual mobile app in use.

Three qualities define success:

- screen transitions feel alive
- route progress and alerts feel reactive
- the full demo feels like a guided live session rather than a slideshow

## Design North Star

ArriveHae should feel like a premium commuter app that is always gently in motion.

The interface should not behave like a motion-heavy concept video. It should behave like a focused real product:

- calm when idle
- responsive when touched
- obviously live when a trip is in progress

The right reference is not "fancy animation." The right reference is "this app is continuously doing something meaningful."

## Experience Model

The approved interaction direction is:

- whole-flow dynamic experience
- semi-automatic demo playback

That means the entire product should feel reactive, but the strongest sense of movement should still happen during route tracking and alert moments.

The demo should autoplay by default, while still giving the presenter control over pause, resume, and step-forward behavior.

## Desired Product Feel

The app should create four different layers of motion:

### 1. Entry Motion

When a screen first appears, it should settle into place rather than snap in.

This includes:

- shell-level soft entrance
- staggered content reveal
- subtle bloom or depth shift in the background

Entry motion should be short and refined. It should make the UI feel loaded and alive, not animated for its own sake.

### 2. Interaction Motion

Whenever the user taps, selects, expands, or changes route state, the UI should answer immediately.

This includes:

- pressed states
- small lift or sink reactions
- active-card emphasis
- selection transitions that feel connected

Interaction motion should communicate confirmation.

### 3. Progress Motion

During trip playback, the UI should keep showing that time is passing and the trip is advancing.

This includes:

- remaining-stop count transitions
- pulsing current-position indicators
- timeline advancement
- changing status labels

Progress motion is the core of the "real app" feeling.

### 4. Alert Motion

Alerts should interrupt the background state with clear urgency, then hand the user back into the flow.

This includes:

- modal or sheet entrance
- background dim and focus shift
- confirm-driven continuation into the next trip state

Alert motion should feel precise and trustworthy, not dramatic.

## Recommended Experience Direction

The approved direction is `real-use app feel`.

This means:

- the home and route screens should be mildly animated
- the tracking and alert moments should be clearly and intentionally animated
- the UI should feel like a product with internal state, not a poster with transition effects

The strongest motion budget belongs to:

1. route selection response
2. stop countdown updates
3. alert modal presentation

## Screen-by-Screen Motion Design

## Home Screen

### Goal

The home screen should feel like an app opening, not a static landing page.

### Behavior

- the shell is already present, but the content should reveal in sequence
- app bar, hero card, quick destination row, and search card should enter with short staggered timing
- background glow should drift slowly enough to be felt but not noticed as a gimmick
- quick destination cards should react instantly when tapped
- selecting a quick destination should visibly populate the search field
- pressing `길찾기` should switch immediately into an in-progress state

### Motion Rules

- use short fade-and-rise motion for entry
- use very small transform movement for hover or tap response
- use skeleton or placeholder loading states instead of empty gaps

## Route Selection Screen

### Goal

The route selection area should feel responsive to user choice.

### Behavior

- result cards should reveal sequentially once routes are loaded
- the recommended route should receive a short highlight pass when it first appears
- selecting a route should not feel like two unrelated components updating
- the chosen route card and detail card should feel connected, as if the detail view expands out of the selected route

### Motion Rules

- cards rise in with small stagger
- selected route gains emphasis through glow, border shift, and elevation
- detail panel should appear with expansion or connected fade, not with a harsh replacement

## Tracking Screen

### Goal

The tracking screen should feel actively live.

### Behavior

- the remaining-stop number should animate when it changes
- timeline or current-position markers should pulse subtly while the trip is running
- status chips such as current line, next alert, or next stop should update as part of the playback loop
- pause and resume should visibly affect the live state
- step-forward should move the trip to the next meaningful state without breaking continuity

### Motion Rules

- remaining-stop numbers should animate on change with scale and fade transition
- current position indicators should pulse at a slow rhythm
- timeline progress should advance along with stop count changes
- paused mode should reduce pulsing intensity and clearly indicate that playback is halted

## Alert Modal

### Goal

The alert should feel like the core product moment.

### Behavior

- background should dim and recede
- modal should enter with a quick focused lift
- headline and route context should be immediately legible
- confirming the alert should either move to the next alert in queue or return cleanly to tracking

### Motion Rules

- modal entrance should be stronger than ordinary screen transitions
- modal exit should be shorter than entrance
- first alert closes into resumed progress or next alert, not into a dead pause

## Demo Playback Model

The approved control model is `semi-automatic demo playback`.

## Playback Principles

- autoplay is the default mode
- the presenter can intervene when needed
- the app should still look alive when no intervention happens

## Required Presenter Controls

- `일시정지`
- `다시 시작`
- `다음 단계`
- `처음부터 다시`

## Control Philosophy

These controls should not feel like a developer debug harness. They should feel like internal demo controls that belong to the product.

They can be most visible on the tracking screen, but should not dominate the layout.

## Playback Timing

The demo should compress real travel time into a presentation-safe rhythm.

Recommended default timing:

- stop update cadence around `1.2s` to `1.8s` per step
- slightly tighter timing just before an alert
- immediate halt when paused
- immediate step when `다음 단계` is pressed

The demo should never feel sluggish. It should also never move so quickly that the audience misses the product behavior.

## Interaction State Model

The UI should be driven by explicit state names, not one-off animation hooks.

## Demo Playback State

Add a playback-oriented presentation state with at least these modes:

- `idle`
- `auto_playing`
- `paused`
- `alert_open`
- `completed`

## Screen Reaction State

Each major screen should have presentation states that map to visible behavior.

### Home

- `entered`
- `searching`
- `results_ready`

### Route Results

- `list_revealed`
- `route_selected`
- `detail_expanded`

### Tracking

- `live`
- `countdown_updated`
- `paused`

### Alert

- `opening`
- `active`
- `closing`

These state names should drive CSS classes or animation variants so motion remains consistent and testable.

## Motion System Rules

The motion system should stay performance-safe and composable.

### Preferred Animation Properties

- `transform`
- `opacity`
- light `filter`

Avoid layout-thrashing transitions wherever possible.

### Motion Tone

- home and results should use softer, more atmospheric transitions
- tracking and alerts should use sharper, clearer reactions
- not every moving element should use the same easing curve

Information changes and warning moments should feel different.

## Demo Controls Surface

The presenter controls should be visible enough for reliable live use, but still feel product-native.

### Visual Direction

- premium utility control bar
- integrated with the tracking screen
- not hidden in a raw debug panel

### Behavior

- controls should update instantly
- pause state should be obvious
- step-forward should advance one meaningful playback step
- restart should fully reset demo progression and related presentation state

## Testing Requirements

This change adds visible behavior and state sequencing, so testing should cover both state logic and end-to-end feel.

## Unit Tests

Must cover:

- playback state changes
- pause and resume behavior
- step-forward behavior
- alert queue progression
- stop-count transition triggers

## End-to-End Tests

Must cover:

- demo start from settings
- remaining-stop updates
- transfer alert appearance
- alert confirmation into next state
- final arrival alert appearance

## Non-Goals

This design does not aim to:

- turn ArriveHae into a flashy concept animation
- add complex physics-based motion everywhere
- simulate real GPS with perfect fidelity
- introduce native mobile-only behaviors the browser cannot support reliably

The goal is believable motion and live responsiveness, not spectacle.

## Implementation Guidance

This should be implemented as a presentation-state upgrade, not as scattered animations.

That means:

- define explicit playback and presentation states
- connect screen behavior to those states
- add reusable motion classes or variants
- keep timing and transitions systematized

The product should still feel cohesive with the existing dark premium design system. Motion should deepen the app feel, not replace the design language.

## Success Criteria

This work is successful if, during a laptop demo:

- the app no longer feels like a static slide
- the audience can see that the product is continuously progressing
- route selection, tracking, and alerts feel connected
- the presenter can control the pace without breaking immersion
- the overall impression is "real app in use"
