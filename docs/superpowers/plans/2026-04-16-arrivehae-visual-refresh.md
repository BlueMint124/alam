# ArriveHae Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the presentation-critical ArriveHae UI so the web MVP matches the approved dark premium mobile-app style, uses Korean-first product copy, and keeps the existing route, tracking, and demo logic intact.

**Architecture:** Keep the current route search, store, simulation, and alert logic, but move the app to a shared mobile shell layout under the router. Centralize the visual system in `tokens.css` and `app-shell.css`, then update each presentation screen and card component to consume the same typography, spacing, chip, button, and modal language.

**Tech Stack:** React, TypeScript, React Router, existing external store in `appStore.ts`, CSS variables, Vitest, Testing Library, Playwright

---

## Planned File Structure

- Modify: `src/styles/tokens.css` - load fonts and define the new dark premium palette, text colors, glows, spacing, and reusable UI variables.
- Modify: `src/styles/app-shell.css` - define the centered mobile shell, floating navigation, card surfaces, pills, buttons, form fields, and modal treatments.
- Modify: `src/app/App.tsx` - convert the app shell into a shared layout using `Outlet` and a persistent bottom tab bar.
- Modify: `src/app/router.tsx` - nest `/`, `/tracking`, and `/settings` under the shared shell layout.
- Modify: `src/app/App.test.tsx` - update shell assertions for the new shared layout.
- Modify: `src/app/router.test.tsx` - verify shell rendering and active Korean tab labels on nested routes.
- Create: `src/features/ui/AppTabBar.tsx` - reusable mobile bottom tab bar with Korean labels and active route styling.
- Create: `src/features/ui/AppTabBar.test.tsx` - verify active tab and labels.
- Modify: `src/screens/HomeScreen.tsx` - redesign the home hero, quick destinations, Korean copy, and recent route section.
- Modify: `src/features/routes/components/RouteSearchForm.tsx` - redesign inputs and CTA with Korean labels and placeholders.
- Create: `src/features/routes/components/QuickDestinationCard.tsx` - focused card for home quick destinations.
- Modify: `src/screens/HomeScreen.test.tsx` - assert Korean home copy and refreshed interaction states.
- Modify: `src/screens/ResultsScreen.tsx` - restructure route list and detail area into presentation cards.
- Modify: `src/features/routes/components/RouteOptionCard.tsx` - show recommended route emphasis, line chips, and Korean summary copy.
- Modify: `src/features/routes/components/RouteDetailCard.tsx` - restyle selected route details, boarding CTA, and favorite CTA in Korean.
- Modify: `src/screens/ResultsScreen.test.tsx` - assert refreshed route selection flow.
- Modify: `src/features/routes/components/RouteDetailCard.test.tsx` - assert Korean detail labels and action buttons.
- Modify: `src/app/store/appStore.ts` - add alert overlay state and queue helpers without breaking existing tracking state.
- Modify: `src/screens/TrackingScreen.tsx` - redesign the tracking surface with large remaining-stop metric, timeline, and integrated alert overlay.
- Modify: `src/screens/TrackingScreen.test.tsx` - assert Korean tracking copy and alert presentation hooks.
- Create: `src/features/alerts/components/ArrivalAlertModal.tsx` - signature modal for transfer and near-arrival alerts.
- Create: `src/features/alerts/components/ArrivalAlertModal.test.tsx` - verify modal copy and actions.
- Modify: `src/screens/SettingsScreen.tsx` - redesign demo controls and Korean settings copy; wire the deterministic alert queue.
- Modify: `src/features/debug/DebugPanel.tsx` - visually align the debug panel with the refreshed shell for presentation-safe usage.
- Create: `src/screens/SettingsScreen.test.tsx` - assert Korean settings labels and demo trigger behavior.
- Modify: `tests/e2e/demo-simulation.spec.ts` - update the end-to-end demo assertions for Korean copy and modal flow.

### Task 1: Rebuild The Shared Mobile Shell

**Files:**
- Create: `src/features/ui/AppTabBar.tsx`
- Create: `src/features/ui/AppTabBar.test.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/app-shell.css`
- Modify: `src/app/App.tsx`
- Modify: `src/app/router.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/app/router.test.tsx`

