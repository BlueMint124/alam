import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeScreen } from "./HomeScreen";

describe("HomeScreen", () => {
  it("shows the route search form and searching state", () => {
    render(<HomeScreen />);

    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "Myeongdong Station" },
    });
    fireEvent.change(screen.getByLabelText("To"), {
      target: { value: "Seoul Station" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Find Routes" }));

    expect(screen.getByText("Searching routes...")).toBeInTheDocument();
  });
});
