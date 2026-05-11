import { expect, test } from "@playwright/test";

test("demo posture workflow", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /open demo workspace/i }).click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.getByRole("link", { name: "Setup" }).first().click();
  await expect(page.getByLabel("Organisation name")).toHaveValue("Northstar Medical Group");

  await page.getByRole("link", { name: "Assessment" }).first().click();
  await expect(page.getByText("Maturity score")).toBeVisible();

  await page.getByRole("link", { name: "Scan runs" }).first().click();
  await page.getByRole("button", { name: /run demo azure scan/i }).click();
  await expect(page.getByRole("heading", { name: "Findings" })).toBeVisible();

  await page.getByRole("link", { name: "Policies" }).first().click();
  await page.getByRole("link", { name: /open editor/i }).first().click();
  await expect(page.getByRole("heading", { name: "Access Control Policy" })).toBeVisible();

  await page.getByRole("link", { name: "Reports" }).first().click();
  await expect(page.getByText("Recommended 30-Day Action Plan")).toBeVisible();
});