- [ ] **Step 1: Write the failing layout tests**

```tsx
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { appRoutes } from "./router";

it("renders the shared shell and Korean tabs on nested routes", async () => {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ["/settings"],
  });

  render(<RouterProvider router={router} />);

  expect(await screen.findByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "홈" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "설정" })).toHaveAttribute("aria-current", "page");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/app/App.test.tsx src/app/router.test.tsx src/features/ui/AppTabBar.test.tsx`
Expected: FAIL because the shared tab bar, nested shell layout, and Korean navigation do not exist yet

- [ ] **Step 3: Implement the shared shell, nested routes, and visual foundation**

```tsx
import { Outlet } from "react-router-dom";
import { AppTabBar } from "../features/ui/AppTabBar";

export function App() {
  return (
    <div className="app-stage">
      <div className="app-stage__glow app-stage__glow--lavender" />
      <div className="app-stage__glow app-stage__glow--mint" />
      <div className="app-shell">
        <header className="app-bar">
          <div className="app-brand-lockup">
            <span className="app-brand-kicker">Transit Alarm</span>
            <h1 className="app-brand-wordmark">ArriveHae</h1>
          </div>
        </header>
        <main className="app-main">
          <Outlet />
        </main>
        <AppTabBar />
      </div>
    </div>
  );
}
```

```tsx
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "홈" },
  { to: "/tracking", label: "알림" },
  { to: "/settings", label: "설정" },
];

export function AppTabBar() {
  return (
    <nav aria-label="앱 하단 탭" className="tab-bar">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) =>
            isActive ? "tab-bar__item tab-bar__item--active" : "tab-bar__item"
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
```

```tsx
export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: "tracking", element: <TrackingScreen /> },
      { path: "settings", element: <SettingsScreen /> },
    ],
  },
];
```

```css
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap");
@import url("https://cdn.jsdelivr.net/npm/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css");

:root {
  color-scheme: dark;
  --color-bg: #060b14;
  --color-surface: rgba(16, 24, 39, 0.88);
  --color-surface-elevated: rgba(21, 30, 49, 0.94);
  --color-text: #f3f7ff;
  --color-muted: #97a6bf;
  --color-lavender: #a595fd;
  --color-lavender-glow: rgba(165, 149, 253, 0.22);
  --color-mint: #7de7c5;
  --font-display: "Sora", sans-serif;
  --font-body: "Pretendard Variable", sans-serif;
}
```

- [ ] **Step 4: Run tests to verify the shell passes**

Run: `npm run test -- src/app/App.test.tsx src/app/router.test.tsx src/features/ui/AppTabBar.test.tsx`
Expected: PASS with the shared shell heading, Korean tabs, and nested routes all rendering correctly

- [ ] **Step 5: Commit**

```bash
git add src/features/ui/AppTabBar.tsx src/features/ui/AppTabBar.test.tsx src/styles/tokens.css src/styles/app-shell.css src/app/App.tsx src/app/router.tsx src/app/App.test.tsx src/app/router.test.tsx
git commit -m "feat: add arrivehae shared mobile shell"
```

### Task 2: Refresh The Home Screen And Search Flow

**Files:**
- Create: `src/features/routes/components/QuickDestinationCard.tsx`
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `src/features/routes/components/RouteSearchForm.tsx`
- Modify: `src/screens/HomeScreen.test.tsx`

- [ ] **Step 1: Write the failing home screen test for Korean copy and layout content**

```tsx
import { render, screen } from "@testing-library/react";
import { HomeScreen } from "./HomeScreen";

it("renders the refreshed Korean home hero and search form", () => {
  window.localStorage.setItem(
    "arrivehae.recentRoutes",
    JSON.stringify([
      {
        providerRouteId: "google-route-1",
        summary: "명동역에서 서울역",
        savedAt: "2026-04-16T20:30:00+09:00",
      },
    ]),
  );

  render(<HomeScreen />);

  expect(screen.getByText("지금 어디서 내려야 할지 놓치지 마세요")).toBeInTheDocument();
  expect(screen.getByLabelText("출발지")).toBeInTheDocument();
  expect(screen.getByLabelText("도착지")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "길찾기" })).toBeInTheDocument();
  expect(screen.getByText("최근 경로")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/screens/HomeScreen.test.tsx`
