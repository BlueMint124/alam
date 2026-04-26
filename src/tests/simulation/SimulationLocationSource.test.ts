import { describe, expect, it } from "vitest";
import {
  SimulationLocationSource,
  type SimulationScenario,
} from "../../features/simulation/SimulationLocationSource";

function createScenario(): SimulationScenario {
  return {
    id: "test-seoul-transfer",
    name: "Test Seoul transfer",
    events: [
      {
        stopIndex: 1,
        segmentId: "line-4",
        timestamp: "2026-04-15T08:12:00+09:00",
      },
      {
        stopIndex: 2,
        segmentId: "line-4",
        timestamp: "2026-04-15T08:15:00+09:00",
      },
      {
        stopIndex: 3,
        segmentId: "line-4",
        timestamp: "2026-04-15T08:18:00+09:00",
      },
    ],
  };
}

describe("SimulationLocationSource", () => {
  it("replays scenario events in deterministic sequence", () => {
    const source = new SimulationLocationSource(createScenario());

    expect(source.isComplete()).toBe(false);
    expect(source.next()).toEqual({
      stopIndex: 1,
      segmentId: "line-4",
      timestamp: "2026-04-15T08:12:00+09:00",
    });
    expect(source.next()).toEqual({
      stopIndex: 2,
      segmentId: "line-4",
      timestamp: "2026-04-15T08:15:00+09:00",
    });
    expect(source.next()).toEqual({
      stopIndex: 3,
      segmentId: "line-4",
      timestamp: "2026-04-15T08:18:00+09:00",
    });
    expect(source.next()).toBeNull();
    expect(source.isComplete()).toBe(true);
  });

  it("resets replay state back to the first event", () => {
    const source = new SimulationLocationSource(createScenario());

    source.next();
    source.next();

    source.reset();

    expect(source.isComplete()).toBe(false);
    expect(source.next()).toEqual({
      stopIndex: 1,
      segmentId: "line-4",
      timestamp: "2026-04-15T08:12:00+09:00",
    });
  });

  it("does not let external scenario mutation change replay length or order", () => {
    const scenario = createScenario();
    const source = new SimulationLocationSource(scenario);

    scenario.name = "Mutated name";
    scenario.events.unshift({
      stopIndex: 0,
      segmentId: "mutated-line",
      timestamp: "2026-04-15T08:00:00+09:00",
    });
    source.getScenario().events.push({
      stopIndex: 99,
      segmentId: "leaked-line",
      timestamp: "2026-04-15T08:59:00+09:00",
    });

    expect(source.getScenario().name).toBe("Test Seoul transfer");
    expect(source.getTotalEvents()).toBe(3);
    expect(source.next()).toEqual({
      stopIndex: 1,
      segmentId: "line-4",
      timestamp: "2026-04-15T08:12:00+09:00",
    });
    expect(source.next()).toEqual({
      stopIndex: 2,
      segmentId: "line-4",
      timestamp: "2026-04-15T08:15:00+09:00",
    });
    expect(source.next()).toEqual({
      stopIndex: 3,
      segmentId: "line-4",
      timestamp: "2026-04-15T08:18:00+09:00",
    });
    expect(source.next()).toBeNull();
  });
});
