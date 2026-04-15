import type { TrackingPositionEvent } from "../tracking/types";
import demoSeoulTransferScenarioJson from "./scenarios/demo-seoul-transfer.json";

export type SimulationScenarioEvent = TrackingPositionEvent;

export type SimulationScenario = {
  id: string;
  name: string;
  description?: string;
  events: SimulationScenarioEvent[];
};

export const demoSeoulTransferScenario: SimulationScenario =
  demoSeoulTransferScenarioJson;

export class SimulationLocationSource {
  private eventIndex = 0;

  constructor(private readonly scenario: SimulationScenario) {}

  next(): TrackingPositionEvent | null {
    const nextEvent = this.scenario.events[this.eventIndex];

    if (!nextEvent) {
      return null;
    }

    this.eventIndex += 1;

    return { ...nextEvent };
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
    return this.scenario;
  }
}
