# ArriveHae TODO

## 1. Project Foundation

- [ ] Initialize the web app project scaffold
- [ ] Set up TypeScript, linting, formatting, and test scripts
- [ ] Add a mobile-width app shell layout for laptop Chrome demos
- [ ] Create the dark-theme-first design token set
- [ ] Add a developer debug flag and environment config strategy

## 2. Navigation And App Shell

- [ ] Build the mobile app shell with top app bar, content area, and bottom tab bar
- [ ] Define screens for Home, Route Results, Route Detail, Tracking, and Settings
- [ ] Remove desktop-style navigation patterns from the shell
- [ ] Add shared transitions so screen changes feel app-like

## 3. Transit Search And Provider Integration

- [ ] Add Google transit provider setup and API key handling
- [ ] Implement origin/destination search inputs
- [ ] Request transit routes from Google APIs
- [ ] Normalize provider responses into internal route models
- [ ] Add fallback and error states for slow or failed route loads

## 4. Route Selection Experience

- [ ] Build route option cards with duration, transfer count, and ETA
- [ ] Add route detail breakdown by transit segment
- [ ] Show stop count and transfer structure in the detail view
- [ ] Add the `Boarding Start` CTA only after route selection

## 5. Tracking Engine

- [ ] Define `TrackingSession`, `RouteSegment`, and `AlertRule` models
- [ ] Implement tracking state transitions for idle, active, paused, completed
- [ ] Estimate current segment and remaining stops from position events
- [ ] Handle GPS instability with a stabilization rule
- [ ] Prevent duplicate alerts inside one session

## 6. Simulation Harness

- [ ] Add deterministic demo scenario fixtures
- [ ] Implement `SimulationLocationSource`
- [ ] Create a simulation control panel for start, pause, resume, and speed
- [ ] Make simulation drive the same tracking engine used by live mode
- [ ] Add one polished transfer scenario for the presentation

## 7. Live Location Mode

- [ ] Wrap browser geolocation in `LiveLocationSource`
- [ ] Add permission request and denial handling
- [ ] Show clear fallback to simulation mode when live tracking is unavailable
- [ ] Keep transit-only tracking active while excluding walking segments

## 8. Alert Engine

- [ ] Implement bus stop threshold alerts
- [ ] Implement subway station threshold alerts
- [ ] Implement transfer alert behavior behind the toggle
- [ ] Implement final near-destination alert behavior
- [ ] Add alert history tracking for debugging and verification

## 9. Notification Delivery

- [ ] Wrap the browser Notification API in a gateway
- [ ] Add in-app modal alerts as a fallback
- [ ] Add optional sound playback support
- [ ] Add a browser-tab-background verification path

## 10. Favorites And Recent Routes

- [ ] Create storage interfaces for favorites and recents
- [ ] Implement localStorage-backed saving
- [ ] Add favorite toggle in the route detail screen
- [ ] Auto-save recent routes after selection or completion
- [ ] Expose favorites and recents on the home screen

## 11. Settings

- [ ] Add bus alert threshold controls
- [ ] Add subway alert threshold controls
- [ ] Add transfer alert toggle
- [ ] Add sound and vibration preferences where relevant
- [ ] Persist settings locally

## 12. QA, Demo, And Verification

- [ ] Add unit tests for route normalization
- [ ] Add unit tests for stop estimation and alert decisions
- [ ] Add integration tests for the main search-to-alert flow
- [ ] Add one Playwright demo scenario for the midterm presentation
- [ ] Prepare a backup script using simulation mode only

## 13. Deployment

- [ ] Prepare Vercel project settings and environment variable checklist
- [ ] Confirm Vercel build command and output directory
- [ ] Add a safe demo deployment workflow for preview links

## 14. Post-MVP Expansion

- [ ] Add login architecture behind an auth boundary
- [ ] Replace local-only saved routes with account-backed storage
- [ ] Add multi-provider support for Google and Naver
- [ ] Prepare the codebase for native app migration
