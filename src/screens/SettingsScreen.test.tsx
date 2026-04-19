import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { getAppStoreState, resetAppStore } from "../app/store/appStore";
import { SettingsScreen } from "./SettingsScreen";

describe("SettingsScreen", () => {
  beforeEach(() => {
    resetAppStore();
  });

  it("renders Korean settings controls and loads the demo alert queue", () => {
    render(<SettingsScreen />);

    expect(screen.getByRole("heading", { name: "알림 설정" })).toBeInTheDocument();
    expect(screen.getByLabelText("버스 알림 시점")).toBeInTheDocument();
    expect(screen.getByLabelText("지하철 알림 시점")).toBeInTheDocument();
    expect(screen.getByLabelText("환승 전 알림 사용")).toBeChecked();
    expect(screen.getByRole("button", { name: "데모 시나리오 불러오기" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "데모 시나리오 불러오기" }));

    expect(screen.getByRole("dialog", { name: "곧 환승할 시간이에요" })).toBeInTheDocument();
    expect(getAppStoreState().alertQueue).toHaveLength(2);
    expect(getAppStoreState().alertOverlay.title).toBe("곧 환승할 시간이에요");
  });
});
