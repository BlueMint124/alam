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

type SimulationState = {
  scenarioId: string;
  currentEventIndex: number;
  lastEvent: TrackingPositionEvent | null;
};

function createSimulationState(scenario: SimulationScenario): SimulationState {
  return {
    scenarioId: scenario.id,
    currentEventIndex: 0,
    lastEvent: null,
  };
}

export function useSimulationControls(
  scenario: SimulationScenario = demoSeoulTransferScenario,
): SimulationControls {
  const source = React.useMemo(
    () => new SimulationLocationSource(scenario),
    [scenario],
  );
  const [state, setState] = React.useState(() => createSimulationState(scenario));

  const activeState =
    state.scenarioId === scenario.id ? state : createSimulationState(scenario);

  const nextEvent = () => {
    const event = source.next();

    setState({
      scenarioId: scenario.id,
      currentEventIndex: source.getEventIndex(),
      lastEvent: event ?? activeState.lastEvent,
    });

    return event;
  };

  const resetScenario = () => {
    source.reset();
    setState(createSimulationState(scenario));
  };

  return {
    scenario,
    currentEventIndex: activeState.currentEventIndex,
    totalEvents: source.getTotalEvents(),
    isComplete: source.isComplete(),
    lastEvent: activeState.lastEvent,
    nextEvent,
    resetScenario,
  };
}
