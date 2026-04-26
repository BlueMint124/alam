import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PresenterControlBar } from "./PresenterControlBar";

describe("PresenterControlBar", () => {
  it("shows the resume label when playback is paused", () => {
    render(
      <PresenterControlBar
        mode="paused"
        onPause={() => undefined}
        onResume={() => undefined}
        onStepForward={() => undefined}
        onRestart={() => undefined}
        onConfirmAlert={() => undefined}
        canConfirmAlert={false}
      />,
    );

    expect(screen.getByRole("button", { name: "resume" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "step" })).toBeInTheDocument();
  });
});
