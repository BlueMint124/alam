import React from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App shell", () => {
  it("renders the shared shell around nested routes", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <App />,
          children: [
            {
              index: true,
              element: <p>Home content</p>,
            },
            {
              path: "tracking",
              element: <p>Tracking content</p>,
            },
          ],
        },
      ],
      {
        initialEntries: ["/tracking"],
      },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
    expect(await screen.findByText("Tracking content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "알림" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "홈" })).not.toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "설정" })).not.toHaveAttribute("aria-current", "page");
  });
});