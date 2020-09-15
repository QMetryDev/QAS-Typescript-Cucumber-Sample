import { LoginPage } from "../../source/pages/LoginePage";
const { Given } = require("cucumber");
const chai = require("chai").use(require("chai-as-promised"));
const expect = chai.expect;


Given(/^login with "(.*?)" and "(.*?)"$/, async (username, password) => {
  const loginPage: LoginPage = new LoginPage();
  //mobile web specific login method implementation
  await loginPage.username.sendKeys(username);
  await loginPage.password.sendKeys(password);
  await loginPage.loginbutton.submit();
});
