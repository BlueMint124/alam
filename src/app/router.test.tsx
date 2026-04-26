import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { appRoutes } from "./router";

describe("router bootstrap", () => {
  it("renders the home screen inside the shared shell on the root route", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "지금 어디서 내려야 할지 놓치지 마세요" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "홈" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("heading", { name: "알림 설정" })).not.toBeInTheDocument();
  });

  it("renders nested routes inside the shared shell", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/tracking"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
    expect(screen.getByTestId("tracking-screen")).toHaveAttribute(
      "data-playback-mode",
      "idle",
    );
    expect(screen.getByTestId("remaining-stops")).toHaveTextContent("3");
    expect(screen.getByRole("link", { name: "알림" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "설정" })).not.toHaveAttribute("aria-current", "page");
  });

  it("renders the settings route inside the shared shell", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "알림 설정" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "설정" })).toHaveAttribute("aria-current", "page");
  });
});
