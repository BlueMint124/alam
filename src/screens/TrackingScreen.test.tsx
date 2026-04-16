import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { resetAppStore } from "../app/store/appStore";
import { TrackingScreen } from "./TrackingScreen";

describe("TrackingScreen", () => {
  beforeEach(() => {
    resetAppStore();
  });

  it("shows remaining stops and next stop", () => {
    render(<TrackingScreen />);

    expect(screen.getByText(/stops left/i)).toBeInTheDocument();
    expect(screen.getByText(/next stop:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pause simulation/i })).toBeInTheDocument();
  });
});
