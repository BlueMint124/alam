import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetAppStore } from "../app/store/appStore";
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
  beforeEach(() => {
    resetAppStore();
    window.localStorage.clear();
  });

  it("renders Korean hero copy and resolved routes after searching", async () => {
    let resolveSearch: (routes: RouteOption[]) => void = () => undefined;
    const searchPromise = new Promise<RouteOption[]>((resolve) => {
      resolveSearch = resolve;
    });

    vi.mocked(searchTransitRoutes).mockImplementationOnce(() => searchPromise);

    render(<HomeScreen />);

    expect(screen.getByText("지금 어디서 내려야 할지 놓치지 마세요")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("출발지"), {
      target: { value: "명동역" },
    });
    fireEvent.change(screen.getByLabelText("도착지"), {
      target: { value: "서울역" },
    });
    fireEvent.click(screen.getByRole("button", { name: "길찾기" }));

    expect(screen.getByText("경로를 찾는 중이에요.")).toBeInTheDocument();

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

    const resultsRegion = await screen.findByRole("region", { name: "경로 추천" });
    expect(within(resultsRegion).getByText("Myeongdong Station to Seoul Station")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("경로를 찾는 중이에요.")).not.toBeInTheDocument();
    });
  });

  it("renders recent routes from local storage", () => {
    window.localStorage.setItem(
      "arrivehae.recentRoutes",
      JSON.stringify([
        {
          providerRouteId: "google-route-1",
          summary: "명동역에서 서울역",
          savedAt: "2026-04-19T10:00:00+09:00",
        },
      ]),
    );

    render(<HomeScreen />);

    expect(screen.getByText("최근 경로")).toBeInTheDocument();
    expect(screen.getByText("명동역에서 서울역")).toBeInTheDocument();
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

    fireEvent.change(screen.getByLabelText("출발지"), {
      target: { value: "명동역" },
    });
    fireEvent.change(screen.getByLabelText("도착지"), {
      target: { value: "서울역" },
    });
    fireEvent.click(screen.getByRole("button", { name: "길찾기" }));

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

    const resultsRegion = await screen.findByRole("region", { name: "경로 추천" });
    expect(within(resultsRegion).getByText("Myeongdong Station to Seoul Station")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "길찾기" }));
    expect(screen.getByText("경로를 찾는 중이에요.")).toBeInTheDocument();

    rejectSearch(new Error("Route search failed"));

    await waitFor(() => {
      expect(screen.queryByText("경로를 찾는 중이에요.")).not.toBeInTheDocument();
    });
    const updatedResultsRegion = screen.getByRole("region", { name: "경로 추천" });
    expect(within(updatedResultsRegion).queryByText("Myeongdong Station to Seoul Station")).not.toBeInTheDocument();
    expect(within(updatedResultsRegion).getByText("아직 추천된 경로가 없어요.")).toBeInTheDocument();
  });
});
