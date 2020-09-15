# Typescript Cucumber
### Features
* All scripts written with > Typescript2.0 & Cucumber2.0.
* Neat folder structures with transpiled js files in separate output folder.
* Page Object design pattern implementation.
* Extensive hooks implemented for BeforeFeature, AfterScenarios etc.


### To Get Started

#### Pre-requisites
1.NodeJS installed globally in the system.
https://nodejs.org/en/download/

2.Chrome or Firefox browsers installed.

#### Setup

Run below commands to download required modules.

```
npm install
npm install --global typescript@latest
npm install protractor@latest --save-dev
npm install -g tsc
```
* All the dependencies from package.json and ambient typings would be installed in node_modules folder.

```
npm run webdriver-update
```

* The below command would create an output folder named 'out' and transpile the .ts files to .js.
```
npm run build
```

* If your machine's chrome browser version is not latest one then kindly execute given command

```
npm run updatechrome
```


* Now just run the test command which launches the Chrome Browser and runs the scripts.
```
npm test
```

#### Writing Features inside Scenario
```
Feature: To search typescript in google
@TypeScriptScenario

  Scenario: Typescript Google Search
    Given I am on google page
    When I type "Typescript"
    Then I click on search button
    Then I clear the search text
```
#### Writing Step Definitions

```
import { browser } from "protractor";
import { SearchPageObject } from "../pages/searchPage";
const { Given } = require("cucumber");
const chai = require("chai").use(require("chai-as-promised"));
const expect = chai.expect;

const search: SearchPageObject = new SearchPageObject();

Given(/^I am on google page$/, async () => {
    await expect(browser.getTitle()).to.eventually.equal("Google");
});
```

#### Writing Page Objects
```
import { $ } from "protractor";

export class SearchPageObject {
    public searchTextBox: any;
    public searchButton: any;

    constructor() {
        this.searchTextBox = $("#lst-ib");
        this.searchButton = $("input[value='Google Search']");
    }
}
```
#### Cucumber Hooks
Following method takes screenshot on failure of each scenario
```
After(async function(scenario) {
    if (scenario.result.status === Status.FAILED) {
        // screenShot is a base-64 encoded PNG
         const screenShot = await browser.takeScreenshot();
         this.attach(screenShot, "image/png");
    }
});
```
#### CucumberOpts Tags
Following configuration shows to call specific tags from feature files
```
cucumberOpts: {
    compiler: "ts:ts-node/register",
    format: "json:./reports/json/cucumber_report.json",
    require: ["../../stepdefinitions/*.ts", "../../support/*.ts"],
    strict: true,
    tags: "@TypeScriptScenario or @CucumberScenario or @ProtractorScenario",
},
```
#### HTML Reports
```
report  generated in the `test-result` folder when you run `npm test`.
```


#### Upload Reports
To upload reports to QTM or QTM4J run below command
`npm run uploadresults`
