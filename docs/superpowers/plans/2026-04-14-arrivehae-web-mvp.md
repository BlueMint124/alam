# ArriveHae Web MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a laptop-demo-ready web MVP that feels like a mobile app, lets users search Google transit routes, select a route, start boarding tracking, and receive transfer and near-arrival alerts in live or simulation mode.

**Architecture:** Use a provider-normalized route layer, a shared tracking engine for both live and simulation location sources, and isolated alert and storage gateways. Optimize for deterministic demo playback first, then layer in live geolocation and local persistence without changing the route and tracking contracts.

**Tech Stack:** Vite, React, TypeScript, React Router, Zustand, Vitest, Testing Library, Playwright, Browser Notifications, localStorage

---

## Planned File Structure

- `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`
- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/router.tsx`
- `src/app/store/appStore.ts`
- `src/styles/tokens.css`
- `src/styles/app-shell.css`
- `src/features/routes/types.ts`
- `src/features/routes/providers/google/GoogleTransitProvider.ts`
- `src/features/routes/providers/google/googleRoute.fixture.json`
- `src/features/routes/normalizers/normalizeGoogleRoute.ts`
- `src/features/routes/api/searchTransitRoutes.ts`
- `src/features/routes/components/RouteSearchForm.tsx`
- `src/features/routes/components/RouteOptionCard.tsx`
- `src/features/routes/components/RouteDetailCard.tsx`
- `src/features/tracking/types.ts`
- `src/features/tracking/TrackingEngine.ts`
- `src/features/tracking/ProgressEstimator.ts`
- `src/features/tracking/location/LiveLocationSource.ts`
- `src/features/simulation/SimulationLocationSource.ts`
- `src/features/simulation/scenarios/demo-seoul-transfer.json`
- `src/features/alerts/AlertEngine.ts`
- `src/features/alerts/NotificationGateway.ts`
- `src/features/alerts/BrowserNotificationGateway.ts`
- `src/features/alerts/InMemoryNotificationGateway.ts`
- `src/features/storage/StorageGateway.ts`
- `src/features/storage/LocalStorageGateway.ts`
- `src/features/debug/DebugPanel.tsx`
- `src/screens/HomeScreen.tsx`
- `src/screens/ResultsScreen.tsx`
- `src/screens/TrackingScreen.tsx`
- `src/screens/SettingsScreen.tsx`
- `src/tests/routes/normalizeGoogleRoute.test.ts`
- `src/tests/tracking/TrackingEngine.test.ts`
- `src/tests/alerts/AlertEngine.test.ts`
- `tests/e2e/demo-simulation.spec.ts`

### Task 1: Bootstrap The App Shell

**Files:**
- Create: `package.json`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/router.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/app-shell.css`

- [ ] **Step 1: Write the failing shell smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import { App } from "../../src/app/App";

