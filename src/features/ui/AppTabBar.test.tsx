import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppTabBar } from "./AppTabBar";

describe("AppTabBar", () => {
  it("renders Korean tabs and marks the active route", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <AppTabBar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "홈" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "알림" })).toHaveAttribute("href", "/tracking");
    expect(screen.getByRole("link", { name: "설정" })).toHaveAttribute("href", "/settings");
    expect(screen.getByRole("link", { name: "설정" })).toHaveAttribute("aria-current", "page");
  });
});
