import { browser, Config } from "protractor";
import { ConfigurationManager } from "../source/base/ConfigurationManager";
import { Reporter } from "../support/reporter";
// import {setDefaultTimeout} from 'cucumber';

const jsonReports = process.cwd() + "/test-results/";
const yargs = require("yargs").argv;
const argv = yargs;
let isDIrectConnectSupported = true;
this.properties = ConfigurationManager.getBundle();
const platformProperty = this.properties.get("platform");
let browserProperty = this.properties.get("driver.name");
if (browserProperty.indexOf("Remote") > 0) {
  isDIrectConnectSupported = false;
}
let browserName = browserProperty
  .replace(new RegExp("Remote"), "")
  .replace(new RegExp("Driver"), "");

let caps = this.properties.get(
  browserName.toLowerCase() + ".additional.capabilities"
);
let driverCaps = {};
try {
  if (caps !== null && caps !== undefined) {
    driverCaps = JSON.parse(caps);
  }
} catch (error) {
  console.log(
    caps +
    " defined at " +
    browserName.toLowerCase() +
    "additional.capabilities" +
    " is not a valid json"
  );
}
driverCaps["browserName"] = browserName;

// END
export const config: Config = {
  directConnect: isDIrectConnectSupported,
  seleniumAddress: "http://127.0.0.1:4444/wd/hub",

  SELENIUM_PROMISE_MANAGER: false,

  baseUrl: "https://www.google.com",

  capabilities: driverCaps,

  framework: "custom",
  allScriptsTimeout: 60000,
  frameworkPath: require.resolve("protractor-cucumber-framework"),

  specs: getFeatureFiles(),

  onPrepare: () => {
    browser.ignoreSynchronization = true;
    browser.waitForAngularEnabled(false);
    // setDefaultTimeout(60 *10);
    browser
      .manage()
      .timeouts()
      .implicitlyWait(30 * 1000);
    // browser.allScriptsTimeout = 60 * 1000;
    // browser.manage().timeouts().pageLoadTimeout(10000);  // 10 seconds
    Reporter.createDirectory(jsonReports);
  },

  cucumberOpts: {
    compiler: "ts:ts-node/register",
    format:
      "json:./test-results/" +
      Reporter.getTimeStamp() +
      "/json/cucumber_report.json",
    require: [
      "../../out/stepdefinitions/" + platformProperty + "/*.js",
      "../../out/stepdefinitions/*.js",
      "../../out/support/*.js"
    ],
    strict: true

  },

  onComplete: () => {
    Reporter.createHTMLReport();
    Reporter.createJSONReport();
  }
};

function getFeatureFiles() {
  if (argv.feature) {
    return argv.feature
      .split(",")
      .map(feature => `${process.cwd()}` + `${feature}`);
  }

  return [
    `${process.cwd()}/scenarios/` + platformProperty + `/**/*.feature`
  ];
}
