import { expect } from "@playwright/test";
import {test} from '../test-options'

test.describe.configure({mode : 'parallel'}) // runs tests in spec files in parallel

test.beforeEach('test',async ({ page }) => {
  await page.goto("/");
});


test.describe.only("form layout page", () => {
  // test.describe.configure({retries: 2})
  // test.describe.configure({mode: 'serial'}) // add if you need sequential tests to be skipped if one fail
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });

  test("input fields", async ({ page }, testinfo) => {
    if(testinfo.retry){
      //do something if the test is retried
    }
    const usingGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });

    await usingGridEmailInput.fill("test@test.com");
    await usingGridEmailInput.clear();
    await usingGridEmailInput.pressSequentially("test@test.com");
    //generic assertion
    const inputValue = await usingGridEmailInput.inputValue();
    expect(inputValue).toEqual("test@test.com");

    //locator assertion
    await expect(usingGridEmailInput).toHaveValue("test@test.com");
  });

  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the Grid",
    });
    //if element is visually hidden use .check({force: true})
    // await usingTheGridForm.getByLabel("Option 1").check({force: true})
    await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .check({ force: true });
    const radioStatus = await usingTheGridForm
      .getByRole("radio", { name: "Option 1" })
      .isChecked();
    expect(radioStatus).toBeTruthy();
    await expect(
      usingTheGridForm.getByRole("radio", { name: "Option 1" }),
    ).toBeChecked();
    await usingTheGridForm
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 1" })
        .isChecked(),
    ).toBeFalsy();
    expect(
      await usingTheGridForm
        .getByRole("radio", { name: "Option 2" })
        .isChecked(),
    ).toBeTruthy();
  });
});



test("Checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();
  // if checkbox is unchecked it will remain unchecked
  await page
    .getByRole("checkbox", { name: "Hide on click" })
    .uncheck({ force: true });
  await page
    .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
    .check({ force: true });

  const allBoxes = page.getByRole("checkbox");

  for (const box of await allBoxes.all()) {
    await box.uncheck({ force: true });
    expect(await box.isChecked()).toBeFalsy();
  }
});

test("lists and dropdowns", async ({ page }) => {
  const dropDownMenu = page.locator("ngx-header nb-select");
  await dropDownMenu.click();

  page.getByRole("list"); // When list has an UL tag
  page.getByRole("listitem"); //

  // const optionList = page.getByRole("list").locator("nb-option")
  const optionList = page.locator("nb-option-list nb-option");
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  await optionList.filter({ hasText: "Cosmic" }).click();
  const header = page.locator("nb-layout-header");
  // await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)")

  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  await dropDownMenu.click();
  for (const color of Object.keys(colors) as (keyof typeof colors)[]) {
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
    if (color !== "Corporate") await dropDownMenu.click();
  }
});

test("tooltip", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await toolTipCard.getByRole("button", { name: "Top" }).hover();

  page.getByRole("tooltip"); // if you have a role tooltip created
  // General Assertions  TEXT CONTENT TRANSFORMA EM STRING (LOCATOR ASSERTIONS NÃO FUNCIONAM EM STRINGS, APENAS EM LOCATOR )
  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
  expect(tooltip);
  //locator Assertions
  const tooltip1 = page.locator("nb-tooltip");
  await expect(tooltip1).toHaveText("This is a tooltip");
});

test("dialog box", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });
  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();
  await expect(page.locator("table tr").first()).not.toHaveText(
    "mdo@gmail.com",
  );
});

test("web tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  // 1 get the row by any test in this row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("35");
  await page.locator(".nb-checkmark").click();

  // 2 get the row based on the value in the specific column
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowById.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").clear();
  await page
    .locator("input-editor")
    .getByPlaceholder("E-mail")
    .pressSequentially("test@test.com");
  await page.locator(".nb-checkmark").click();
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");

  // 3 test filter of the table

  const ages = ["20", "30", "40", "200"];

  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    await page.waitForTimeout(500);
    const ageRows = page.locator("tbody tr");

    for (let row of await ageRows.all()) {
      const cellValue = await row.locator("td").last().textContent();

      if (age === "200") {
        expect(await page.locator("table td").textContent()).toContain(
          "No data found",
        );
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});

test("datepicker", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calendarInputField = page.getByPlaceholder("Form Picker");
  await calendarInputField.click();

  let date = new Date();
  date.setDate(date.getDate() + 100);
  const expectedDate = date.getDate().toString();
  const expectedMonthShot = date.toLocaleString("En-US", { month: "short" });
  const expectedMonthLong = date.toLocaleString("En-US", { month: "long" });
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`;

  let calendarMonthAndYear = await page
    .locator("nb-calendar-view-mode")
    .textContent();
  const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;
  while (!calendarMonthAndYear?.includes(expectedMonthAndYear)) {
    await page
      .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
      .click();
    calendarMonthAndYear = await page
      .locator("nb-calendar-view-mode")
      .textContent();
  }

  // .getByText() does only partial assertions,
  // in order to find exact text you need to pass parameter {exact: true}
  await page
    .locator('[class="day-cell ng-star-inserted"]')
    .getByText(expectedDate, { exact: true })
    .click();
  await expect(calendarInputField).toHaveValue(dateToAssert);
});
test("sliders", async ({ page }) => {
  //update attribute
  const tempGauge = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger circle',
  );
  await tempGauge.evaluate((node) => {
    node.setAttribute("cx", "232.630");
    node.setAttribute("cy", "232.630");
  });
  await tempGauge.click();

  // Mouse movement
  const tempBox = page.locator(
    '[tabtitle="Temperature"] ngx-temperature-dragger',
  );
  await tempBox.scrollIntoViewIfNeeded();

  const box = await tempBox.boundingBox();
  if (box !== null) {
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x+ 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText("30")
  }
});

test('drag and drop', async ({page, globalsQaURL}) => {
  await page.goto(globalsQaURL)
  await page.locator('[class="fc-dialog-container"] [class="fc-footer-buttons-container"] [class="fc-button fc-cta-consent fc-primary-button"]').click()
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
  await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

  //more precise control
  await frame.locator('li', {hasText: "High Tatras 4"}).hover()
  await page.mouse.down()
  await frame.locator('#trash').hover()
  await page.mouse.up()

  await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})

//you can change the order by adding "001-" in the beginning
// you can make two tests run in parallel in a spec file by adding .parallel to the test.describe block test.describe.parallel()
