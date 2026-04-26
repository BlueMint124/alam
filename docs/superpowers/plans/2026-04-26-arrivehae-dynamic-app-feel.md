# ArriveHae Dynamic App Feel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the current ArriveHae web MVP so the demo feels like a real, continuously running mobile app with explicit playback state, semi-automatic presenter controls, reactive route progression, and motion-driven screen feedback.

**Architecture:** Keep the existing route search, simulation source, and alert engine, but extend the external app store with explicit presentation and demo playback state. Drive autoplay, pause, resume, step-forward, and alert interruption from a dedicated playback hook, then let Home, Results, Tracking, and Alert UI consume named state values through CSS classes and data attributes instead of scattered one-off animations. Use stable `data-testid` and `data-*` attributes in tests so the plan does not depend on Korean UI copy for verification.

**Tech Stack:** React, TypeScript, React Router, existing sync external store in `src/app/store/appStore.ts`, CSS variables, Vitest, Testing Library, Playwright

---

## Planned File Structure

- Create: `src/features/presentation/types.ts` - shared playback and screen presentation state names.
- Create: `src/features/presentation/usePlaybackController.ts` - semi-automatic demo playback hook that advances scenario events, updates the store, and opens alerts at the right time.
- Create: `src/features/presentation/usePlaybackController.test.tsx` - fake-timer coverage for autoplay, pause/resume, step-forward, restart, and alert interruption.
- Create: `src/features/presentation/PresenterControlBar.tsx` - product-native presenter controls for pause, resume, next step, restart, and alert confirm.
- Create: `src/features/presentation/PresenterControlBar.test.tsx` - control rendering and mode-driven button behavior.
- Modify: `src/app/store/appStore.ts` - add explicit presentation state, demo playback state, and helper actions that keep alert progression and tracking state in sync.
- Modify: `src/app/store/appStore.test.ts` - verify playback state transitions, alert queue progression, and reset behavior.
- Modify: `src/screens/SettingsScreen.tsx` - stage the demo session, seed thresholds, switch playback to autoplay, and navigate into tracking.
- Modify: `src/screens/SettingsScreen.test.tsx` - verify that starting the demo configures autoplay and routes the user into the live tracking flow.
- Modify: `src/screens/HomeScreen.tsx` - publish `entered`, `searching`, and `results_ready` states and show a visible loading shell instead of static swapping.
- Modify: `src/screens/HomeScreen.test.tsx` - verify Home presentation states and search transition behavior.
- Modify: `src/screens/ResultsScreen.tsx` - publish `list_revealed`, `route_selected`, and `detail_expanded` states and connect selection feedback to the detail panel.
- Modify: `src/screens/ResultsScreen.test.tsx` - verify result list reveal state and connected route/detail selection.
- Modify: `src/features/routes/components/RouteOptionCard.tsx` - accept a reveal index for staggered card entry and active emphasis.
- Modify: `src/features/routes/components/RouteDetailCard.tsx` - accept expansion state and expose a connected-detail surface.
- Modify: `src/screens/TrackingScreen.tsx` - consume playback state, attach the playback controller, render animated metrics, and surface the presenter control bar.
- Modify: `src/screens/TrackingScreen.test.tsx` - verify live mode, paused mode, step-forward behavior, and resumed progression after alerts.
- Modify: `src/features/alerts/components/ArrivalAlertModal.tsx` - expose alert presentation state for opening, active, and closing motion.
- Modify: `src/features/alerts/components/ArrivalAlertModal.test.tsx` - verify alert state attributes and confirm-driven progression.
- Modify: `src/features/debug/DebugPanel.tsx` - reduce the raw debug feel and reposition it as an optional live activity surface beneath the presenter controls.
- Modify: `src/features/debug/DebugPanel.test.tsx` - verify the compact live activity wording.
- Modify: `src/styles/tokens.css` - add motion duration, easing, glow, and live-state variables.
- Modify: `src/styles/app-shell.css` - implement reveal, selection, progress, pulse, and alert motion classes plus the presenter control bar styling.
- Modify: `tests/e2e/demo-simulation.spec.ts` - verify the semi-automatic demo flow from settings through transfer and final alerts.

### Task 1: Add Explicit Playback And Presentation State

**Files:**
- Create: `src/features/presentation/types.ts`
- Modify: `src/app/store/appStore.ts`
- Modify: `src/app/store/appStore.test.ts`

- [ ] **Step 1: Write the failing store test for presentation and playback state**

