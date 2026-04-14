# ArriveHae Agent Guide

## Project Summary

ArriveHae is a presentation-first web MVP for a transit alarm product.
The core problem is simple: users fall asleep or get distracted on public transit and miss their stop.
The short-term goal is a web MVP that can be demonstrated in laptop Chrome within 2 weeks.
The longer-term goal is a real mobile app with stronger live tracking, login, and cloud-backed persistence.

## Product Goal

Build an app-like web experience that:

- lets the user search public transit routes
- shows multiple route options
- allows one route to be selected
- starts tracking only after the user taps `Boarding Start`
- alerts before transfer and again near the final destination
- supports both `simulation mode` and `live location mode`

## Presentation Constraints

- Demo environment: laptop Chrome browser
- Visual direction: mobile app shell rendered inside the browser, not a desktop website
- Reliability priority: simulation mode must always work for the presentation
- Expansion path: architecture must grow cleanly into live tracking, login, cloud storage, and later native app builds
- Deployment target: Vercel

## Approved Scope

### Must Ship For Midterm Demo

- Google transit route search
- Route option cards
- Route detail view
- Boarding start flow
- Tracking screen
- Transfer alert
- Final destination alert
- Browser notification support when another tab is open
- Deterministic simulation mode for rehearsed demos

### Nice To Have For Demo

- Recent routes in local storage
- Favorite routes in local storage

### Deferred Beyond MVP

- Account login
- Cloud sync across devices
- Native app packaging
- Naver + Google provider selection
- Full walking-segment tracking

## UX Principles

- Always look like a mobile app, even on a laptop
- Use a centered mobile-width app shell, around 390px to 430px wide
- Do not mix desktop top navigation with mobile tab navigation
- Prioritize clarity over decorative calmness
- Keep the dark theme as the presentation-default theme
- Make the alert moment the signature interaction

## Core User Flow

1. User enters origin and destination.
2. The app requests Google transit routes.
3. The app shows multiple route options.
4. The user chooses one route.
5. The route detail screen shows transit segments, stop counts, and alert settings.
6. The user taps `Boarding Start`.
7. Tracking begins for transit segments only.
8. The app issues a transfer alert before the transfer exit.
9. The app issues a final near-arrival alert before the final destination stop.

## Architecture Overview

Keep the system separated into replaceable layers.

### Route Layer

Responsibilities:

- call the transit API provider
- normalize provider responses into internal models
- expose route options to the UI

Primary interfaces:

- `TransitProvider`
- `RouteNormalizer`

### Tracking Layer

Responsibilities:

- track current transit segment
- estimate remaining stops
- switch between simulation and live location sources
- prevent unstable GPS jumps from causing false stop changes

Primary interfaces:

- `LocationSource`
- `TrackingEngine`
- `ProgressEstimator`

### Alert And Persistence Layer

Responsibilities:

- decide when to fire transfer alerts and final alerts
- deliver browser notifications, in-app alerts, and optional sound
- save recent routes and favorites
- later expand into account-based persistence

Primary interfaces:

- `AlertEngine`
- `NotificationGateway`
- `StorageGateway`
- future: `AuthGateway`

## Core Domain Model

- `RouteSearch`: origin, destination, departure time, search timestamp
- `RouteOption`: one candidate route with total duration, transfers, labels, ETA
- `RouteSegment`: one step inside a route, typed as `WALK`, `BUS`, or `SUBWAY`
- `TransitSegmentDetails`: route name, headsign, departure stop, arrival stop, stop count
- `AlertRule`: bus stop threshold, subway stop threshold, transfer alert toggle, final alert toggle
- `TrackingSession`: selected route, current segment index, emitted alerts, active mode, timestamps
- `SavedRoute`: favorite or recent route snapshot for local storage and later cloud sync

## Harness Programming Notes

The project should be built so Codex can inspect, replay, and verify behavior without guessing.
Treat the harness as a first-class product feature, not a testing afterthought.

