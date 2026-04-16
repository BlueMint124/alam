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
    expect(screen.getByRole("heading", { name: "Find your next route" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "홈" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("heading", { name: "Settings" })).not.toBeInTheDocument();
  });

  it("renders nested routes inside the shared shell", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/tracking"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /stops left/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "알림" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "설정" })).not.toHaveAttribute("aria-current", "page");
  });

  it("renders the settings route inside the shared shell", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/settings"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "설정" })).toHaveAttribute("aria-current", "page");
  });
});
