import { ConfigurationManager } from './ConfigurationManager';
const fs = require('fs');
const zip = require('zip-folder');

let integrationProperties = ConfigurationManager.getIntegrationBundle();
export const QMETRY_ENABLED = integrationProperties.get('automation.qmetry.enabled') !== null ? integrationProperties.get('automation.qmetry.enabled') : '';
export const INTEGRATION_TYPE = integrationProperties.get('automation.qmetry.type') !== null ? integrationProperties.get('automation.qmetry.type') : '';
export const ON_PREMISE = integrationProperties.get('automation.qmetry.onpremise') !== null ? integrationProperties.get('automation.qmetry.onpremise') : '';
export const URL = integrationProperties.get('automation.qmetry.url') !== null ? integrationProperties.get('automation.qmetry.url') : '';
export const API_KEY = integrationProperties.get('automation.qmetry.apikey') !== null ? integrationProperties.get('automation.qmetry.apikey') : '';
export const USERNAME = integrationProperties.get('automation.qmetry.username') !== null ? integrationProperties.get('automation.qmetry.username') : '';
export const PASSWORD = integrationProperties.get('automation.qmetry.password') !== null ? integrationProperties.get('automation.qmetry.password') : '';
export const ALIAS_NAME = integrationProperties.get('automation.qmetry.aliasName') !== null ? integrationProperties.get('automation.qmetry.aliasName') : '';
export const ALIAS = integrationProperties.get('automation.qmetry.Alias') !== null ? integrationProperties.get('automation.qmetry.Alias') : '';
export const TEST_RUN_NAME = integrationProperties.get('automation.qmetry.testrunname') !== null ? integrationProperties.get('automation.qmetry.testrunname') : '';
export const LABELS = integrationProperties.get('automation.qmetry.labels') !== null ? integrationProperties.get('automation.qmetry.labels') : '';
export const COMPONENTS = integrationProperties.get('automation.qmetry.components') !== null ? integrationProperties.get('automation.qmetry.components') : '';
export const VERSION = integrationProperties.get('automation.qmetry.version') !== null ? integrationProperties.get('automation.qmetry.version') : '';
export const SPRINT = integrationProperties.get('automation.qmetry.sprint') !== null ? integrationProperties.get('automation.qmetry.sprint') : '';
export const PLATFORM = integrationProperties.get('automation.qmetry.platform') !== null ? integrationProperties.get('automation.qmetry.platform') : '';
export const COMMENT = integrationProperties.get('automation.qmetry.comment') !== null ? integrationProperties.get('automation.qmetry.comment') : '';
export const TEST_RUN_KEY = integrationProperties.get('automation.qmetry.testrunkey') !== null ? integrationProperties.get('automation.qmetry.testrunkey') : '';
export const TEST_ASSET_HIERARCHY = integrationProperties.get('automation.qmetry.testassethierarchy') !== null && (integrationProperties.get('automation.qmetry.testassethierarchy')) !==0 ? integrationProperties.get('automation.qmetry.testassethierarchy') : 'TestCase-TestStep';
export const JIRA_FIELS = integrationProperties.get('automation.qmetry.jirafields') !== null ? integrationProperties.get('automation.qmetry.jirafields') : '';
export const DEBUG = integrationProperties.get('automation.qmetry.debug') !== null ? integrationProperties.get('automation.qmetry.debug') : '';
export const ATTACH_FILE = integrationProperties.get('automation.qmetry.attachfile') !== null ? integrationProperties.get('automation.qmetry.attachfile') : '';
export const TEST_CASE_UPDATE_LEVEL = integrationProperties.get('automation.qmetry.testcaseupdatelevel') !== null ? integrationProperties.get('automation.qmetry.testcaseupdatelevel') : '';
export const CYCLE_IDS = integrationProperties.get('automation.qmetry.cycleid') !== null ? integrationProperties.get('automation.qmetry.cycleid') : '';
export const PLATFORM_ID = integrationProperties.get('automation.qmetry.platformid') !== null ? integrationProperties.get('automation.qmetry.platformid') : '';
export const TEST_SUITE_ID = integrationProperties.get('automation.qmetry.testsuiteid') !== null ? integrationProperties.get('automation.qmetry.testsuiteid') : '';
export const PROJECT_ID = integrationProperties.get('automation.qmetry.projectid') !== null ? integrationProperties.get('automation.qmetry.projectid') : '';
export const REALEASE_ID = integrationProperties.get('automation.qmetry.releaseid') !== null ? integrationProperties.get('automation.qmetry.releaseid') : '';
export const BUILD_ID = integrationProperties.get('automation.qmetry.buildid') !== null ? integrationProperties.get('automation.qmetry.buildid') : '';
export const FORMAT = integrationProperties.get('automation.qmetry.format') !== null ? integrationProperties.get('automation.qmetry.format') : '';
export const ENTITY_TYPE = integrationProperties.get('automation.qmetry.entityType') !== null ? integrationProperties.get('automation.qmetry.entityType') : 'CUCUMBER';
export const TEST_SUITE_NAME = integrationProperties.get('automation.qmetry.testsuitename') !== null ? integrationProperties.get('automation.qmetry.testsuitename') : '';

export let testResultsPath = './test-results/';
export let latestCreatedZip: string = '';

export function ZipMaker(callback) {
  fs.readdir(testResultsPath, function (err, files) {
    if (err) {
      console.log('error while zip directory:' + err);
      throw err;
    }
    var latestDir = testResultsPath + getNewestFile(files, testResultsPath);
    console.log('latestDir::' + latestDir);
    latestCreatedZip = latestDir + '.zip';
    zip(latestDir + '/json/', latestCreatedZip, function (err) {
      if (err) {
        console.log('oh!!!.... zip error', err);
      } else {
        console.log('zip created successfully...🙂');
        callback({ success: true, filePath: latestCreatedZip });
      }
    });
  });
  function getNewestFile(files, path) {
    var out = [];
    files.forEach(function (file) {
      var stats = fs.statSync(path + '/' + file);
      if (stats.isDirectory()) {
        out.push({ file: file, mtime: stats.mtime.getTime() });
      }
    });
    out.sort(function (a, b) {
      return b.mtime - a.mtime;
    });
    return out.length > 0 ? out[0].file : '';
  }
}
