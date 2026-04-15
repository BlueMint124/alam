import React from "react";
import type { TrackingPositionEvent } from "../tracking/types";
import {
  demoSeoulTransferScenario,
  SimulationLocationSource,
  type SimulationScenario,
} from "./SimulationLocationSource";

export type SimulationControls = {
  scenario: SimulationScenario;
  currentEventIndex: number;
  totalEvents: number;
  isComplete: boolean;
  lastEvent: TrackingPositionEvent | null;
  nextEvent: () => TrackingPositionEvent | null;
  resetScenario: () => void;
};

export function useSimulationControls(
  scenario: SimulationScenario = demoSeoulTransferScenario,
): SimulationControls {
  const sourceRef = React.useRef<SimulationLocationSource>(
    new SimulationLocationSource(scenario),
  );
  const [currentEventIndex, setCurrentEventIndex] = React.useState(0);
  const [lastEvent, setLastEvent] = React.useState<TrackingPositionEvent | null>(
    null,
  );

  React.useEffect(() => {
    sourceRef.current = new SimulationLocationSource(scenario);
    setCurrentEventIndex(0);
    setLastEvent(null);
  }, [scenario]);

  const nextEvent = () => {
    const event = sourceRef.current.next();
    setCurrentEventIndex(sourceRef.current.getEventIndex());

    if (event) {
      setLastEvent(event);
    }

    return event;
  };

  const resetScenario = () => {
    sourceRef.current.reset();
    setCurrentEventIndex(0);
    setLastEvent(null);
  };

  return {
    scenario,
    currentEventIndex,
    totalEvents: sourceRef.current.getTotalEvents(),
    isComplete: sourceRef.current.isComplete(),
    lastEvent,
    nextEvent,
    resetScenario,
  };
}
