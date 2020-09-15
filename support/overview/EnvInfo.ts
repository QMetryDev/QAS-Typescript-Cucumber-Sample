import { BrowserDesiredCapabilities } from './BrowserDesiredCapabilities';
import { BrowserActualCapabilities } from './BrowserActualCapabilities';
import { IsfwBuildInfo } from './IsfwBuildInfo';
import { RunParameters } from './RunParameters';
import { ExecutionEnvInfo } from './ExecutionEnvInfo';

export class EnvInfo {
    //field
    browserDesiredCapabilities:BrowserDesiredCapabilities;
    browserActualCapabilities: BrowserActualCapabilities;
    isfwBuildInfo: IsfwBuildInfo;
    runParameters: RunParameters;
    executionEnvInfo: ExecutionEnvInfo;

    //constructor
    constructor(browserDesiredCapabilities:BrowserDesiredCapabilities,
        browserActualCapabilities: BrowserActualCapabilities,
        isfwBuildInfo: IsfwBuildInfo,
        runParameters: RunParameters,
        executionEnvInfo: ExecutionEnvInfo) {
       this.browserDesiredCapabilities = browserDesiredCapabilities;
       this.browserActualCapabilities = browserActualCapabilities;
       this.isfwBuildInfo = isfwBuildInfo;
       this.runParameters = runParameters;
       this.executionEnvInfo = executionEnvInfo;
    }

    //function
    disp():void {
       console.log('BrowserDesiredCapabilities is  :   '+this.browserDesiredCapabilities);
    }
 }