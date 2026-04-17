import {test as base} from "@playwright/test"
import { PageManager } from "./page-objects/pageManager"

export type TestOptions = {
  globalsQaURL: string
  formLayoutsPage: string
  pageManager: PageManager
}

export const test = base.extend<TestOptions>({
  globalsQaURL: ['', {option: true}],

  //if you use [] on this function, and add ", {auto: true}" it will be automatically used in all tests, without the need to add it as a parameter in the test function
  formLayoutsPage: async ({page}, use) => {
      await page.goto('/')
      await page.getByText('Forms').click()
      await page.getByText('Form Layouts').click()
      await use('')
  },
  //if using a property as parameter you create a dependency
  pageManager: async ({page, formLayoutsPage}, use) => {
      const pm = new PageManager(page)
      await use(pm)
  }
})
