import { DatepickerPage } from './datepickerPage';
import { FormLayoutPage } from './formLayoutPage';
import { NavigationPage } from './navigationPage';
import { Page } from "@playwright/test";


export class PageManager{
  private readonly page: Page
  private readonly NavigationPage
  private readonly FormLayoutPage
  private readonly DatepickerPage

  constructor(page: Page){
    this.page = page
    this.NavigationPage = new NavigationPage(this.page)
    this.FormLayoutPage = new FormLayoutPage(this.page)
    this.DatepickerPage = new DatepickerPage(this.page)
  }

  navigateTo(){
    return this.NavigationPage
  }
  onFormLayoutPage(){
    return this.FormLayoutPage
  }
  onDatePickerPage(){
    return this.DatepickerPage
  }
}