Expected: FAIL because the home screen still uses English utility copy and does not render the refreshed home sections

- [ ] **Step 3: Implement the home hero, quick destinations, and Korean search form**

```tsx
export function RouteSearchForm(props: RouteSearchFormProps) {
  return (
    <form className="search-card" onSubmit={(event) => {
      event.preventDefault();
      props.onSubmit();
    }}>
      <label className="field-label" htmlFor="route-from">출발지</label>
      <input
        id="route-from"
        className="search-input"
        placeholder="예: 명동역"
        value={props.from}
        onChange={(event) => props.onFromChange(event.target.value)}
      />

      <label className="field-label" htmlFor="route-to">도착지</label>
      <input
        id="route-to"
        className="search-input"
        placeholder="예: 서울역"
        value={props.to}
        onChange={(event) => props.onToChange(event.target.value)}
      />

      <button className="primary-button" type="submit" disabled={props.isSearching}>
        {props.isSearching ? "경로를 찾는 중" : "길찾기"}
      </button>
    </form>
  );
}
```

```tsx
export function HomeScreen() {
  return (
    <section className="screen screen--home">
      <div className="hero-card">
        <p className="hero-kicker">도착 알림</p>
        <h2 className="hero-title">지금 어디서 내려야 할지 놓치지 마세요</h2>
        <p className="hero-copy">대중교통 경로를 선택하면 하차 전과 환승 전에 알림을 보내드려요.</p>
      </div>

      <div className="quick-destination-grid">
        <QuickDestinationCard label="집" meta="최근 저장됨" tone="lavender" />
        <QuickDestinationCard label="학교" meta="오전 9시 도착" tone="mint" />
      </div>

            <RouteSearchForm
        from={from}
        to={to}
        isSearching={isSearching}
        onFromChange={setFrom}
        onToChange={setTo}
        onSubmit={handleSearch}
      />

      <section aria-label="최근 경로" className="home-section">
        <h3>최근 경로</h3>
        <ul className="recent-route-list">
  {recentRoutes.map((route) => (
    <li key={`${route.providerRouteId}-${route.savedAt}`}>{route.summary}</li>
  ))}
</ul>
      </section>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify the home flow passes**

Run: `npm run test -- src/screens/HomeScreen.test.tsx`
Expected: PASS with Korean hero copy, labeled inputs, search CTA, and recent route rendering

- [ ] **Step 5: Commit**

```bash
git add src/features/routes/components/QuickDestinationCard.tsx src/screens/HomeScreen.tsx src/features/routes/components/RouteSearchForm.tsx src/screens/HomeScreen.test.tsx
git commit -m "feat: refresh arrivehae home screen"
```

### Task 3: Redesign Route Selection And Detail Cards

**Files:**
- Modify: `src/screens/ResultsScreen.tsx`
- Modify: `src/features/routes/components/RouteOptionCard.tsx`
- Modify: `src/features/routes/components/RouteDetailCard.tsx`
- Modify: `src/screens/ResultsScreen.test.tsx`
- Modify: `src/features/routes/components/RouteDetailCard.test.tsx`

- [ ] **Step 1: Write the failing route selection tests for Korean card content**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { ResultsScreen } from "./ResultsScreen";

it("shows a recommendation card and Korean detail actions", () => {
  render(<ResultsScreen routes={routes} />);

  expect(screen.getByText("추천 경로")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "이 경로 자세히 보기" }));

  expect(screen.getByText("4개 역 이동")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "탑승 시작" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "즐겨찾기 저장" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/screens/ResultsScreen.test.tsx src/features/routes/components/RouteDetailCard.test.tsx`
Expected: FAIL because the route cards still use English button text, plain metadata, and no recommendation presentation

- [ ] **Step 3: Implement the route result cards and Korean detail copy**

