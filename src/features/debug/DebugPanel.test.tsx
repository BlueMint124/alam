import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SimulationScenario } from "../simulation/SimulationLocationSource";
import { useSimulationControls } from "../simulation/useSimulationControls";
import { DebugPanel } from "./DebugPanel";

const scenario: SimulationScenario = {
  id: "single-stop",
  name: "Single stop demo",
  events: [
    {
      stopIndex: 1,
      segmentId: "single-stop",
      timestamp: "2026-04-15T08:01:00+09:00",
    },
  ],
};

function DebugPanelHarness() {
  const controls = useSimulationControls(scenario);

  return (
    <div>
      <button type="button" onClick={controls.nextEvent}>
        advance
      </button>
      <DebugPanel controls={controls} />
    </div>
  );
}

describe("DebugPanel", () => {
  it("shows the compact live-activity summary as playback advances", () => {
    render(<DebugPanelHarness />);

    expect(screen.getByTestId("live-activity")).toBeInTheDocument();
    expect(screen.getByText("state: running")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "advance" }));

    expect(screen.getByText("step: 1 / 1")).toBeInTheDocument();
    expect(screen.getByText("state: complete")).toBeInTheDocument();
  });
});
