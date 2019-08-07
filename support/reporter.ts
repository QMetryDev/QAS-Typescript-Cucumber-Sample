import { Status } from "cucumber";
import * as reporter from "cucumber-html-reporter";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as mkdirp from "mkdirp";
import * as path from "path";
import { Global } from "./global";
import { JsonMetaInfo } from "./metainfo/JsonMetaInfo";
import { MetaInfo } from "./metainfo/MetaInfo";
import { ScenarioMetaData } from "./metainfo/ScenarioMetadata";
import { ScenarioMetaInfo } from "./metainfo/ScenarioMetaInfo";
import { BrowserActualCapabilities } from "./overview/BrowserActualCapabilities";
import { BrowserDesiredCapabilities } from "./overview/BrowserDesiredCapabilities";
import { EnvInfo } from "./overview/EnvInfo";
import { ExecutionEnvInfo } from "./overview/ExecutionEnvInfo";
import { IsfwBuildInfo } from "./overview/IsfwBuildInfo";
import { Overview } from "./overview/Overview";
import { RunParameters } from "./overview/RunParameters";
import { CheckPoints } from "./sample-test/CheckPoints";
import { SampleTest } from "./sample-test/SampleTest";
import { SeleniumLog } from "./sample-test/SeleniumLog";
import { SubCheckPoints } from "./sample-test/SubCheckPoints";

import { ConfigurationManager } from "../source/base/ConfigurationManager";
this.properties = ConfigurationManager.getBundle();
const platformProperty = this.properties.get("platform");
const executionTimeStamp = getDate();
const startTime = new Date().getTime();
const jsonReports = path.join(
  process.cwd(),
  "/test-results/" + executionTimeStamp + "/json"
);
const htmlReports = path.join(
  process.cwd(),
  "/test-results/" + executionTimeStamp + "/html"
);
const targetJson = jsonReports + "/cucumber_report.json";
const metaInfoJson = path.join(process.cwd(), "/test-results/meta-info.json");
const jsonMetaInfoJson = path.join(
  process.cwd(),
  "/test-results/" + executionTimeStamp + "/json/meta-info.json"
);
const cucumberReportJsonPath = path.join(
  process.cwd(),
  "/test-results/" + executionTimeStamp + "/json/cucumber_report.json"
);
const rootMetaPath = "test-results/meta-info.json";

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + "_" + minutes + "_" + ampm;
  return strTime;
}

function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const monthShortNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const formatedMonth = monthShortNames[date.getMonth()];
  const day = date.getDate().toString();
  const formatedDay = day.length === 1 ? "0" + day : day;
  const timeFormat = formatAMPM(date);
  return formatedDay + "_" + formatedMonth + "_" + year + "_" + timeFormat;
}

let cucumberReporterOptions = {
  jsonFile: targetJson,
  output: htmlReports + "/cucumber_reporter.html",
  reportSuiteAsScenarios: true,
  theme: "bootstrap"
};

let cucumberJsonReporterOptions = {
  jsonFile: targetJson,
  output: htmlReports + "/cucumber_reporter.html",
  reportSuiteAsScenarios: true,
  theme: "bootstrap"
};

export class Reporter {
  constructor() {}
  public static createDirectory(dir: string) {
    this.createRootMetaInfo(executionTimeStamp);
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }
    if (!fs.existsSync(jsonReports)) {
      mkdirp.sync(jsonReports);
    }
    if (!fs.existsSync(targetJson)) {
      fs.writeFileSync(targetJson, "");
    }

