import {test} from "../test-options"
import {faker} from '@faker-js/faker'

test.beforeEach(async ({page}) => {
    await page.goto('/')
})



test('Parametrized methods', async ({pageManager}) => {
  const randomFullName = faker.person.fullName()
  const randomEmail =`${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

  await pageManager.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME ?? '', 'Welcome1', 'Option 2')
  await pageManager.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)

})
