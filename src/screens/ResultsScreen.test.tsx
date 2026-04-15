import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { resetAppStore } from "../app/store/appStore";
import type { RouteOption } from "../features/routes/types";
import { ResultsScreen } from "./ResultsScreen";

const routes: RouteOption[] = [
  {
    provider: "google",
    providerRouteId: "google-route-1",
    summary: "Myeongdong Station to Seoul Station",
    durationMinutes: 18,
    departureTime: "2026-04-15T07:30:00+09:00",
    arrivalTime: "2026-04-15T07:48:00+09:00",
    segments: [
      {
        id: "segment-1",
        kind: "walk",
        instruction: "Walk to Myeongdong Station Exit 6",
      },
      {
        id: "segment-2",
        kind: "transit",
        instruction: "Subway Line 4 toward Danggogae",
        lineName: "Line 4",
        vehicleType: "subway",
        stopCount: 4,
      },
    ],
  },
  {
    provider: "google",
    providerRouteId: "google-route-2",
    summary: "Myeongdong Station to Seoul Station via City Hall",
    durationMinutes: 24,
    departureTime: "2026-04-15T07:35:00+09:00",
    arrivalTime: "2026-04-15T07:59:00+09:00",
    segments: [
      {
        id: "segment-3",
        kind: "transit",
        instruction: "Subway Line 2 toward City Hall",
        lineName: "Line 2",
        vehicleType: "subway",
        stopCount: 6,
      },
    ],
  },
];

describe("ResultsScreen", () => {
  beforeEach(() => {
    resetAppStore();
  });

  it("lets a user select a route and start boarding from the detail card", () => {
    render(<ResultsScreen routes={routes} />);

    expect(screen.getByText("Select a route to view details.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "View details for Myeongdong Station to Seoul Station" }));

    expect(screen.getByText("Subway Line 4 toward Danggogae")).toBeInTheDocument();
    expect(screen.getByText("4 stops")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Boarding Start" }));

    expect(screen.getByText("Boarding started for this route.")).toBeInTheDocument();
  });
});