### 1. Deterministic Simulation Harness

The presentation depends on a deterministic simulation path.
Build a harness that can replay a full ride from a saved scenario.

Required properties:

- fixed scenario seed
- fixed clock stepping
- known route fixture IDs
- predictable stop advancement
- predictable alert timestamps

Suggested artifacts:

- `src/features/simulation/scenarios/demo-seoul-01.json`
- `src/features/simulation/scenarios/demo-seoul-transfer.json`
- `src/features/simulation/SimulationLocationSource.ts`
- `src/features/simulation/useSimulationControls.ts`

### 2. Provider Boundary

Never let raw Google responses spread through the app.
All provider responses must be normalized before UI consumption.

Codex should always be able to inspect:

- the provider request shape
- the normalized route model
- one fixture file per major route shape

Suggested artifacts:

- `src/features/routes/providers/google/GoogleTransitProvider.ts`
- `src/features/routes/providers/google/googleRoute.fixture.json`
- `src/features/routes/normalizers/normalizeGoogleRoute.ts`

### 3. Replayable Tracking Sessions

Tracking logic must be replayable from saved inputs.
Given a route fixture plus a position sequence, the engine should produce the same remaining-stop sequence every time.

Codex-verifiable inputs:

- route fixture
- location event stream
- alert rule set
- expected alert emission log

Suggested artifacts:

- `src/features/tracking/TrackingEngine.ts`
- `src/features/tracking/__tests__/trackingEngine.test.ts`
- `src/features/tracking/fixtures/location-sequence.transfer.json`

### 4. Notification Harness

Browser notifications can fail because of permissions or browser state.
Wrap them in a gateway so simulation and test runs can capture alert emissions without the real Notification API.

Suggested artifacts:

- `src/features/alerts/NotificationGateway.ts`
- `src/features/alerts/BrowserNotificationGateway.ts`
- `src/features/alerts/InMemoryNotificationGateway.ts`

### 5. Storage Harness

Favorites and recents should use one storage boundary from day one.
The first implementation is local storage, but the interface must support future account storage.

Suggested artifacts:

- `src/features/storage/StorageGateway.ts`
- `src/features/storage/LocalStorageGateway.ts`
- future: `src/features/storage/CloudStorageGateway.ts`

### 6. Debug And Demo Tools

Add a developer-only debug panel so Codex and humans can inspect the current state fast.

The debug panel should show:

- current route ID
- current segment index
- current stop index
- remaining stops
- active alert rules
- emitted alert history
- location source mode: `LIVE` or `SIMULATION`

Suggested artifact:

- `src/features/debug/DebugPanel.tsx`

### 7. Verification Strategy

The project should be verifiable at three levels:

- unit: route normalization, stop estimation, alert decisions
- integration: search -> route select -> boarding start -> alert emissions
- presentation: one full demo scenario in Playwright using simulation mode

Suggested command targets:

- `npm run test`
- `npm run test:watch`
- `npm run test:e2e`
- `npm run lint`

## Recommended Initial Stack

Unless changed by the team, optimize for speed and clarity:

- Vite
- React
- TypeScript
- React Router
- Zustand or lightweight app store
- plain CSS modules or scoped CSS for the mobile app shell
- Vitest + Testing Library
- Playwright
- Vercel

## Design Direction Notes

- Preferred product name: `ArriveHae`
- Preferred presentation theme: dark mode
- Mobile app shell centered on the page
- Alert modal should be the strongest visual moment
- Use Korean transit context in demo copy, even when data is mocked

## Delivery Priority

1. Search, route selection, boarding start, tracking, alerts
2. Simulation mode polish and demo stability
3. Favorites and recents in local storage
4. Login and cloud persistence later

## Working Rules For Codex

- Do not optimize the app for a generic desktop website layout
- Do not mix raw provider data directly into UI components
- Keep simulation mode working at all times
- Prefer interfaces and fixtures over hidden logic
- If a change makes the presentation demo less deterministic, treat it as a regression