```tsx
export function RouteOptionCard({ route, isSelected, onSelect }: RouteOptionCardProps) {
  const lineSummary = route.segments
    .filter((segment) => segment.kind === "transit")
    .map((segment) => `${segment.lineName} · ${segment.stopCount}${segment.vehicleType === "subway" ? "개 역" : "정거장"}`)
    .join(" / ");

  return (
    <article className={isSelected ? "route-card route-card--active" : "route-card"}>
      <div className="route-card__meta">
        <span className="route-badge">추천 경로</span>
        <span>{route.durationMinutes}분</span>
      </div>
      <h3>{route.summary}</h3>
      <p className="route-card__summary">{lineSummary}</p>
      <button type="button" className="secondary-button" onClick={() => onSelect(route.providerRouteId)}>
        {isSelected ? "선택된 경로" : "이 경로 자세히 보기"}
      </button>
    </article>
  );
}
```

```tsx
export function RouteDetailCard({ route, boardingStarted, onBoardingStart }: RouteDetailCardProps) {
  return (
    <aside aria-label="선택한 경로 상세" className="detail-card">
      <h3>{route.summary}</h3>
      <p className="detail-card__duration">총 {route.durationMinutes}분</p>
      <ul className="segment-list">
        {route.segments.map((segment) => (
          <li key={segment.id} className="segment-row">
            <p>{segment.instruction}</p>
            {segment.kind === "transit" ? <span>{segment.stopCount}{segment.vehicleType === "subway" ? "개 역 이동" : "정거장 이동"}</span> : null}
          </li>
        ))}
      </ul>
      <div className="detail-card__actions">
        <button type="button" className="ghost-button">즐겨찾기 저장</button>
        <button type="button" className="primary-button" onClick={onBoardingStart}>탑승 시작</button>
      </div>
      {boardingStarted ? <p>이 경로로 탑승을 시작했어요.</p> : null}
    </aside>
  );
}
```

- [ ] **Step 4: Run tests to verify the route flow passes**

Run: `npm run test -- src/screens/ResultsScreen.test.tsx src/features/routes/components/RouteDetailCard.test.tsx`
Expected: PASS with Korean route CTA copy, recommendation content, and refreshed boarding detail behavior

- [ ] **Step 5: Commit**

```bash
git add src/screens/ResultsScreen.tsx src/features/routes/components/RouteOptionCard.tsx src/features/routes/components/RouteDetailCard.tsx src/screens/ResultsScreen.test.tsx src/features/routes/components/RouteDetailCard.test.tsx
git commit -m "feat: refresh route selection cards"
```

### Task 4: Build The Tracking Screen And Signature Alert Modal

**Files:**
- Create: `src/features/alerts/components/ArrivalAlertModal.tsx`
- Create: `src/features/alerts/components/ArrivalAlertModal.test.tsx`
- Modify: `src/app/store/appStore.ts`
- Modify: `src/screens/TrackingScreen.tsx`
- Modify: `src/screens/TrackingScreen.test.tsx`

- [ ] **Step 1: Write the failing tracking and modal tests**

```tsx
import { render, screen } from "@testing-library/react";
import { setTrackingView, setAlertOverlay } from "../app/store/appStore";
import { TrackingScreen } from "./TrackingScreen";

it("renders Korean tracking metrics and the alert modal", () => {
  setTrackingView({ remainingStops: 2, nextStopName: "서울역" });
  setAlertOverlay({
    isOpen: true,
    title: "곧 내릴 시간이에요",
    description: "서울역까지 2정거장 남았어요",
    routeLabel: "4호선 오이도행",
    etaLabel: "2분 후",
  });

  render(<TrackingScreen />);

  expect(screen.getByText("2정거장 남았어요")).toBeInTheDocument();
  expect(screen.getByText("다음 하차: 서울역")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/screens/TrackingScreen.test.tsx src/features/alerts/components/ArrivalAlertModal.test.tsx`
Expected: FAIL because the store has no alert overlay state and the tracking screen still uses the plain English placeholder UI

- [ ] **Step 3: Implement the alert overlay state, modal, and premium tracking surface**

