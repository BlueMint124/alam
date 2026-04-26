import type { TrackingPositionEvent } from "../tracking/types";
import demoSeoulTransferScenarioJson from "./scenarios/demo-seoul-transfer.json";

export type SimulationScenarioEvent = TrackingPositionEvent;

export type SimulationScenario = {
  id: string;
  name: string;
  description?: string;
  events: SimulationScenarioEvent[];
};

function cloneEvent(event: SimulationScenarioEvent): SimulationScenarioEvent {
  return { ...event };
}

function cloneScenario(scenario: SimulationScenario): SimulationScenario {
  return {
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    events: scenario.events.map(cloneEvent),
  };
}

export const demoSeoulTransferScenario: SimulationScenario =
  cloneScenario(demoSeoulTransferScenarioJson as SimulationScenario);

export class SimulationLocationSource {
  private readonly scenario: SimulationScenario;
  private eventIndex = 0;

  constructor(scenario: SimulationScenario) {
    this.scenario = cloneScenario(scenario);
  }

  next(): TrackingPositionEvent | null {
    const nextEvent = this.scenario.events[this.eventIndex];

    if (!nextEvent) {
      return null;
    }

    this.eventIndex += 1;

    return cloneEvent(nextEvent);
  }

  reset() {
    this.eventIndex = 0;
  }

  isComplete() {
    return this.eventIndex >= this.scenario.events.length;
  }

  getEventIndex() {
    return this.eventIndex;
  }

  getTotalEvents() {
    return this.scenario.events.length;
  }

  getScenario() {
    return cloneScenario(this.scenario);
  }
}
