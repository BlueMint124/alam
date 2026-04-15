import React from "react";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { appRoutes } from "./router";

describe("router bootstrap", () => {
  it("renders the app shell on the root route", async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "ArriveHae" })).toBeInTheDocument();
  });
});