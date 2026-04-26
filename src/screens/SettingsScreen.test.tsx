import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAppStoreState, resetAppStore } from "../app/store/appStore";
import { SettingsScreen } from "./SettingsScreen";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("SettingsScreen", () => {
  beforeEach(() => {
    resetAppStore();
    navigateMock.mockReset();
  });

  it("renders Korean settings controls and starts the prepared demo from settings", () => {
    render(
      <MemoryRouter>
        <SettingsScreen />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "알림 설정" })).toBeInTheDocument();
    expect(screen.getByLabelText("버스 알림 시점")).toBeInTheDocument();
    expect(screen.getByLabelText("지하철 알림 시점")).toBeInTheDocument();
    expect(screen.getByLabelText("환승 전 알림 사용")).toBeChecked();
    expect(screen.getByRole("button", { name: "데모 시나리오 불러오기" })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("demo-start"));

    expect(navigateMock).toHaveBeenCalledWith("/tracking");
    expect(getAppStoreState().demoPlayback.mode).toBe("auto_playing");
    expect(getAppStoreState().demoPlayback.totalEvents).toBe(4);
    expect(getAppStoreState().trackingView.remainingStops).toBe(4);
  });
});
