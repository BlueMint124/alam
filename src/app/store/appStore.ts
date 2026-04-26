import React from "react";
import type {
  AlertPresentationState,
  DemoPlaybackState,
  HomePresentationState,
  PlaybackMode,
  PresentationState,
  ResultsPresentationState,
  TrackingPresentationState,
} from "../../features/presentation/types";

export type TrackingViewState = {
  remainingStops: number;
  nextStopName: string;
  simulationPaused: boolean;
};

export type AlertOverlayState = {
  isOpen: boolean;
  title: string;
  description: string;
  routeLabel: string;
  etaLabel: string;
};

type AppStoreState = {
  selectedRouteId: string | null;
  boardingRouteId: string | null;
  trackingView: TrackingViewState;
  alertOverlay: AlertOverlayState;
  alertQueue: AlertOverlayState[];
  presentation: PresentationState;
  demoPlayback: DemoPlaybackState;
};

type Listener = () => void;

const listeners = new Set<Listener>();

const initialTrackingView: TrackingViewState = {
  remainingStops: 3,
  nextStopName: "Konkuk Univ.",
  simulationPaused: false,
};

const initialAlertOverlay: AlertOverlayState = {
  isOpen: false,
  title: "",
  description: "",
  routeLabel: "",
  etaLabel: "",
};

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

function createInitialState(): AppStoreState {
  return {
    selectedRouteId: null,
    boardingRouteId: null,
    trackingView: {
      ...initialTrackingView,
    },
    alertOverlay: {
      ...initialAlertOverlay,
    },
    alertQueue: [],
    presentation: {
      ...initialPresentationState,
    },
    demoPlayback: {
      ...initialDemoPlaybackState,
    },
  };
}

const initialState = createInitialState();
let appStoreState: AppStoreState = createInitialState();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setAppStoreState(nextState: AppStoreState) {
  appStoreState = nextState;
  emitChange();
}

export function getAppStoreState() {
  return appStoreState;
}

export function selectRoute(routeId: string) {
  setAppStoreState({
    ...appStoreState,
    selectedRouteId: routeId,
  });
}

export function clearSelectedRoute() {
  setAppStoreState({
    ...appStoreState,
    selectedRouteId: null,
    boardingRouteId: null,
  });
}

export function startBoarding(routeId: string) {
  setAppStoreState({
    ...appStoreState,
    selectedRouteId: routeId,
    boardingRouteId: routeId,
  });
}

export function setTrackingView(nextTrackingView: Partial<TrackingViewState>) {
  setAppStoreState({
    ...appStoreState,
    trackingView: {
      ...appStoreState.trackingView,
      ...nextTrackingView,
    },
  });
}

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
  const nextQueue = queue.map((item) => ({ ...item }));

  setAppStoreState({
    ...appStoreState,
    alertQueue: nextQueue,
    alertOverlay: nextQueue[0] ?? { ...initialAlertOverlay },
  });
}

export function advanceAlertQueue() {
  if (appStoreState.alertQueue.length <= 1) {
    setAppStoreState({
      ...appStoreState,
      alertQueue: [],
      alertOverlay: {
        ...initialAlertOverlay,
      },
    });

    return;
  }

  const nextQueue = appStoreState.alertQueue.slice(1);

  setAppStoreState({
    ...appStoreState,
    alertQueue: nextQueue,
    alertOverlay: {
      ...nextQueue[0],
    },
  });
}

export function configureDemoPlayback(
  nextPlayback: Omit<DemoPlaybackState, "mode" | "currentEventIndex">,
) {
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

export function toggleSimulationPaused() {
  setTrackingView({
    simulationPaused: !appStoreState.trackingView.simulationPaused,
  });
}

export function resetAppStore() {
  setAppStoreState(createInitialState());
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useAppStore<T>(selector: (state: AppStoreState) => T) {
  return React.useSyncExternalStore(
    subscribe,
    () => selector(appStoreState),
    () => selector(initialState),
  );
}
