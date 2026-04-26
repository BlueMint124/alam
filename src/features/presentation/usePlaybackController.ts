import React from "react";
import { AlertEngine, type AlertKind } from "../alerts/AlertEngine";
import {
  configureDemoPlayback,
  resetDemoPlayback,
  setAlertOverlay,
  setAlertPresentationState,
  setDemoPlaybackProgress,
  setPlaybackMode,
  setTrackingPresentationState,
  setTrackingView,
  useAppStore,
  type AlertOverlayState,
} from "../../app/store/appStore";
import {
  demoSeoulTransferScenario,
  type SimulationScenario,
} from "../simulation/SimulationLocationSource";
import { useSimulationControls } from "../simulation/useSimulationControls";

function toAlertOverlay(kind: AlertKind, transferThreshold: number): AlertOverlayState {
  if (kind === "TRANSFER") {
    return {
      isOpen: true,
      title: "곧 환승할 시간이에요",
      description: `환승까지 ${transferThreshold}정거장 남았어요`,
      routeLabel: "4호선 오이도행",
      etaLabel: "곧 도착",
    };
  }

  return {
    isOpen: true,
    title: "곧 내릴 시간이에요",
    description: "서울역까지 1정거장 남았어요",
    routeLabel: "서울역",
    etaLabel: "곧 도착",
  };
}

function getNextEventIndex(currentEventIndex: number, totalEvents: number) {
  return Math.min(totalEvents, currentEventIndex + 1);
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

    const nextEventIndex = getNextEventIndex(
      demoPlayback.currentEventIndex,
      controls.totalEvents,
    );
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
      window.requestAnimationFrame(() => {
        setAlertPresentationState("active");
      });
      setPlaybackMode("alert_open");
      return;
    }

    setPlaybackMode(nextEventIndex >= demoPlayback.totalEvents ? "completed" : "auto_playing");
  }, [
    alertEngine,
    controls,
    demoPlayback.currentEventIndex,
    demoPlayback.finalThreshold,
    demoPlayback.totalEvents,
    demoPlayback.transferThreshold,
  ]);

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

  const confirmAlert = React.useCallback(() => {
    setAlertPresentationState("closing");
    setAlertOverlay({
      isOpen: false,
      title: "",
      description: "",
      routeLabel: "",
      etaLabel: "",
    });
    setTrackingView({ simulationPaused: false });
    setPlaybackMode(
      demoPlayback.currentEventIndex >= demoPlayback.totalEvents ? "completed" : "auto_playing",
    );
  }, [demoPlayback.currentEventIndex, demoPlayback.totalEvents]);

  const pause = React.useCallback(() => {
    setTrackingPresentationState("paused");
    setTrackingView({ simulationPaused: true });
    setPlaybackMode("paused");
  }, []);

  const resume = React.useCallback(() => {
    setTrackingPresentationState("live");
    setTrackingView({ simulationPaused: false });
    setPlaybackMode("auto_playing");
  }, []);

  const restart = React.useCallback(() => {
    emittedAlertsRef.current = [];
    controls.resetScenario();
    resetDemoPlayback(controls.totalEvents);
    configureDemoPlayback({
      totalEvents: controls.totalEvents,
      transferThreshold: demoPlayback.transferThreshold,
      finalThreshold: demoPlayback.finalThreshold,
      transferEnabled: demoPlayback.transferEnabled,
    });
    setAlertOverlay({
      isOpen: false,
      title: "",
      description: "",
      routeLabel: "",
      etaLabel: "",
    });
    setAlertPresentationState("closing");
    setTrackingPresentationState("live");
    setTrackingView({
      remainingStops: controls.totalEvents,
      nextStopName: "next-stop",
      simulationPaused: false,
    });
    setPlaybackMode("auto_playing");
  }, [controls, demoPlayback.finalThreshold, demoPlayback.transferEnabled, demoPlayback.transferThreshold]);

  return {
    controls,
    pause,
    resume,
    stepForward: runStep,
    restart,
    confirmAlert,
  };
}
