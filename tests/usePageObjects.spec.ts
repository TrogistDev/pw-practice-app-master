import test from "@playwright/test"
import { NavigationPage } from "../page-objects/navigationPage"
import { FormLayoutPage } from "../page-objects/formLayoutPage"
import { DatepickerPage } from "../page-objects/datepickerPage"
import { PageManager } from "../page-objects/pageManager"
import {faker} from '@faker-js/faker'

test.beforeEach(async ({page}) => {
    await page.goto('/')
})

test('Navigate to Form page', async ({page})=> {
  const pm = new PageManager(page)
   await pm.navigateTo().formLayoutPage()
   await pm.navigateTo().datePickerPage()
   await pm.navigateTo().smartTablePage()
   await pm.navigateTo().toastrPage()
   await pm.navigateTo().toolTipPage()
})

test('Parametrized methods', {tag: ['@smoke']}, async ({page}) => {
  const pm = new PageManager(page)
  const randomFullName = faker.person.fullName()
  const randomEmail =`${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

  await pm.navigateTo().formLayoutPage()
  await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME ?? '', 'Welcome1', 'Option 2')
  await page.screenshot({path: 'screeshots/onFormLayoutSubmitingUsingTheGridForm.png'})
  const buffer = await page.screenshot()
  console.log(buffer.toString('base64'))
  await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
  await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inlineForm.png'})
})

test('Date Picker @many', async ({page}) => {
  const pm = new PageManager(page)
  await pm.navigateTo().datePickerPage()
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(7)
  await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(2, 5)
})

test.only('Test using argos CI', async ({page})=> {
  const pm = new PageManager(page)
   await pm.navigateTo().formLayoutPage()
   await pm.navigateTo().datePickerPage()
})
