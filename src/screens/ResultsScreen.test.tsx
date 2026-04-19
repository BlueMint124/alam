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

  it("shows Korean recommendation cards and detail actions for a selected route", () => {
    render(<ResultsScreen routes={routes} />);

    expect(screen.getByRole("heading", { name: "경로 추천" })).toBeInTheDocument();
    expect(screen.getByText("추천 경로")).toBeInTheDocument();
    expect(screen.getByText("상세를 보려면 경로를 선택하세요.")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "이 경로 자세히 보기" })[0]);

    expect(screen.getByText("Subway Line 4 toward Danggogae")).toBeInTheDocument();
    expect(screen.getByText("4개 역 이동")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "선택된 경로" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "즐겨찾기 저장" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "탑승 시작" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "탑승 시작" }));

    expect(screen.getByText("이 경로로 탑승을 시작했어요.")).toBeInTheDocument();
  });
});
