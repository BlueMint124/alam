import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RouteOption } from "../types";
import { RouteDetailCard } from "./RouteDetailCard";

const route: RouteOption = {
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
};

describe("RouteDetailCard", () => {
  it("renders Korean transit labels and actions", () => {
    render(<RouteDetailCard route={route} onBoardingStart={() => undefined} />);

    expect(screen.getByText("Subway Line 4 toward Danggogae")).toBeInTheDocument();
    expect(screen.getByText("4개 역 이동")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "즐겨찾기 저장" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "탑승 시작" })).toBeInTheDocument();
  });

  it("shows Korean confirmation messages for favorite save and boarding state", () => {
    render(<RouteDetailCard route={route} onBoardingStart={() => undefined} boardingStarted />);

    fireEvent.click(screen.getByRole("button", { name: "즐겨찾기 저장" }));

    expect(screen.getByText("즐겨찾기에 저장했어요.")).toBeInTheDocument();
    expect(screen.getByText("이 경로로 탑승을 시작했어요.")).toBeInTheDocument();
  });
});
