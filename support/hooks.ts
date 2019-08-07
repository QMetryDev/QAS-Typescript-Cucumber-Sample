const { BeforeAll, After, AfterAll, Status } = require('cucumber');
import { Before } from 'cucumber';
import { browser } from 'protractor';
import { ConfigurationManager } from '../source/base/ConfigurationManager';
import { Global } from './global';

var HashMap = require('hashmap');



Before(async function(scenario) {
    let keyPreFix = scenario.pickle.name + ' ' + scenario.sourceLocation.line;
    Global.hashMap.set(keyPreFix + ' starttime', new Date().getTime());
});

BeforeAll({timeout: 100 * 1000}, async () => {
    Global.startTime = new Date().getTime();
    Global.hashMap = new HashMap();
    var properties = ConfigurationManager.getBundle();
    await browser.get(properties.get('env.baseurl'));
});

After(async function(scenario) {
    let keyPreFix = scenario.pickle.name + ' ' + scenario.sourceLocation.line;
    Global.hashMap.set(keyPreFix + ' endtime', new Date().getTime());
    let key: string = '';
    if (scenario.result.status === Status.FAILED) {
        Global.fail++;
    }
    if (scenario.result.status === Status.PASSED) {
        Global.pass++;
    }
    if (scenario.result.status === Status.skipped) {
        Global.skip++;
    }
    key = scenario.pickle.name + ' ' + scenario.result.status;

    Global.hashMap.set(key, (Global.hashMap.get(key) === undefined
    ? 1 : parseInt(Global.hashMap.get(key)) +1));

    let keyTotal = scenario.pickle.name + ' total';
    Global.hashMap.set(keyTotal, (Global.hashMap.get(keyTotal) === undefined
        ? 1 : parseInt(Global.hashMap.get(keyTotal)) +1));
    Global.total++;
    console.log(JSON.stringify(scenario));
    if (scenario.result.status === Status.FAILED) {
        // screenShot is a base-64 encoded PNG
        const screenShot = await browser.takeScreenshot();
        this.attach(screenShot, 'image/png');
    }
});

AfterAll({timeout: 100 * 1000}, async () => {
    Global.endTime = new Date().getTime();
    await browser.quit();
});
