import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AlertOverlayState } from "../../../app/store/appStore";
import { ArrivalAlertModal } from "./ArrivalAlertModal";

const openOverlay: AlertOverlayState = {
  isOpen: true,
  title: "곧 환승할 시간이에요",
  description: "환승까지 2정거장 남았어요",
  routeLabel: "4호선 오이도행",
  etaLabel: "곧 도착",
};

describe("ArrivalAlertModal", () => {
  it("renders the Korean alert copy and confirm action", () => {
    const handleConfirm = vi.fn();

    render(<ArrivalAlertModal overlay={openOverlay} onConfirm={handleConfirm} />);

    expect(screen.getByRole("dialog", { name: "곧 환승할 시간이에요" })).toBeInTheDocument();
    expect(screen.getByText("환승까지 2정거장 남았어요")).toBeInTheDocument();
    expect(screen.getByText("4호선 오이도행")).toBeInTheDocument();
    expect(screen.getByText("곧 도착")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("returns nothing when the overlay is closed", () => {
    render(
      <ArrivalAlertModal
        overlay={{
          ...openOverlay,
          isOpen: false,
        }}
        onConfirm={() => undefined}
      />,
    );

    expect(screen.queryByRole("dialog", { name: "곧 환승할 시간이에요" })).not.toBeInTheDocument();
  });
});