```ts
export type AlertOverlayState = {
  isOpen: boolean;
  title: string;
  description: string;
  routeLabel: string;
  etaLabel: string;
};

export function setAlertOverlay(nextOverlay: Partial<AlertOverlayState>) {
  setAppStoreState({
    ...appStoreState,
    alertOverlay: {
      ...appStoreState.alertOverlay,
      ...nextOverlay,
    },
  });
}

export function setAlertQueue(queue: AlertOverlayState[]) {
  setAppStoreState({
    ...appStoreState,
    alertQueue: queue,
    alertOverlay: queue[0] ?? initialAlertOverlay,
  });
}
```

```tsx
export function ArrivalAlertModal({ overlay, onConfirm }: ArrivalAlertModalProps) {
  if (!overlay.isOpen) {
    return null;
  }

  return (
    <div className="alert-scrim" role="dialog" aria-modal="true" aria-label={overlay.title}>
      <section className="alert-modal">
        <div className="alert-modal__icon">진동</div>
        <h2>{overlay.title}</h2>
        <p>{overlay.description}</p>
        <div className="alert-modal__meta">
          <span>{overlay.routeLabel}</span>
          <span>{overlay.etaLabel}</span>
        </div>
        <button type="button" className="primary-button" onClick={onConfirm}>확인</button>
      </section>
    </div>
  );
}
```

```tsx
export function TrackingScreen() {
  const trackingView = useAppStore((state) => state.trackingView);
  const alertOverlay = useAppStore((state) => state.alertOverlay);

  return (
    <section aria-label="추적 화면" className="screen screen--tracking">
      <div className="tracking-hero-card">
        <p className="tracking-hero-card__kicker">현재 탑승 중</p>
        <h2>{trackingView.remainingStops}정거장 남았어요</h2>
        <p>다음 하차: {trackingView.nextStopName}</p>
      </div>
      <button type="button" className="secondary-button" onClick={toggleSimulationPaused}>
        {trackingView.simulationPaused ? "시뮬레이션 다시 시작" : "시뮬레이션 일시정지"}
      </button>
      <ArrivalAlertModal overlay={alertOverlay} onConfirm={() => setAlertOverlay({ isOpen: false })} />
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify the tracking surface passes**

Run: `npm run test -- src/screens/TrackingScreen.test.tsx src/features/alerts/components/ArrivalAlertModal.test.tsx`
Expected: PASS with Korean remaining-stop copy, next-stop copy, and the modal CTA rendering through the store

- [ ] **Step 5: Commit**

```bash
git add src/features/alerts/components/ArrivalAlertModal.tsx src/features/alerts/components/ArrivalAlertModal.test.tsx src/app/store/appStore.ts src/screens/TrackingScreen.tsx src/screens/TrackingScreen.test.tsx
git commit -m "feat: add premium tracking screen and alert modal"
```

### Task 5: Refresh Settings, Demo Controls, And End-To-End Verification

**Files:**
- Modify: `src/screens/SettingsScreen.tsx`
- Create: `src/screens/SettingsScreen.test.tsx`
- Modify: `src/features/debug/DebugPanel.tsx`
- Modify: `tests/e2e/demo-simulation.spec.ts`

- [ ] **Step 1: Write the failing settings and demo tests**

```tsx
import { render, screen } from "@testing-library/react";
import { SettingsScreen } from "./SettingsScreen";

it("renders Korean settings controls and demo entry", () => {
  render(<SettingsScreen />);

  expect(screen.getByText("알림 설정")).toBeInTheDocument();
  expect(screen.getByLabelText("버스 알림 시점")).toBeInTheDocument();
  expect(screen.getByLabelText("지하철 알림 시점")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "데모 시나리오 불러오기" })).toBeInTheDocument();
});
```

```ts
import { test, expect } from "@playwright/test";

