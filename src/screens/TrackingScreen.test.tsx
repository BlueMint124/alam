import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { resetAppStore, setAlertQueue, setTrackingView } from "../app/store/appStore";
import { TrackingScreen } from "./TrackingScreen";

describe("TrackingScreen", () => {
  beforeEach(() => {
    resetAppStore();
  });

  it("shows Korean tracking metrics and dismisses the active alert overlay", () => {
    setTrackingView({
      remainingStops: 2,
      nextStopName: "서울역",
      simulationPaused: false,
    });
    setAlertQueue([
      {
        isOpen: true,
        title: "곧 내릴 시간이에요",
        description: "서울역까지 2정거장 남았어요",
        routeLabel: "4호선 오이도행",
        etaLabel: "2분 후",
      },
    ]);

    render(<TrackingScreen />);

    expect(screen.getByText("2정거장 남았어요")).toBeInTheDocument();
    expect(screen.getByText("다음 하차: 서울역")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "시뮬레이션 일시정지" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "곧 내릴 시간이에요" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(screen.queryByRole("dialog", { name: "곧 내릴 시간이에요" })).not.toBeInTheDocument();
  });
});