```ts
import { beforeEach, describe, expect, it } from "vitest";
import {
  configureDemoPlayback,
  getAppStoreState,
  resetAppStore,
  setAlertPresentationState,
  setHomePresentationState,
  setPlaybackMode,
  setResultsPresentationState,
  setTrackingPresentationState,
} from "./appStore";

describe("appStore presentation state", () => {
  beforeEach(() => {
    resetAppStore();
  });

  it("tracks explicit screen presentation states and resets them cleanly", () => {
    setHomePresentationState("searching");
    setResultsPresentationState("detail_expanded");
    setTrackingPresentationState("countdown_updated");
    setAlertPresentationState("opening");
    configureDemoPlayback({
      totalEvents: 4,
      transferThreshold: 3,
      finalThreshold: 1,
      transferEnabled: true,
    });
    setPlaybackMode("auto_playing");

    expect(getAppStoreState().presentation).toEqual({
      home: "searching",
      results: "detail_expanded",
      tracking: "countdown_updated",
      alert: "opening",
    });
    expect(getAppStoreState().demoPlayback).toMatchObject({
      mode: "auto_playing",
      totalEvents: 4,
      transferThreshold: 3,
    });

    resetAppStore();

    expect(getAppStoreState().presentation).toEqual({
      home: "entered",
      results: "list_revealed",
      tracking: "live",
      alert: "closing",
    });
    expect(getAppStoreState().demoPlayback.mode).toBe("idle");
  });
});
```

- [ ] **Step 2: Run the store test to verify it fails**

Run: `npm run test -- src/app/store/appStore.test.ts`
Expected: FAIL because `presentation`, `demoPlayback`, `configureDemoPlayback`, and the new setter actions do not exist yet

- [ ] **Step 3: Implement shared presentation types and store actions**

```ts
export type PlaybackMode =
  | "idle"
  | "auto_playing"
  | "paused"
  | "alert_open"
  | "completed";

export type HomePresentationState = "entered" | "searching" | "results_ready";
export type ResultsPresentationState =
  | "list_revealed"
  | "route_selected"
  | "detail_expanded";
export type TrackingPresentationState = "live" | "countdown_updated" | "paused";
export type AlertPresentationState = "opening" | "active" | "closing";

export type PresentationState = {
  home: HomePresentationState;
  results: ResultsPresentationState;
  tracking: TrackingPresentationState;
  alert: AlertPresentationState;
};

export type DemoPlaybackState = {
  mode: PlaybackMode;
  currentEventIndex: number;
  totalEvents: number;
  transferThreshold: number;
  finalThreshold: number;
  transferEnabled: boolean;
};
```

```ts
const initialPresentationState: PresentationState = {
  home: "entered",
  results: "list_revealed",
  tracking: "live",
  alert: "closing",
};

const initialDemoPlaybackState: DemoPlaybackState = {
  mode: "idle",
  currentEventIndex: 0,
  totalEvents: 0,
  transferThreshold: 3,
  finalThreshold: 1,
  transferEnabled: true,
};

export function configureDemoPlayback(nextPlayback: Omit<DemoPlaybackState, "mode" | "currentEventIndex">) {
  setAppStoreState({
    ...appStoreState,
    demoPlayback: {
      ...appStoreState.demoPlayback,
      ...nextPlayback,
      currentEventIndex: 0,
    },
  });
}

export function setPlaybackMode(mode: PlaybackMode) {
  setAppStoreState({
    ...appStoreState,
    demoPlayback: {
      ...appStoreState.demoPlayback,
      mode,
    },
  });
}

export function setDemoPlaybackProgress(currentEventIndex: number) {
  setAppStoreState({
    ...appStoreState,
    demoPlayback: {
      ...appStoreState.demoPlayback,
      currentEventIndex,
    },
  });
}

export function resetDemoPlayback(totalEvents = 0) {
  setAppStoreState({
    ...appStoreState,
    demoPlayback: {
      ...initialDemoPlaybackState,
      totalEvents,
    },
  });
}

export function setHomePresentationState(home: HomePresentationState) {
  setAppStoreState({
    ...appStoreState,
    presentation: {
      ...appStoreState.presentation,
      home,
    },
  });
}

export function setResultsPresentationState(results: ResultsPresentationState) {
  setAppStoreState({
    ...appStoreState,
    presentation: {
      ...appStoreState.presentation,
      results,
    },
  });
}

export function setTrackingPresentationState(tracking: TrackingPresentationState) {
  setAppStoreState({
    ...appStoreState,
    presentation: {
      ...appStoreState.presentation,
      tracking,
    },
  });
}

export function setAlertPresentationState(alert: AlertPresentationState) {
  setAppStoreState({
    ...appStoreState,
    presentation: {
      ...appStoreState.presentation,
      alert,
    },
  });
}
```

