import React from "react";

type AppStoreState = {
  selectedRouteId: string | null;
  boardingRouteId: string | null;
};

type Listener = () => void;

const listeners = new Set<Listener>();

const initialState: AppStoreState = {
  selectedRouteId: null,
  boardingRouteId: null,
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
    selectedRouteId: null,
    boardingRouteId: null,
  });
}

export function startBoarding(routeId: string) {
  setAppStoreState({
    selectedRouteId: routeId,
    boardingRouteId: routeId,
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
