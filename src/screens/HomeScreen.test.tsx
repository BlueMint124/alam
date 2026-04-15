import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { RouteOption } from "../features/routes/types";

vi.mock("../features/routes/api/searchTransitRoutes", () => ({
  searchTransitRoutes: vi.fn(),
}));

import { searchTransitRoutes } from "../features/routes/api/searchTransitRoutes";
import { HomeScreen } from "./HomeScreen";

const demoSegments: RouteOption["segments"] = [
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
];

describe("HomeScreen", () => {
  it("renders resolved routes after searching", async () => {
    let resolveSearch: (routes: RouteOption[]) => void = () => undefined;
    const searchPromise = new Promise<RouteOption[]>((resolve) => {
      resolveSearch = resolve;
    });

    vi.mocked(searchTransitRoutes).mockImplementationOnce(() => searchPromise);

    render(<HomeScreen />);

    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "Myeongdong Station" },
    });
    fireEvent.change(screen.getByLabelText("To"), {
      target: { value: "Seoul Station" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Find Routes" }));

    expect(screen.getByText("Searching routes...")).toBeInTheDocument();

    resolveSearch([
      {
        provider: "google",
        providerRouteId: "google-route-1",
        summary: "Myeongdong Station to Seoul Station",
        durationMinutes: 18,
        departureTime: "2026-04-15T07:30:00+09:00",
        arrivalTime: "2026-04-15T07:48:00+09:00",
        segments: demoSegments,
      } satisfies RouteOption,
    ]);

    expect(await screen.findByText("Myeongdong Station to Seoul Station")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Searching routes...")).not.toBeInTheDocument();
    });
  });

  it("clears stale routes when a later search fails", async () => {
    let resolveSearch: (routes: RouteOption[]) => void = () => undefined;
    let rejectSearch: (error: Error) => void = () => undefined;

    const firstSearch = new Promise<RouteOption[]>((resolve) => {
      resolveSearch = resolve;
    });
    const secondSearch = new Promise<RouteOption[]>((_resolve, reject) => {
      rejectSearch = reject;
    });

    vi.mocked(searchTransitRoutes)
      .mockImplementationOnce(() => firstSearch)
      .mockImplementationOnce(() => secondSearch);

    render(<HomeScreen />);

    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "Myeongdong Station" },
    });
    fireEvent.change(screen.getByLabelText("To"), {
      target: { value: "Seoul Station" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Find Routes" }));

    resolveSearch([
      {
        provider: "google",
        providerRouteId: "google-route-1",
        summary: "Myeongdong Station to Seoul Station",
        durationMinutes: 18,
        departureTime: "2026-04-15T07:30:00+09:00",
        arrivalTime: "2026-04-15T07:48:00+09:00",
        segments: demoSegments,
      } satisfies RouteOption,
    ]);

    expect(await screen.findByText("Myeongdong Station to Seoul Station")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Find Routes" }));
    expect(screen.getByText("Searching routes...")).toBeInTheDocument();

    rejectSearch(new Error("Route search failed"));

    await waitFor(() => {
      expect(screen.queryByText("Searching routes...")).not.toBeInTheDocument();
    });
    expect(screen.queryByText("Myeongdong Station to Seoul Station")).not.toBeInTheDocument();
    expect(screen.getByText("No routes yet.")).toBeInTheDocument();
  });
});
