import { test, expect } from "@playwright/test";

test("demo scenario reaches transfer alert and final alert", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Load Demo Scenario" }).click();
  await expect(page.getByText("Transfer alert")).toBeVisible();
  await expect(page.getByText("Near-arrival alert")).toBeVisible();
});
