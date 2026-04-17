import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layout").click();
});

test("Locator syntax rules", async ({ page }) => {
  // by tag name
  page.locator("input");
  // by ID
  page.locator("#inputEmail1");
  //by class value
  page.locator(".shape-rectangle");
  //by attribute
  page.locator('[placeholder="Email"]');
  // by Class Value (FULL)
  page.locator(
    'class="input-full-width size-medium status-basic shape-rectangle nb-transition"',
  );
  //combine different selectors
  page.locator('input[placeholder="Email"][nbinput]');
  // by partial text
  page.locator(":text(Using)");
  //by exact text match
  page.locator(':text-is("Using the Grid")');
});

test("User facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();
  await page.getByLabel("Email").first().click();
  await page.getByPlaceholder("Jane Doe").click();
  await page.getByText("Using the Grid").click();
  await page.getByTestId("SignIn").click();
  await page.getByTitle("IoT Dashboard").click();
});
test("Locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();
  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();
  await page.locator("nb-card").nth(3).getByRole("button").click();
});
test("locating parenting elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();
  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .click();
  await page
    .locator("nb-card")
    .filter({ hasText: "Basic Form" })
    .getByRole("textbox", { name: "Email" })
    .click();
  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();
  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign in" })
    .getByRole("textbox", { name: "Email" })
    .click();
  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Dry principles", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic Form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });

  await emailField.fill("test@gmail.com");
  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button").click();
  await expect(emailField).toHaveValue("test@gmail.com");
});

test("Extracting values", async ({page}) => {

  const basicForm = page.locator("nb-card").filter({hasText: "Basic Form"})
  // Single text value
  const buttonText = await basicForm.locator("button").textContent()
  expect(buttonText).toEqual("Submit")

  //all text values
  const allRadioButtonsLabels = await page.locator("nb-radio").allTextContents()
  expect(allRadioButtonsLabels).toContain("Option 1")

  //input Value
  const emailField = basicForm.getByRole("textbox", {name: "Email"})
  await emailField.fill("test@test.com")
  const emailValue = await emailField.inputValue()
  expect(emailValue).toEqual("test@test.com")

  //text from Attribute
  const placeholderValue = await emailField.getAttribute("placeholder")
  expect(placeholderValue).toEqual("Email")
})

test("assertions", async ({page}) => {
  const basicFormButton = page.locator("nb-card").filter({hasText: "Basic Form"}).locator("button")

  //general assertions
  const value = String(5)
  expect(value).toEqual("5")
  const text = await basicFormButton.textContent()
  expect(text).toEqual("Submit")


  // Locator Assertion TIMEOUT 5sec better for api requests
  await expect(basicFormButton).toHaveText("Submit")
  //Soft Assertion Waits until the end to show error, other tests will run, after this.
  await expect.soft(basicFormButton).toHaveText("submit5")
  await basicFormButton.click()
})