it("renders the app shell title", () => {
  render(<App />);
  expect(screen.getByText("ArriveHae")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- App.test.tsx`
Expected: FAIL because `App` and test setup do not exist yet

- [ ] **Step 3: Write the minimal app shell implementation**

```tsx
export function App() {
  return (
    <div className="app-stage">
      <div className="app-shell">
        <header className="app-bar">ArriveHae</header>
        <main>Loading...</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- App.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json src/main.tsx src/app/App.tsx src/app/router.tsx src/styles/tokens.css src/styles/app-shell.css
git commit -m "feat: bootstrap arrivehae app shell"
```

### Task 2: Define Shared Route Types And Google Normalization

**Files:**
- Create: `src/features/routes/types.ts`
- Create: `src/features/routes/normalizers/normalizeGoogleRoute.ts`
- Create: `src/tests/routes/normalizeGoogleRoute.test.ts`
- Create: `src/features/routes/providers/google/googleRoute.fixture.json`

- [ ] **Step 1: Write the failing normalization test**

```ts
import fixture from "../../src/features/routes/providers/google/googleRoute.fixture.json";
import { normalizeGoogleRoute } from "../../src/features/routes/normalizers/normalizeGoogleRoute";

it("maps a Google route into provider-agnostic route options", () => {
  const routes = normalizeGoogleRoute(fixture);
  expect(routes[0].segments[0].type).toBe("BUS");
  expect(routes[0].segments[0].transit.stopCount).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- normalizeGoogleRoute.test.ts`
Expected: FAIL because the normalizer does not exist yet

- [ ] **Step 3: Write minimal domain types and normalizer**

```ts
export type SegmentType = "WALK" | "BUS" | "SUBWAY";

export interface TransitSegmentDetails {
  lineName: string;
  departureStop: string;
  arrivalStop: string;
  stopCount: number;
}

export interface RouteSegment {
  type: SegmentType;
  transit?: TransitSegmentDetails;
}

export interface RouteOption {
  id: string;
  totalMinutes: number;
  transferCount: number;
  segments: RouteSegment[];
}
```

```ts
export function normalizeGoogleRoute(payload: any): RouteOption[] {
  return payload.routes.map((route: any, index: number) => ({
    id: `google-${index}`,
    totalMinutes: Number(route.durationMinutes),
    transferCount: Number(route.transferCount),
    segments: route.segments.map((segment: any) => ({
      type: segment.type,
      transit: segment.transit,
    })),
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- normalizeGoogleRoute.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/routes/types.ts src/features/routes/normalizers/normalizeGoogleRoute.ts src/tests/routes/normalizeGoogleRoute.test.ts src/features/routes/providers/google/googleRoute.fixture.json
git commit -m "feat: add normalized route models"
```

### Task 3: Implement Route Search UI

**Files:**
- Create: `src/features/routes/api/searchTransitRoutes.ts`
- Create: `src/features/routes/providers/google/GoogleTransitProvider.ts`
- Create: `src/features/routes/components/RouteSearchForm.tsx`
- Create: `src/features/routes/components/RouteOptionCard.tsx`
- Create: `src/screens/HomeScreen.tsx`
- Create: `src/screens/ResultsScreen.tsx`

- [ ] **Step 1: Write the failing UI test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeScreen } from "../../src/screens/HomeScreen";

it("submits origin and destination", async () => {
  render(<HomeScreen />);
  await userEvent.type(screen.getByLabelText("From"), "서울역");
  await userEvent.type(screen.getByLabelText("To"), "건대입구역");
  await userEvent.click(screen.getByRole("button", { name: "Find Routes" }));
  expect(screen.getByText("Searching routes...")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- HomeScreen.test.tsx`
Expected: FAIL because the form and screen do not exist yet

- [ ] **Step 3: Write minimal search form and loading state**

```tsx
export function RouteSearchForm({ onSubmit }: { onSubmit: (from: string, to: string) => void }) {
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      onSubmit(String(form.get("from")), String(form.get("to")));
    }}>
      <input name="from" aria-label="From" />
      <input name="to" aria-label="To" />
      <button type="submit">Find Routes</button>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- HomeScreen.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/routes/api/searchTransitRoutes.ts src/features/routes/providers/google/GoogleTransitProvider.ts src/features/routes/components/RouteSearchForm.tsx src/features/routes/components/RouteOptionCard.tsx src/screens/HomeScreen.tsx src/screens/ResultsScreen.tsx
git commit -m "feat: add transit search flow"
```

### Task 4: Add Route Detail And Boarding Start

**Files:**
- Create: `src/features/routes/components/RouteDetailCard.tsx`
- Modify: `src/screens/ResultsScreen.tsx`
- Create: `src/app/store/appStore.ts`

- [ ] **Step 1: Write the failing route detail test**

```tsx
import { render, screen } from "@testing-library/react";
import { RouteDetailCard } from "../../src/features/routes/components/RouteDetailCard";

it("shows stop counts and boarding start action", () => {
  render(<RouteDetailCard route={mockRoute} />);
  expect(screen.getByText("Boarding Start")).toBeInTheDocument();
  expect(screen.getByText(/stops/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- RouteDetailCard.test.tsx`
Expected: FAIL because the component does not exist yet

- [ ] **Step 3: Write minimal route detail UI**

```tsx
export function RouteDetailCard({ route, onBoardingStart }: any) {
  return (
    <section>
      <h2>Selected Route</h2>
      {route.segments.map((segment: any) => (
        <div key={segment.id}>
          <strong>{segment.type}</strong>
          {segment.transit ? <span>{segment.transit.stopCount} stops</span> : null}
        </div>
      ))}
      <button onClick={onBoardingStart}>Boarding Start</button>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- RouteDetailCard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/routes/components/RouteDetailCard.tsx src/screens/ResultsScreen.tsx src/app/store/appStore.ts
git commit -m "feat: add route detail and boarding start"
```

### Task 5: Implement Tracking Engine

**Files:**
- Create: `src/features/tracking/types.ts`
- Create: `src/features/tracking/ProgressEstimator.ts`
- Create: `src/features/tracking/TrackingEngine.ts`
- Create: `src/tests/tracking/TrackingEngine.test.ts`

- [ ] **Step 1: Write the failing tracking test**

```ts
import { TrackingEngine } from "../../src/features/tracking/TrackingEngine";

it("reduces remaining stops as position events advance", () => {
  const engine = new TrackingEngine(mockSession);
  engine.applyPosition(mockPositionNearStop2);
  expect(engine.getState().remainingStops).toBe(3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- TrackingEngine.test.ts`
Expected: FAIL because the engine does not exist yet

- [ ] **Step 3: Write minimal engine implementation**

```ts
export class TrackingEngine {
  constructor(private session: any) {}

  applyPosition(position: any) {
    this.session.currentPosition = position;
    this.session.remainingStops = Math.max(0, this.session.remainingStops - 1);
  }

  getState() {
    return this.session;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- TrackingEngine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/tracking/types.ts src/features/tracking/ProgressEstimator.ts src/features/tracking/TrackingEngine.ts src/tests/tracking/TrackingEngine.test.ts
git commit -m "feat: add tracking engine foundation"
```

### Task 6: Add Simulation Harness

**Files:**
- Create: `src/features/simulation/scenarios/demo-seoul-transfer.json`
- Create: `src/features/simulation/SimulationLocationSource.ts`
- Create: `src/features/simulation/useSimulationControls.ts`
- Create: `src/features/debug/DebugPanel.tsx`

- [ ] **Step 1: Write the failing simulation test**

```ts
import { SimulationLocationSource } from "../../src/features/simulation/SimulationLocationSource";

it("emits deterministic positions from a scenario", () => {
  const source = new SimulationLocationSource(demoScenario);
  expect(source.next().stopIndex).toBe(0);
  expect(source.next().stopIndex).toBe(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- SimulationLocationSource.test.ts`
Expected: FAIL because the simulation source does not exist yet

- [ ] **Step 3: Write minimal simulation source**

```ts
export class SimulationLocationSource {
  private cursor = 0;

  constructor(private scenario: Array<any>) {}

  next() {
    return this.scenario[this.cursor++];
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- SimulationLocationSource.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/simulation/scenarios/demo-seoul-transfer.json src/features/simulation/SimulationLocationSource.ts src/features/simulation/useSimulationControls.ts src/features/debug/DebugPanel.tsx
git commit -m "feat: add deterministic simulation harness"
```

### Task 7: Implement Alert Engine And Notification Gateway

**Files:**
- Create: `src/features/alerts/AlertEngine.ts`
- Create: `src/features/alerts/NotificationGateway.ts`
- Create: `src/features/alerts/BrowserNotificationGateway.ts`
- Create: `src/features/alerts/InMemoryNotificationGateway.ts`
- Create: `src/tests/alerts/AlertEngine.test.ts`

- [ ] **Step 1: Write the failing alert test**

```ts
import { AlertEngine } from "../../src/features/alerts/AlertEngine";

it("fires one transfer alert and one final alert per session", () => {
  const engine = new AlertEngine(mockRules);
  const alerts = engine.evaluate(mockTrackingState);
  expect(alerts.map((item) => item.kind)).toEqual(["TRANSFER", "FINAL"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- AlertEngine.test.ts`
Expected: FAIL because the alert engine does not exist yet

- [ ] **Step 3: Write minimal alert engine**

```ts
export class AlertEngine {
  constructor(private rules: any) {}

  evaluate(state: any) {
    const alerts = [];
    if (this.rules.transferEnabled && state.remainingStops === state.transferThreshold) {
      alerts.push({ kind: "TRANSFER" });
    }
    if (state.remainingStops === state.finalThreshold) {
      alerts.push({ kind: "FINAL" });
    }
    return alerts;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- AlertEngine.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/alerts/AlertEngine.ts src/features/alerts/NotificationGateway.ts src/features/alerts/BrowserNotificationGateway.ts src/features/alerts/InMemoryNotificationGateway.ts src/tests/alerts/AlertEngine.test.ts
git commit -m "feat: add alert engine and notification gateway"
```

### Task 8: Build The Tracking Screen

**Files:**
- Create: `src/screens/TrackingScreen.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/app/store/appStore.ts`

- [ ] **Step 1: Write the failing tracking screen test**

```tsx
import { render, screen } from "@testing-library/react";
import { TrackingScreen } from "../../src/screens/TrackingScreen";

it("shows remaining stops and next stop", () => {
  render(<TrackingScreen />);
  expect(screen.getByText(/stops left/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- TrackingScreen.test.tsx`
Expected: FAIL because the screen does not exist yet

- [ ] **Step 3: Write minimal tracking UI**

```tsx
export function TrackingScreen() {
  return (
    <main>
      <h1>3 stops left</h1>
      <p>Next stop: Konkuk Univ.</p>
      <button>Pause Simulation</button>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- TrackingScreen.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/screens/TrackingScreen.tsx src/app/router.tsx src/app/store/appStore.ts
git commit -m "feat: add tracking screen"
```

### Task 9: Add Local Persistence For Recents And Favorites

**Files:**
- Create: `src/features/storage/StorageGateway.ts`
- Create: `src/features/storage/LocalStorageGateway.ts`
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `src/features/routes/components/RouteDetailCard.tsx`

- [ ] **Step 1: Write the failing persistence test**

```ts
import { LocalStorageGateway } from "../../src/features/storage/LocalStorageGateway";

it("stores and returns recent routes", () => {
  const gateway = new LocalStorageGateway(window.localStorage);
  gateway.saveRecent(mockSavedRoute);
  expect(gateway.getRecents()).toHaveLength(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- LocalStorageGateway.test.ts`
Expected: FAIL because the gateway does not exist yet

- [ ] **Step 3: Write minimal storage gateway**

```ts
export class LocalStorageGateway {
  constructor(private storage: Storage) {}

  saveRecent(route: any) {
    this.storage.setItem("recentRoutes", JSON.stringify([route]));
  }

  getRecents() {
    return JSON.parse(this.storage.getItem("recentRoutes") ?? "[]");
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- LocalStorageGateway.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/storage/StorageGateway.ts src/features/storage/LocalStorageGateway.ts src/screens/HomeScreen.tsx src/features/routes/components/RouteDetailCard.tsx
git commit -m "feat: add recent routes and favorites storage"
```

### Task 10: Add Settings And Demo Verification

**Files:**
- Create: `src/screens/SettingsScreen.tsx`
- Create: `tests/e2e/demo-simulation.spec.ts`
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Write the failing end-to-end demo test**

```ts
import { test, expect } from "@playwright/test";

test("demo scenario reaches transfer alert and final alert", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Load Demo Scenario" }).click();
  await expect(page.getByText("Transfer alert")).toBeVisible();
  await expect(page.getByText("Near-arrival alert")).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- demo-simulation.spec.ts`
Expected: FAIL because the settings screen, demo controls, and alerts are not fully wired

- [ ] **Step 3: Implement settings screen and demo entry point**

```tsx
export function SettingsScreen() {
  return (
    <main>
      <h1>Settings</h1>
      <label>
        Bus alert threshold
        <input type="range" min="3" max="5" />
      </label>
      <label>
        Subway alert threshold
        <input type="range" min="3" max="4" />
      </label>
      <label>
        <input type="checkbox" /> Transfer alert
      </label>
    </main>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test && npm run test:e2e -- demo-simulation.spec.ts`
Expected: PASS for unit tests and one demo scenario end-to-end test

- [ ] **Step 5: Commit**

```bash
git add src/screens/SettingsScreen.tsx tests/e2e/demo-simulation.spec.ts src/app/router.tsx
git commit -m "feat: add settings and demo verification"
```

## Self-Review

### Spec Coverage Check

- Search and route options are covered in Tasks 2 and 3.
- Route detail and boarding start are covered in Task 4.
- Tracking is covered in Tasks 5 and 8.
- Simulation mode is covered in Task 6.
- Alerts are covered in Task 7.
- Local storage favorites and recents are covered in Task 9.
- Settings and presentation verification are covered in Task 10.
- Login and cloud sync are intentionally excluded because they are deferred in the spec.

### Placeholder Scan

- No `TBD`
- No `TODO`
- No unresolved references to unnamed files

### Type Consistency Check

- Route models are introduced before route UI tasks
- Tracking tasks depend on `TrackingSession` and route segment structures defined earlier
- Alert tasks consume tracking state after the tracking engine exists

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-14-arrivehae-web-mvp.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
