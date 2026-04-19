import { test, expect } from "@playwright/test";

test("demo scenario shows the Korean transfer and final alert flow", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "데모 시나리오 불러오기" }).click();
  await expect(page.getByRole("dialog", { name: "곧 환승할 시간이에요" })).toBeVisible();
  await page.getByRole("button", { name: "확인" }).click();
  await expect(page.getByRole("dialog", { name: "곧 내릴 시간이에요" })).toBeVisible();
});