- [ ] **Step 4: Run the store tests to verify they pass**

Run: `npm run test -- src/app/store/appStore.test.ts`
Expected: PASS with the new `presentation` and `demoPlayback` state transitions covered

- [ ] **Step 5: Commit**

```bash
git add src/features/presentation/types.ts src/app/store/appStore.ts src/app/store/appStore.test.ts
git commit -m "feat: add playback presentation store state"
```

### Task 2: Build Semi-Automatic Demo Playback And Presenter Controls

**Files:**
- Create: `src/features/presentation/usePlaybackController.ts`
- Create: `src/features/presentation/usePlaybackController.test.tsx`
- Create: `src/features/presentation/PresenterControlBar.tsx`
- Create: `src/features/presentation/PresenterControlBar.test.tsx`
- Modify: `src/screens/SettingsScreen.tsx`
- Modify: `src/screens/SettingsScreen.test.tsx`

- [ ] **Step 1: Write the failing playback controller and settings tests**

```tsx
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  configureDemoPlayback,
  resetAppStore,
  setPlaybackMode,
  useAppStore,
} from "../../app/store/appStore";
import { usePlaybackController } from "./usePlaybackController";

function PlaybackHarness() {
  const playback = usePlaybackController();
  const state = useAppStore((store) => store);

  return (
    <div>
      <p>mode:{state.demoPlayback.mode}</p>
      <p>remaining:{state.trackingView.remainingStops}</p>
      <p>alert:{state.alertOverlay.title || "none"}</p>
      <button type="button" onClick={playback.confirmAlert}>
        confirm
      </button>
    </div>
  );
}

describe("usePlaybackController", () => {
  beforeEach(() => {
    resetAppStore();
    configureDemoPlayback({
      totalEvents: 4,
      transferThreshold: 3,
      finalThreshold: 1,
      transferEnabled: true,
    });
    vi.useFakeTimers();
  });

  it("autoplays until an alert opens and resumes after confirmation", () => {
    setPlaybackMode("auto_playing");

    render(<PlaybackHarness />);

    act(() => {
      vi.advanceTimersByTime(1400);
      vi.advanceTimersByTime(1400);
    });

    expect(screen.getByText("mode:alert_open")).toBeInTheDocument();
    expect(screen.getByText(/alert:transfer-alert/)).toBeInTheDocument();

    act(() => {
      screen.getByRole("button", { name: "confirm" }).click();
    });

    expect(screen.getByText("mode:auto_playing")).toBeInTheDocument();
  });
});
```

```tsx
import { render, screen } from "@testing-library/react";
import { PresenterControlBar } from "./PresenterControlBar";

it("shows the resume label when playback is paused", () => {
  render(
    <PresenterControlBar
      mode="paused"
      onPause={() => undefined}
      onResume={() => undefined}
      onStepForward={() => undefined}
      onRestart={() => undefined}
      onConfirmAlert={() => undefined}
      canConfirmAlert={false}
    />,
  );

  expect(screen.getByRole("button", { name: "resume" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "step" })).toBeInTheDocument();
});
```

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { appRoutes } from "../app/router";

it("starts the prepared demo from settings and moves to tracking", () => {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ["/settings"],
  });

  render(<RouterProvider router={router} />);

  fireEvent.click(screen.getByTestId("demo-start"));

  expect(screen.getByTestId("tracking-screen")).toHaveAttribute(
    "data-playback-mode",
    "auto_playing",
  );
});
```

- [ ] **Step 2: Run the playback and settings tests to verify they fail**

Run: `npm run test -- src/features/presentation/usePlaybackController.test.tsx src/features/presentation/PresenterControlBar.test.tsx src/screens/SettingsScreen.test.tsx`
Expected: FAIL because autoplay, presenter controls, and settings-to-tracking demo start do not exist yet

- [ ] **Step 3: Implement the playback hook, presenter control bar, and settings demo start**

```tsx
function toAlertOverlay(kind: AlertKind, transferThreshold: number): AlertOverlayState {
  if (kind === "TRANSFER") {
    return {
      isOpen: true,
      title: "transfer-alert",
      description: `remaining-${transferThreshold}`,
      routeLabel: "line-4",
      etaLabel: "soon",
    };
  }

  return {
    isOpen: true,
    title: "final-alert",
    description: "remaining-1",
    routeLabel: "seoul-station",
    etaLabel: "soon",
  };
}