test("demo scenario shows the transfer and near-arrival alert flow in Korean", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "데모 시나리오 불러오기" }).click();
  await expect(page.getByText("곧 환승할 시간이에요")).toBeVisible();
  await page.getByRole("button", { name: "확인" }).click();
  await expect(page.getByText("곧 내릴 시간이에요")).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/screens/SettingsScreen.test.tsx && npm run test:e2e -- tests/e2e/demo-simulation.spec.ts`
Expected: FAIL because settings still use English labels and the demo does not drive the new Korean alert modal flow

- [ ] **Step 3: Implement the Korean settings screen, demo alert queue, and polished debug panel**

```tsx
export function SettingsScreen() {
  const [busThreshold, setBusThreshold] = React.useState(3);
  const [subwayThreshold, setSubwayThreshold] = React.useState(3);
  const [transferEnabled, setTransferEnabled] = React.useState(true);

  const handleLoadDemoScenario = () => {
    setTrackingView({ remainingStops: 2, nextStopName: "서울역", simulationPaused: false });
    setAlertQueue([
      {
        title: "곧 환승할 시간이에요",
        description: `환승까지 ${subwayThreshold}정거장 남았어요`,
        routeLabel: "4호선 오이도행",
        etaLabel: "곧 도착",
      },
      {
        title: "곧 내릴 시간이에요",
        description: "서울역까지 2정거장 남았어요",
        routeLabel: "서울역",
        etaLabel: "2분 후",
      },
    ]);
  };

  return (
    <section aria-label="설정 화면" className="screen screen--settings">
      <h2>알림 설정</h2>
      <label>
        버스 알림 시점
        <input type="range" min="3" max="5" value={busThreshold} onChange={(event) => setBusThreshold(Number(event.target.value))} />
      </label>
      <label>
        지하철 알림 시점
        <input type="range" min="3" max="4" value={subwayThreshold} onChange={(event) => setSubwayThreshold(Number(event.target.value))} />
      </label>
      <label>
        <input type="checkbox" checked={transferEnabled} onChange={(event) => setTransferEnabled(event.target.checked)} />
        환승 전 알림 사용
      </label>
      <button type="button" className="primary-button" onClick={handleLoadDemoScenario}>데모 시나리오 불러오기</button>
    </section>
  );
}
```

```tsx
export function DebugPanel({ controls }: DebugPanelProps) {
  return (
    <aside aria-label="시뮬레이션 디버그 패널" className="debug-panel">
      <h2>시뮬레이션 디버그</h2>
      <p>{controls.scenario.name}</p>
      <p>재생 진행률: {controls.currentEventIndex} / {controls.totalEvents}</p>
      <div className="debug-panel__actions">
  <button type="button" onClick={controls.nextEvent} disabled={controls.isComplete}>다음 이벤트</button>
  <button type="button" onClick={controls.resetScenario}>처음부터 다시</button>
</div>
    </aside>
  );
}
```

- [ ] **Step 4: Run the full verification set**

Run: `npm run test && npm run build && npm run test:e2e -- tests/e2e/demo-simulation.spec.ts`
Expected: PASS for the refreshed unit tests, production build, and one deterministic Korean demo flow through the modal sequence

- [ ] **Step 5: Commit**

```bash
git add src/screens/SettingsScreen.tsx src/screens/SettingsScreen.test.tsx src/features/debug/DebugPanel.tsx tests/e2e/demo-simulation.spec.ts
git commit -m "feat: finish arrivehae visual refresh demo flow"
```

## Self-Review

### Spec Coverage Check

- Shared mobile shell, centered app framing, and Korean tab labels are covered in Task 1.
- Typography loading, palette updates, and reusable shell styling are covered in Task 1.
- Home hero, Korean search inputs, quick destination cards, and recent routes are covered in Task 2.
- Route comparison cards, recommendation emphasis, and Korean detail actions are covered in Task 3.
- Tracking emphasis, large remaining-stop metrics, and the signature alert modal are covered in Task 4.
- Korean settings copy, deterministic demo controls, and end-to-end verification are covered in Task 5.
- The plan intentionally preserves the existing search, storage, simulation, and alert engines instead of redesigning their core behavior.

### Placeholder Scan

- No `TBD`
- No `TODO`
- No unresolved "implement later" steps
- Every test, command, and commit target names concrete files

### Type Consistency Check

- The shared shell keeps route component contracts intact and only changes layout composition.
- `AlertOverlayState`, `setAlertOverlay`, and `setAlertQueue` are introduced before the settings demo flow depends on them.
- Korean UI copy changes are reflected in the matching test files before end-to-end verification.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-16-arrivehae-visual-refresh.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?

