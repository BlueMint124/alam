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

  return <DebugPanel controls={controls} />;
}

describe("DebugPanel", () => {
  it("disables the next button once the replay is complete", () => {
    render(<DebugPanelHarness />);

    const nextButton = screen.getByRole("button", { name: "Next event" });

    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);

    expect(screen.getByText("Status: complete")).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });
});
