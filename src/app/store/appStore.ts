import React from "react";

export type TrackingViewState = {
  remainingStops: number;
  nextStopName: string;
  simulationPaused: boolean;
};

type AppStoreState = {
  selectedRouteId: string | null;
  boardingRouteId: string | null;
  trackingView: TrackingViewState;
};

type Listener = () => void;

const listeners = new Set<Listener>();

const initialTrackingView: TrackingViewState = {
  remainingStops: 3,
  nextStopName: "Konkuk Univ.",
  simulationPaused: false,
};

const initialState: AppStoreState = {
  selectedRouteId: null,
  boardingRouteId: null,
  trackingView: initialTrackingView,
};

let appStoreState: AppStoreState = initialState;

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

export function toggleSimulationPaused() {
  setTrackingView({
    simulationPaused: !appStoreState.trackingView.simulationPaused,
  });
}

export function resetAppStore() {
  setAppStoreState(initialState);
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
