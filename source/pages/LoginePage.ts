import { ElementFinder, element } from "protractor";
import { LocatorUtils } from "../base/LocatorUtils";
let locatorUtil = new LocatorUtils();

export class LoginPage {
  public username: ElementFinder;
  public password: ElementFinder;
  public loginbutton: ElementFinder;

  constructor() {
    this.username = element(locatorUtil.getLocator("username.input").locator);
    this.password = element(locatorUtil.getLocator("password.input").locator);
    this.loginbutton = element(locatorUtil.getLocator("login.form").locator);
  }
}