    if (!fs.existsSync(htmlReports)) {
      mkdirp.sync(htmlReports);
    }
  }

  public static createHTMLReport() {
    try {
      reporter.generate(cucumberReporterOptions); // invoke cucumber-html-reporter
    } catch (err) {
      if (err) {
        throw new Error("Failed to save cucumber test results to json file.");
      }
    }
  }

  public static createRootMetaInfo(executionTimeStamp) {
    //let cucumberJson = JSON.parse(fs.readFileSync(cukeJson, 'UTF-8'));
    let rootMeta = { reports: [] };
    if (fs.existsSync(rootMetaPath)) {
      rootMeta = JSON.parse(fs.readFileSync(rootMetaPath, "UTF-8"));
    }
    let currentMeta = new MetaInfo(
      "QAF Demo",
      "test-results/" + executionTimeStamp + "/json",
      new Date().getTime()
    );
    rootMeta["reports"].unshift(currentMeta);
    fsExtra.ensureFileSync(metaInfoJson);
    fs.writeFileSync(metaInfoJson, JSON.stringify(rootMeta, null, 4));
  }

  public static createScenario(sampleTestJson, scenario) {
    let overviewArray = [];

    let args = ["[/]"];
    let subLogs = [];
    let seleniumLogArray: Array<SeleniumLog> = [];
    let subCheckPointsArray: Array<SubCheckPoints> = [];
    let subCheckPointsArraySub: Array<SubCheckPoints> = [];
    let checkPointsArray: Array<CheckPoints> = [];
    let keyPreFix = scenario.name + " " + scenario.line;
    let scenarioStartTime = Global.hashMap.get(keyPreFix + " starttime");
    let scenarioEndtTime = Global.hashMap.get(keyPreFix + " endtime");
    let duration = scenarioEndtTime - scenarioStartTime;

    for (let stepCount in scenario.steps) {
      let step = scenario.steps[stepCount];
      if (step.result.status === "passed") {
        step.result.status = "TestStepPass";
      } else if (step.result.status === "failed") {
        step.result.status = "TestStepFail";
      } else {
        step.result.status = "TestStepSkip";
      }
      if (step.keyword !== "Before" && step.keyword !== "After") {
        let checkPoints = new CheckPoints(
          step.keyword + " " + step.name,
          step.result.status,
          step.result.duration,
          0,
          subCheckPointsArray
        );
        checkPointsArray.push(checkPoints);
      }
    }
    let status: string = "pass";
    let errorTrace: string = "";
    for (let stepCount in scenario.steps) {
      if (scenario.steps[stepCount].result.status === Status.SKIPPED) {
        status = "skip";
      }
      if (scenario.steps[stepCount].result.status === Status.FAILED) {
        status = "fail";
        errorTrace = scenario.steps[stepCount].result.error_message;
        break;
      }
    }
    let seleniumLog = new SeleniumLog("get", args, status, subLogs, duration);
    //let subCheckPoints = new SubCheckPoints('Timed out after 0 seconds: Unable to create driver instance in 1st attempt with retry timeout of 0 seconds. You can check/set value of 'driver.init.retry.timeout' appropriately to set retry timeout on driver initialization failure.\nDriver file not exist.', 'Fail', 0, 0, subCheckPointsArraySub);
    seleniumLogArray.push(seleniumLog);
    //subCheckPointsArray.push(subCheckPoints);

    let sampleTest = new SampleTest(
      seleniumLogArray,
      checkPointsArray,
      errorTrace
    );
    fs.writeFileSync(
      sampleTestJson + "/" + scenario.name + ".json",
      JSON.stringify(sampleTest, null, 4)
    );
  }

  public static createMetaInfoInScenario(
    scenarioMetaInfoJson,
    scenario,
    startTimeArray,
    endTimeArray
  ) {
    let scenarioMeta = { methods: [] };

    let stringArray = [];
    if(scenario.tags !== undefined)
    {
      scenario.tags.forEach(function(tag){
        stringArray.push(tag.name);
      });

    }

    let senarioMetaData = new ScenarioMetaData(
      scenario.name,
      stringArray,
      scenario.line,
      scenario.name,
      "scenarios/web/suite1.bdd",
      "scenarios.web.suite1.bdd.SampleTest()[pri:1002, instance:com.qmetry.qaf.automation.step.client.Scenario@3ea]"
    );
    let status: string = "pass";
    for (let stepsCount in scenario.steps) {
      if (scenario.steps[stepsCount].result.status === Status.SKIPPED) {
        status = "skip";
      }
      if (scenario.steps[stepsCount].result.status === Status.FAILED) {
        status = "fail";
        break;
      }
    }
    let keyPreFix = scenario.name + " " + scenario.line;
    let scenarioStartTime = Global.hashMap.get(keyPreFix + " starttime");
    let scenarioEndtTime = Global.hashMap.get(keyPreFix + " endtime");
    let duration = scenarioEndtTime - scenarioStartTime;
    startTimeArray.push(scenarioStartTime);
    endTimeArray.push(scenarioEndtTime);

    let scenarioMetaInfo = new ScenarioMetaInfo(
      1,
      "test",
      [],
      senarioMetaData,
      [],
      scenarioStartTime,
      duration,
      status,
      0.0
    );
    scenarioMeta.methods.push(scenarioMetaInfo);
    fs.writeFileSync(
      scenarioMetaInfoJson + "/meta-info.json",
      JSON.stringify(scenarioMeta, null, 4)
    );
  }

  public static updateMetaInfoInScenario(
    scenarioMetaInfoJson,
    scenario,
    startTimeArray,
    endTimeArray
  ) {
    let stringArray = [];
    stringArray.push(scenario.tags[0].name);
    let senarioMetaData = new ScenarioMetaData(
      scenario.name,
      stringArray,
      scenario.line,
      scenario.name,
      "scenarios/web/suite1.bdd",
      "scenarios.web.suite1.bdd.SampleTest()[pri:1002, instance:com.qmetry.qaf.automation.step.client.Scenario@3ea]"
    );
    let status: string = "pass";
    for (let stepsCount in scenario.steps) {
      if (scenario.steps[stepsCount].result.status === Status.SKIPPED) {
        status = "skip";
      }
      if (scenario.steps[stepsCount].result.status === Status.FAILED) {
        status = "fail";
        break;
      }
    }
    let keyPreFix = scenario.name + " " + scenario.line;
    let scenarioStartTime = Global.hashMap.get(keyPreFix + " starttime");
    let scenarioEndtTime = Global.hashMap.get(keyPreFix + " endtime");
    let duration = scenarioEndtTime - scenarioStartTime;
    startTimeArray.push(scenarioStartTime);
    endTimeArray.push(scenarioEndtTime);

    let scenarioMetaInfo = new ScenarioMetaInfo(
      1,
      "test",
      [],
      senarioMetaData,
      [],
      scenarioStartTime,
      duration,
      status,
      0.0
    );
    // scenarioMeta.methods.push(scenarioMetaInfo);

    let updateMetaInfo = fs.readFileSync(
      scenarioMetaInfoJson + "/meta-info.json",
      "UTF-8"
    );
    updateMetaInfo = JSON.parse(updateMetaInfo);
    updateMetaInfo["methods"].push(scenarioMetaInfo);

    fs.writeFileSync(
      scenarioMetaInfoJson + "/meta-info.json",
      JSON.stringify(updateMetaInfo, null, 4)
    );
  }

  public static createMetaInfoInJson() {
    let cucumberReportJson;
    if (fs.existsSync(cucumberReportJsonPath)) {
      cucumberReportJson = JSON.parse(
        fs.readFileSync(cucumberReportJsonPath, "UTF-8")
      );
    }
    let featureDirNames: string[] = [];
    let startTimeMinFromFeature: number[] = [];
    let endTimeTimeMaxFromFeature: number[] = [];

    for (let featureCount in cucumberReportJson) {
      // featureDirNames.push(cucumberReportJson[featureCount].name);
      let featureDirName =
        cucumberReportJson[featureCount].name +
        "_" +
        path.basename(
          cucumberReportJson[featureCount].uri.split(".feature")[0]
        );

      featureDirNames.push(featureDirName);
      let featureDirs = jsonReports + "/" + featureDirName;
      if (!fs.existsSync(featureDirs)) {
        fs.mkdirSync(featureDirs);
      }
      let startTimeArray: number[] = [];
      let endTimeArray: number[] = [];
      let isUpdate: boolean = false;

      let scenarioDirNames: string[] = [];
      scenarioDirNames.push("" + cucumberReportJson[featureCount].name);
      let elementsName: string;
      for (let scenarioCount in cucumberReportJson[featureCount].elements) {
        let name =
          cucumberReportJson[featureCount].elements[scenarioCount].name +
          "_" +
          cucumberReportJson[featureCount].elements[scenarioCount].line;
        let scenarioDir =
          featureDirs + path.sep + cucumberReportJson[featureCount].name;
        if (!fs.existsSync(scenarioDir)) {
          fs.mkdirSync(scenarioDir);
        } else {
          isUpdate = true;
        }
        let scenario = cucumberReportJson[featureCount].elements[scenarioCount];
        if (isUpdate) {
          //UPDATE METAINFO
          this.updateMetaInfoInScenario(
            scenarioDir,
            scenario,
            startTimeArray,
            endTimeArray
          );
        } else {
          this.createMetaInfoInScenario(
            scenarioDir,
            scenario,
            startTimeArray,
            endTimeArray
          );
        }

        this.createScenario(
          scenarioDir,
          cucumberReportJson[featureCount].elements[scenarioCount]
        );
        elementsName =
          cucumberReportJson[featureCount].elements[scenarioCount].name;

        let minStart = Math.min.apply(Math, startTimeArray);
        let maxEnd = Math.max.apply(Math, endTimeArray);

        startTimeMinFromFeature.push(minStart);
        endTimeTimeMaxFromFeature.push(maxEnd);
        if (isUpdate) {
          this.updateOverview(
            featureDirName,
            scenarioDirNames,
            elementsName,
            minStart,
            maxEnd
          );
        } else {
          this.createOverview(
            featureDirName,
            scenarioDirNames,
            elementsName,
            minStart,
            maxEnd
          );
        }
      }
      // let uniqueFeaturedirName = [...new Set(featureDirNames)];
    }
    let status = "pass";
    if (Global.skip > 0) {
      status = "skip";
    }
    if (Global.fail > 0) {
      status = "fail";
    }
    let minStart = Math.min.apply(Math, startTimeMinFromFeature);
    let maxEnd = Math.max.apply(Math, endTimeTimeMaxFromFeature);
    let jsonMetaInfo = new JsonMetaInfo(
      "Cucumber Report",
      status,
      featureDirNames,
      Global.total,
      Global.pass,
      Global.fail,
      Global.skip,
      minStart,
      maxEnd
    );
    //jsonMeta.push(jsonMetaInfo);

    fs.writeFileSync(jsonMetaInfoJson, JSON.stringify(jsonMetaInfo, null, 4));
  }

  public static createJSONReport() {
    Reporter.createMetaInfoInJson();
  }

  public static getTimeStamp() {
    return executionTimeStamp;
  }

  public static createOverview(
    featuresDir,
    scenarioDirsArray,
    elementsName,
    minStart,
    maxEnd
  ) {
    let browserDesiredCapabilities = new BrowserDesiredCapabilities(
      "",
      true,
      true,
      "",
      "",
      true
    );
    let browserActualCapabilities = new BrowserActualCapabilities();
    let isfwBuildInfo = new IsfwBuildInfo("", "", "", "");
    let runParameters = new RunParameters(
      "resources/" + platformProperty,
      "",
      "",
      ""
    );
    let executionEnvInfo = new ExecutionEnvInfo("", "", "", "", "", "", "", "");
    let envInfo = new EnvInfo(
      browserDesiredCapabilities,
      browserActualCapabilities,
      isfwBuildInfo,
      runParameters,
      executionEnvInfo
    );

    let passKey = elementsName + " " + Status.PASSED;
    let failKey = elementsName + " " + Status.FAILED;
    let skipKey = elementsName + " " + Status.SKIPPED;
    let totalKey = elementsName + " total";
    let totalValue =
      Global.hashMap.get(totalKey) === undefined
        ? 0
        : Global.hashMap.get(totalKey);
    let passValue =
      Global.hashMap.get(passKey) === undefined
        ? 0
        : Global.hashMap.get(passKey);
    let failValue =
      Global.hashMap.get(failKey) === undefined
        ? 0
        : Global.hashMap.get(failKey);
    let skipValue =
      Global.hashMap.get(skipKey) === undefined
        ? 0
        : Global.hashMap.get(skipKey);
    let overview = new Overview(
      totalValue,
      passValue,
      failValue,
      skipValue,
      scenarioDirsArray,
      envInfo,
      minStart,
      maxEnd
    );

    let jsonString = Overview.formatFieldNames(
      JSON.stringify(overview, null, 4)
    );
    let dir = jsonReports + "/" + featuresDir + "/overview.json";
    fs.writeFileSync(dir, jsonString);
  }

  public static updateOverview(
    featuresDir,
    scenarioDirsArray,
    elementsName,
    minStart,
    maxEnd
  ) {
    let passKey = elementsName + " " + Status.PASSED;
    let failKey = elementsName + " " + Status.FAILED;
    let skipKey = elementsName + " " + Status.SKIPPED;
    let totalKey = elementsName + " total";
    let totalValue =
      Global.hashMap.get(totalKey) === undefined
        ? 0
        : Global.hashMap.get(totalKey);
    let passValue =
      Global.hashMap.get(passKey) === undefined
        ? 0
        : Global.hashMap.get(passKey);
    let failValue =
      Global.hashMap.get(failKey) === undefined
        ? 0
        : Global.hashMap.get(failKey);
    let skipValue =
      Global.hashMap.get(skipKey) === undefined
        ? 0
        : Global.hashMap.get(skipKey);

    let dir = jsonReports + "/" + featuresDir + "/overview.json";
    let content = fs.readFileSync(dir, "utf8");
    content = JSON.parse(content);
    // scenarioDirsArray.forEach(function(scenario) {
    //   content["classes"].push(scenario);
    // });

    content["total"] = content["total"] + totalValue;
    content["pass"] = content["pass"] + passValue;
    content["fail"] = content["fail"] + failValue;
    content["skip"] = content["skip"] + skipValue;
    content["startTime"] = minStart;
    content["endTime"] = maxEnd;
    fs.writeFileSync(dir, JSON.stringify(content, null, 4));
  }
}
