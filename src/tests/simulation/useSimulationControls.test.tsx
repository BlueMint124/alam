import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SimulationScenario } from "../../features/simulation/SimulationLocationSource";
import { useSimulationControls } from "../../features/simulation/useSimulationControls";

function createScenario(
  id: string,
  name: string,
  stopIndex: number,
): SimulationScenario {
  return {
    id,
    name,
    events: [
      {
        stopIndex,
        segmentId: id,
        timestamp: `2026-04-15T08:0${stopIndex}:00+09:00`,
      },
    ],
  };
}

type ObserverState = {
  scenarioName: string;
  currentEventIndex: number;
  totalEvents: number;
  isComplete: boolean;
  lastEventStopIndex: number | null;
};

type ObserverHarnessProps = {
  scenario: SimulationScenario;
  observedStates: ObserverState[];
};

function ObserverHarness({
  scenario,
  observedStates,
}: ObserverHarnessProps) {
  const controls = useSimulationControls(scenario);

  observedStates.push({
    scenarioName: controls.scenario.name,
    currentEventIndex: controls.currentEventIndex,
    totalEvents: controls.totalEvents,
    isComplete: controls.isComplete,
    lastEventStopIndex: controls.lastEvent?.stopIndex ?? null,
  });

  return (
    <div>
      <p>{controls.scenario.name}</p>
      <p>Replay progress: {controls.currentEventIndex}</p>
      <button type="button" onClick={controls.nextEvent}>
        Next
      </button>
    </div>
  );
}

describe("useSimulationControls", () => {
  it("resets immediately to a consistent state when the scenario changes", () => {
    const firstScenario = createScenario("line-4", "Line 4", 1);
    const secondScenario = createScenario("arex", "AREX", 2);
    const observedStates: ObserverState[] = [];

    const { rerender } = render(
      <ObserverHarness
        scenario={firstScenario}
        observedStates={observedStates}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Replay progress: 1")).toBeInTheDocument();

    rerender(
      <ObserverHarness
        scenario={secondScenario}
        observedStates={observedStates}
      />,
    );

    expect(screen.getByText("AREX")).toBeInTheDocument();
    expect(screen.getByText("Replay progress: 0")).toBeInTheDocument();
    expect(
      observedStates.filter((state) => state.scenarioName === "AREX"),
    ).toEqual([
      {
        scenarioName: "AREX",
        currentEventIndex: 0,
        totalEvents: 1,
        isComplete: false,
        lastEventStopIndex: null,
      },
    ]);
  });
});
