import test, { expect } from "@playwright/test";

test.beforeEach("Auto Waiting tests", async ({page}, testInfo) => {
  await page.goto(process.env.URL ?? '')
  //environment variables can be passed as a script in package.json like this: "urltestENV": "URL=http://localhost:4200 npm run test"
  await page.getByRole("button").filter({hasText: "Button Triggering"}).click()
  testInfo.setTimeout(testInfo.timeout + 20000)
})

test("auto waiting", async ({page}) => {
  const successButton = page.locator('.bg-success')
  await successButton.click()
  // const text = await successButton.textContent()
   // const text = await successButton.allTextContents()
  // await successButton.waitFor({state: "attached"})
  // expect(text).toContain("Data loaded with AJAX get request.")

  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {timeout: 20000})

})

test.skip("alternative waits", async ({page}) => {

  const successButton = page.locator(".bg-success")

  // wait for element
  //await page.waitForSelector(".bg-success")

  // wait for particular response
  //await page.waitForResponse("http://uitestingplayground.com/ajaxdata")

  //wait network calls to be completed NOT RECOMMENDED
  await page.waitForLoadState("networkidle")

  const text = await successButton.allTextContents()
  expect(text).toContain("Data loaded with AJAX get request.")
})


test.skip("timeouts", async ({page}) => {
  //test.setTimeout(10000)
  //test.slow()
  const successButton = page.locator(".bg-success")
  await successButton.click({timeout: 16000})
})
