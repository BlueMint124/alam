# ArriveHae Web MVP Design

## Product Goal

ArriveHae solves the problem of missing a stop on public transit because the user fell asleep or got distracted.
The short-term goal is a web MVP that can be demonstrated in laptop Chrome within 2 weeks.
The longer-term goal is a real mobile app with stronger live tracking, login, and cloud-backed persistence.

## Demo Context

- The midterm presentation runs on a laptop in Chrome.
- The product should still feel like a mobile app.
- The presentation must remain stable even if live location or notifications fail.
- Simulation mode is a first-class feature because demo reliability matters.

## Product Boundary

### MVP Must Include

- origin and destination search
- Google transit route search
- multiple route options
- route selection
- route detail view
- boarding start flow
- tracking for transit segments only
- transfer alert
- final near-destination alert
- browser notification support when another tab is open
- deterministic simulation mode

### MVP Nice To Have

- recent routes in local storage
- favorite routes in local storage

### Deferred

- login
- account sync
- cloud persistence
- native app packaging
- multi-provider transit support

## Product Structure

The product should be implemented in three layers so it can grow later without rewriting the core behavior.

### 1. Route Layer

This layer calls external transit APIs and converts the responses into internal route models.
UI components must consume normalized route data only.

### 2. Tracking Layer

This layer receives position events from either live geolocation or simulation.
It determines the active transit segment, estimates remaining stops, and manages session progress.

### 3. Alert And Persistence Layer

This layer decides when alerts should fire, sends browser and in-app notifications, and stores favorites and recent routes.
The first persistence target is local storage, with future expansion to account-backed storage.

## Core User Flow

1. The user enters an origin and a destination.
2. The app requests multiple Google transit route options.
3. The user selects one route.
4. The route detail screen shows the segment breakdown and alert settings.
5. The user taps `Boarding Start`.
6. The app starts tracking only transit segments.
7. The app alerts before the transfer exit when that setting is enabled.
8. The app alerts again near the final destination.

## Data Model

- `RouteSearch`
- `RouteOption`
- `RouteSegment`
- `TransitSegmentDetails`
- `AlertRule`
- `TrackingSession`
- `SavedRoute`

These models should be provider-agnostic and persistence-agnostic.

## Tracking Design

Tracking begins only after the user explicitly taps `Boarding Start`.
The app does not try to infer boarding automatically in the MVP.

The tracking engine supports two location sources:

- `LiveLocationSource`
- `SimulationLocationSource`

Both feed the same tracking engine.
The engine should estimate the active segment and remaining stops while handling noisy GPS inputs conservatively.

Walking segments are shown in the route breakdown but are not part of the alert calculation logic in the MVP.

## Alert Rules

- Bus alert threshold starts with a default value and is user-adjustable within valid bounds.
- Subway alert threshold starts with a default value and is user-adjustable within valid bounds.
- Transfer alert can be toggled on or off.
- Final near-destination alert is distinct from the normal stop-threshold alert.
- A single alert must never fire twice in the same tracking session.

## UX Design

The product should be presented as a mobile app shell inside the browser.

### Shell Rules

- use a centered mobile-width canvas
- use one consistent top app bar
- use one consistent bottom tab bar
- do not mix desktop navigation patterns into the shell

### Visual Direction

- dark mode is the preferred presentation theme
- the alert modal is the signature visual moment
- the interface should feel calm but still operationally clear
- Korean transit context should be used in demo content

## Screen Priorities

### Tier 1

- search
- route results
- tracking
- alert modal

### Tier 2

- route detail
- simulation controls

### Tier 3

- settings
- recent routes
- favorites

## Error And Fallback Strategy

- if live geolocation is denied, guide the user into simulation mode
- if browser notifications are denied, use in-app alerts and optional sound
- if route loading is slow, show a dedicated loading state rather than a blank screen
- keep at least one fully scripted simulation scenario ready for the presentation

## Expansion Strategy

The MVP structure must support:

- stronger live tracking accuracy
- login and account-backed persistence
- Google + Naver provider expansion
- native app migration

That means provider logic, storage logic, and notification logic must stay behind clear interfaces from the start.
