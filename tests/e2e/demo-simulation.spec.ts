import { expect, test } from "@playwright/test";

test("semi-automatic demo flows from settings into tracking, transfer alert, and final alert", async ({
  page,
}) => {
  await page.goto("/settings");
  await page.getByTestId("demo-start").click();

  await expect(page).toHaveURL(/\/tracking$/);
  await expect(page.getByTestId("tracking-screen")).toHaveAttribute(
    "data-playback-mode",
    "auto_playing",
  );
  await expect(page.getByTestId("alert-modal")).toHaveAttribute("data-state", "active");
  await page.getByRole("button", { name: "확인" }).click();
  await expect(page.getByRole("dialog", { name: "곧 내릴 시간이에요" })).toBeVisible();
});
