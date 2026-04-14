import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App shell", () => {
  it("renders the ArriveHae title", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
  });
});