export function usePlaybackController(
  scenario: SimulationScenario = demoSeoulTransferScenario,
) {
  const controls = useSimulationControls(scenario);
  const demoPlayback = useAppStore((state) => state.demoPlayback);
  const emittedAlertsRef = React.useRef<AlertKind[]>([]);
  const alertEngine = React.useMemo(
    () =>
      new AlertEngine({
        transferEnabled: demoPlayback.transferEnabled,
        finalEnabled: true,
      }),
    [demoPlayback.transferEnabled],
  );

  const runStep = React.useCallback(() => {
    const nextEvent = controls.nextEvent();

    if (!nextEvent) {
      setPlaybackMode("completed");
      return;
    }

    const nextEventIndex = controls.currentEventIndex + 1;
    const remainingStops = Math.max(0, controls.totalEvents - nextEvent.stopIndex);
    const alerts = alertEngine.evaluate({
      remainingStops,
      transferThreshold: demoPlayback.transferThreshold,
      finalThreshold: demoPlayback.finalThreshold,
      emittedAlerts: emittedAlertsRef.current,
    });

    setTrackingView({
      remainingStops,
      nextStopName: remainingStops <= 1 ? "seoul-station" : "next-stop",
      simulationPaused: false,
    });
    setTrackingPresentationState("countdown_updated");
    setDemoPlaybackProgress(nextEventIndex);

    if (alerts[0]) {
      emittedAlertsRef.current.push(alerts[0].kind);
      setAlertOverlay(toAlertOverlay(alerts[0].kind, demoPlayback.transferThreshold));
      setAlertPresentationState("opening");
      setPlaybackMode("alert_open");
      return;
    }

    setPlaybackMode(nextEventIndex >= demoPlayback.totalEvents ? "completed" : "auto_playing");
  }, [alertEngine, controls, demoPlayback.finalThreshold, demoPlayback.totalEvents, demoPlayback.transferThreshold]);

  React.useEffect(() => {
    if (demoPlayback.mode !== "auto_playing") {
      return;
    }

    const timerId = window.setTimeout(() => {
      runStep();
    }, 1400);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [demoPlayback.currentEventIndex, demoPlayback.mode, runStep]);

  const confirmAlert = () => {
    setAlertPresentationState("closing");
    setAlertOverlay({
      isOpen: false,
      title: "",
      description: "",
      routeLabel: "",
      etaLabel: "",
    });
    setPlaybackMode(
      demoPlayback.currentEventIndex >= demoPlayback.totalEvents ? "completed" : "auto_playing",
    );
  };

  return {
    pause: () => setPlaybackMode("paused"),
    resume: () => setPlaybackMode("auto_playing"),
    stepForward: runStep,
    restart: () => {
      emittedAlertsRef.current = [];
      controls.resetScenario();
      resetDemoPlayback(controls.totalEvents);
      configureDemoPlayback({
        totalEvents: controls.totalEvents,
        transferThreshold: demoPlayback.transferThreshold,
        finalThreshold: demoPlayback.finalThreshold,
        transferEnabled: demoPlayback.transferEnabled,
      });
      setTrackingView({
        remainingStops: controls.totalEvents,
        nextStopName: "next-stop",
        simulationPaused: false,
      });
      setPlaybackMode("auto_playing");
    },
    confirmAlert,
  };
}
```

```tsx
type PresenterControlBarProps = {
  mode: PlaybackMode;
  onPause: () => void;
  onResume: () => void;
  onStepForward: () => void;
  onRestart: () => void;
  onConfirmAlert: () => void;
  canConfirmAlert: boolean;
};

export function PresenterControlBar({
  mode,
  onPause,
  onResume,
  onStepForward,
  onRestart,
  onConfirmAlert,
  canConfirmAlert,
}: PresenterControlBarProps) {
  return (
    <section className="presenter-control-bar" aria-label="presenter-controls">
      <button type="button" onClick={mode === "paused" ? onResume : onPause}>
        {mode === "paused" ? "resume" : "pause"}
      </button>
      <button type="button" onClick={onStepForward}>step</button>
      <button type="button" onClick={onRestart}>restart</button>
      {canConfirmAlert ? (
        <button type="button" onClick={onConfirmAlert}>confirm-alert</button>
      ) : null}
    </section>
  );
}
```

```tsx
const navigate = useNavigate();

const handleLoadDemoScenario = () => {
  resetDemoPlayback(demoSeoulTransferScenario.events.length);
  configureDemoPlayback({
    totalEvents: demoSeoulTransferScenario.events.length,
    transferThreshold: subwayThreshold,
    finalThreshold: 1,
    transferEnabled,
  });
  setTrackingView({
    remainingStops: demoSeoulTransferScenario.events.length,
    nextStopName: "next-stop",
    simulationPaused: false,
  });
  setPlaybackMode("auto_playing");
  navigate("/tracking");
};
```

- [ ] **Step 4: Run the playback and settings tests to verify they pass**

Run: `npm run test -- src/features/presentation/usePlaybackController.test.tsx src/features/presentation/PresenterControlBar.test.tsx src/screens/SettingsScreen.test.tsx`
Expected: PASS with autoplay timing, transfer interruption, resume behavior, and settings-driven tracking entry all working

- [ ] **Step 5: Commit**

```bash
git add src/features/presentation/usePlaybackController.ts src/features/presentation/usePlaybackController.test.tsx src/features/presentation/PresenterControlBar.tsx src/features/presentation/PresenterControlBar.test.tsx src/screens/SettingsScreen.tsx src/screens/SettingsScreen.test.tsx
git commit -m "feat: add semi-automatic demo playback controls"
```

### Task 3: Add Reactive Home And Route Selection Presentation States

**Files:**
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `src/screens/HomeScreen.test.tsx`
- Modify: `src/screens/ResultsScreen.tsx`
- Modify: `src/screens/ResultsScreen.test.tsx`
- Modify: `src/features/routes/components/RouteOptionCard.tsx`
- Modify: `src/features/routes/components/RouteDetailCard.tsx`

- [ ] **Step 1: Write the failing Home and Results presentation tests**

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HomeScreen } from "./HomeScreen";

it("moves home presentation from searching to results_ready", async () => {
  render(<HomeScreen />);

  fireEvent.change(screen.getByLabelText(/from/i), {
    target: { value: "Myeongdong Station" },
  });
  fireEvent.change(screen.getByLabelText(/to/i), {
    target: { value: "Seoul Station" },
  });
  fireEvent.click(screen.getByTestId("search-submit"));

  expect(screen.getByTestId("home-screen")).toHaveAttribute(
    "data-presentation",
    "searching",
  );

  await waitFor(() => {
    expect(screen.getByTestId("home-screen")).toHaveAttribute(
      "data-presentation",
      "results_ready",
    );
  });
});
```

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import type { RouteOption } from "../features/routes/types";
import { ResultsScreen } from "./ResultsScreen";

const sampleRoutes: RouteOption[] = [
  {
    provider: "google",
    providerRouteId: "route-1",
    summary: "Myeongdong to Seoul Station",
    durationMinutes: 18,
    departureTime: "2026-04-26T08:00:00+09:00",
    arrivalTime: "2026-04-26T08:18:00+09:00",
    segments: [
      {
        id: "line-4-inbound",
        kind: "transit",
        instruction: "Take Line 4",
        lineName: "Line 4",
        vehicleType: "subway",
        stopCount: 4,
      },
    ],
  },
];

it("marks the route list as expanded when a route is selected", () => {
  render(<ResultsScreen routes={sampleRoutes} />);

  expect(screen.getByTestId("results-screen")).toHaveAttribute(
    "data-presentation",
    "list_revealed",
  );

  fireEvent.click(screen.getByTestId("route-select-route-1"));

  expect(screen.getByTestId("results-screen")).toHaveAttribute(
    "data-presentation",
    "detail_expanded",
  );
});
```

- [ ] **Step 2: Run the Home and Results tests to verify they fail**

Run: `npm run test -- src/screens/HomeScreen.test.tsx src/screens/ResultsScreen.test.tsx`
Expected: FAIL because the screens do not publish explicit presentation states or connected reveal behavior yet

- [ ] **Step 3: Implement Home and Results state publishing plus connected route selection**

```tsx
export function HomeScreen() {
  const homePresentation = useAppStore((state) => state.presentation.home);

  React.useEffect(() => {
    setHomePresentationState("entered");
  }, []);

  const handleSearch = async () => {
    setHomePresentationState("searching");
    setIsSearching(true);

    try {
      const nextRoutes = await searchTransitRoutes({ from, to });
      setRoutes(nextRoutes);
      setHomePresentationState("results_ready");
      setResultsPresentationState("list_revealed");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section data-testid="home-screen" data-presentation={homePresentation}>
```

```tsx
export function ResultsScreen({ routes }: ResultsScreenProps) {
  const resultsPresentation = useAppStore((state) => state.presentation.results);

  React.useEffect(() => {
    if (routes.length > 0) {
      setResultsPresentationState("list_revealed");
    }
  }, [routes.length]);

  const handleSelect = (routeId: string) => {
    selectRoute(routeId);
    setResultsPresentationState("route_selected");
    window.requestAnimationFrame(() => {
      setResultsPresentationState("detail_expanded");
    });
  };

  return (
    <section data-testid="results-screen" data-presentation={resultsPresentation}>
      <div className="results-stack">
        {routes.map((route, index) => (
          <RouteOptionCard
            key={route.providerRouteId}
            route={route}
            revealIndex={index}
            isRecommended={index === 0}
            isSelected={route.providerRouteId === selectedRouteId}
            onSelect={handleSelect}
          />
        ))}
      </div>
```

```tsx
type RouteOptionCardProps = {
  route: RouteOption;
  revealIndex: number;
  isRecommended?: boolean;
  isSelected: boolean;
  onSelect: (routeId: string) => void;
};

export function RouteOptionCard({ route, revealIndex, isRecommended = false, isSelected, onSelect }: RouteOptionCardProps) {
  return (
    <article
      data-testid={`route-card-${route.providerRouteId}`}
      className={isSelected ? "route-card route-card--active" : "route-card"}
      style={{ ["--route-card-index" as string]: String(revealIndex) }}
    >
```

```tsx
type RouteDetailCardProps = {
  route: RouteOption;
  isExpanded: boolean;
  boardingStarted?: boolean;
  onBoardingStart: () => void;
};

export function RouteDetailCard({ route, isExpanded, boardingStarted = false, onBoardingStart }: RouteDetailCardProps) {
  return (
    <aside
      data-testid="route-detail-card"
      className={isExpanded ? "detail-card detail-card--expanded" : "detail-card"}
      data-expanded={isExpanded ? "true" : "false"}
    >
```

- [ ] **Step 4: Run the Home and Results tests to verify they pass**

Run: `npm run test -- src/screens/HomeScreen.test.tsx src/screens/ResultsScreen.test.tsx`
Expected: PASS with `searching`, `results_ready`, `list_revealed`, and `detail_expanded` all reflected in the DOM

- [ ] **Step 5: Commit**

```bash
git add src/screens/HomeScreen.tsx src/screens/HomeScreen.test.tsx src/screens/ResultsScreen.tsx src/screens/ResultsScreen.test.tsx src/features/routes/components/RouteOptionCard.tsx src/features/routes/components/RouteDetailCard.tsx
git commit -m "feat: add reactive home and route presentation states"
```

### Task 4: Make Tracking, Alerts, And Live Activity Feel Continuous

**Files:**
- Modify: `src/screens/TrackingScreen.tsx`
- Modify: `src/screens/TrackingScreen.test.tsx`
- Modify: `src/features/alerts/components/ArrivalAlertModal.tsx`
- Modify: `src/features/alerts/components/ArrivalAlertModal.test.tsx`
- Modify: `src/features/debug/DebugPanel.tsx`
- Modify: `src/features/debug/DebugPanel.test.tsx`

- [ ] **Step 1: Write the failing tracking and alert continuity tests**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  resetAppStore,
  setAlertOverlay,
  setAlertPresentationState,
  setPlaybackMode,
  setTrackingPresentationState,
  setTrackingView,
} from "../app/store/appStore";
import { TrackingScreen } from "./TrackingScreen";

describe("TrackingScreen dynamic playback", () => {
  beforeEach(() => {
    resetAppStore();
  });

  it("shows live playback state and resumes after alert confirmation", () => {
    setPlaybackMode("alert_open");
    setTrackingPresentationState("countdown_updated");
    setAlertPresentationState("active");
    setTrackingView({
      remainingStops: 2,
      nextStopName: "seoul-station",
      simulationPaused: false,
    });
    setAlertOverlay({
      isOpen: true,
      title: "transfer-alert",
      description: "remaining-2",
      routeLabel: "line-4",
      etaLabel: "soon",
    });

    render(<TrackingScreen />);

    expect(screen.getByTestId("tracking-screen")).toHaveAttribute(
      "data-playback-mode",
      "alert_open",
    );
    expect(screen.getByRole("button", { name: "pause" })).toBeInTheDocument();
    expect(screen.getByTestId("alert-modal")).toHaveAttribute("data-state", "active");

    fireEvent.click(screen.getByRole("button", { name: "confirm-alert" }));

    expect(screen.getByTestId("tracking-screen")).toHaveAttribute(
      "data-playback-mode",
      "auto_playing",
    );
  });
});
```

```tsx
import { render, screen } from "@testing-library/react";
import { ArrivalAlertModal } from "./ArrivalAlertModal";

it("exposes alert presentation state on the dialog container", () => {
  render(
    <ArrivalAlertModal
      overlay={{
        isOpen: true,
        title: "final-alert",
        description: "remaining-1",
        routeLabel: "seoul-station",
        etaLabel: "soon",
      }}
      presentationState="active"
      onConfirm={() => undefined}
    />,
  );

  expect(screen.getByTestId("alert-modal")).toHaveAttribute("data-state", "active");
});
```

- [ ] **Step 2: Run the tracking and alert tests to verify they fail**

Run: `npm run test -- src/screens/TrackingScreen.test.tsx src/features/alerts/components/ArrivalAlertModal.test.tsx src/features/debug/DebugPanel.test.tsx`
Expected: FAIL because tracking does not yet expose playback mode, the modal has no alert state attribute, and the presenter controls are not integrated

- [ ] **Step 3: Implement the live tracking surface, alert state wiring, and compact live activity panel**

```tsx
export function TrackingScreen() {
  const trackingView = useAppStore((state) => state.trackingView);
  const alertOverlay = useAppStore((state) => state.alertOverlay);
  const presentation = useAppStore((state) => state.presentation);
  const demoPlayback = useAppStore((state) => state.demoPlayback);
  const playback = usePlaybackController();

  return (
    <section
      data-testid="tracking-screen"
      className="screen screen--tracking"
      data-presentation={presentation.tracking}
      data-playback-mode={demoPlayback.mode}
    >
      <div className="tracking-hero-card">
        <p className="tracking-hero-card__kicker">live-trip</p>
        <div key={trackingView.remainingStops} className="tracking-hero-card__metric">
          <span data-testid="remaining-stops">{trackingView.remainingStops}</span>
          <small>stops-left</small>
        </div>
        <p className="tracking-hero-card__subtitle">next-stop: {trackingView.nextStopName}</p>
      </div>

      <PresenterControlBar
        mode={demoPlayback.mode}
        onPause={playback.pause}
        onResume={playback.resume}
        onStepForward={playback.stepForward}
        onRestart={playback.restart}
        onConfirmAlert={playback.confirmAlert}
        canConfirmAlert={alertOverlay.isOpen}
      />

      <ArrivalAlertModal
        overlay={alertOverlay}
        presentationState={presentation.alert}
        onConfirm={playback.confirmAlert}
      />
    </section>
  );
}
```

```tsx
type ArrivalAlertModalProps = {
  overlay: AlertOverlayState;
  presentationState: AlertPresentationState;
  onConfirm: () => void;
};

export function ArrivalAlertModal({ overlay, presentationState, onConfirm }: ArrivalAlertModalProps) {
  if (!overlay.isOpen) {
    return null;
  }

  return (
    <div
      data-testid="alert-modal"
      className="alert-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={overlay.title}
      data-state={presentationState}
    >
```

```tsx
export function DebugPanel({ controls }: DebugPanelProps) {
  return (
    <aside data-testid="live-activity" className="debug-panel debug-panel--compact">
      <p>scenario: {controls.scenario.name}</p>
      <p>step: {controls.currentEventIndex} / {controls.totalEvents}</p>
      <p>state: {controls.isComplete ? "complete" : "running"}</p>
    </aside>
  );
}
```

- [ ] **Step 4: Run the tracking and alert tests to verify they pass**

Run: `npm run test -- src/screens/TrackingScreen.test.tsx src/features/alerts/components/ArrivalAlertModal.test.tsx src/features/debug/DebugPanel.test.tsx`
Expected: PASS with live playback attributes, animated metric anchors, and alert confirm progression covered

- [ ] **Step 5: Commit**

```bash
git add src/screens/TrackingScreen.tsx src/screens/TrackingScreen.test.tsx src/features/alerts/components/ArrivalAlertModal.tsx src/features/alerts/components/ArrivalAlertModal.test.tsx src/features/debug/DebugPanel.tsx src/features/debug/DebugPanel.test.tsx
git commit -m "feat: make tracking and alerts feel continuously live"
```

### Task 5: Add Motion System Styling And End-To-End Demo Verification

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/app-shell.css`
- Modify: `tests/e2e/demo-simulation.spec.ts`

- [ ] **Step 1: Write the failing end-to-end demo assertion for the live flow**

```ts
import { expect, test } from "@playwright/test";

test("semi-automatic demo flows from settings into tracking, transfer alert, and final alert", async ({ page }) => {
  await page.goto("/settings");
  await page.getByTestId("demo-start").click();

  await expect(page).toHaveURL(/\/tracking$/);
  await expect(page.getByTestId("tracking-screen")).toHaveAttribute(
    "data-playback-mode",
    "auto_playing",
  );
  await expect(page.getByTestId("alert-modal")).toHaveAttribute("data-state", "active");
  await page.getByRole("button", { name: "confirm-alert" }).click();
  await expect(page.getByText("final-alert")).toBeVisible();
});
```

- [ ] **Step 2: Run the end-to-end demo test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/demo-simulation.spec.ts`
Expected: FAIL because the app does not yet autoplay into tracking or expose the live playback state markers

- [ ] **Step 3: Implement the shared motion tokens and state-driven CSS**

```css
:root {
  --motion-soft-duration: 220ms;
  --motion-live-duration: 320ms;
  --motion-alert-duration: 180ms;
  --motion-soft-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-live-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --motion-alert-ease: cubic-bezier(0.18, 0.9, 0.32, 1.1);
}
```

```css
.screen--home[data-presentation="entered"] .hero-card,
.screen--home[data-presentation="entered"] .quick-destination-grid,
.screen--home[data-presentation="entered"] .search-card {
  animation: screen-rise var(--motion-soft-duration) var(--motion-soft-ease) both;
}

.results-screen[data-presentation="list_revealed"] .route-card {
  animation: route-card-rise var(--motion-soft-duration) var(--motion-soft-ease) both;
  animation-delay: calc(var(--route-card-index, 0) * 60ms);
}

.screen--tracking[data-playback-mode="auto_playing"] .tracking-hero-card__metric span {
  animation: metric-pulse 1.4s var(--motion-live-ease) infinite;
}

.alert-scrim[data-state="opening"] .alert-modal,
.alert-scrim[data-state="active"] .alert-modal {
  animation: alert-lift var(--motion-alert-duration) var(--motion-alert-ease) both;
}

.presenter-control-bar {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1.25rem;
  background: rgba(8, 15, 28, 0.86);
  backdrop-filter: blur(18px);
}
```

- [ ] **Step 4: Run the full verification set**

Run: `npm run test && npm run build && npm run test:e2e -- tests/e2e/demo-simulation.spec.ts`
Expected: PASS for the full unit suite, production build, and deterministic semi-automatic demo flow

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/app-shell.css tests/e2e/demo-simulation.spec.ts
git commit -m "feat: add dynamic motion system for the demo flow"
```

## Self-Review

### Spec Coverage Check

- Explicit playback states `idle`, `auto_playing`, `paused`, `alert_open`, and `completed` are covered in Task 1 and exercised in Task 2.
- Home `entered`, `searching`, and `results_ready` are implemented in Task 3.
- Results `list_revealed`, `route_selected`, and `detail_expanded` are implemented in Task 3.
- Tracking `live`, `countdown_updated`, and `paused` are implemented in Tasks 1, 2, and 4.
- Alert `opening`, `active`, and `closing` are implemented in Tasks 1, 2, and 4.
- Semi-automatic autoplay, pause, resume, next step, restart, and confirm are implemented in Task 2 and consumed in Task 4.
- Transfer and final alert interruption plus confirm-driven continuation are implemented in Tasks 2 and 4, then verified in Task 5.
- Motion system rules for entry, interaction, progress, and alerts are implemented in Task 5.
- Unit and end-to-end testing requirements from the spec are covered across Tasks 1 through 5.

### Placeholder Scan

- No unresolved placeholders remain in task steps.
- Every task includes concrete file paths, code, commands, expected results, and commit messages.

### Type Consistency Check

- `PlaybackMode`, `PresentationState`, and `DemoPlaybackState` are introduced in Task 1 before later tasks depend on them.
- The plan consistently uses `setPlaybackMode`, `setHomePresentationState`, `setResultsPresentationState`, `setTrackingPresentationState`, `setAlertPresentationState`, and `configureDemoPlayback` across all tasks.
- The presenter controls in Tasks 2 and 4 use the same `pause`, `resume`, `stepForward`, `restart`, and `confirmAlert` method names.
- The alert modal consistently uses `presentationState` and `data-state` in both implementation and tests.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-26-arrivehae-dynamic-app-feel.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
