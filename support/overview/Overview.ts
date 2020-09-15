import { EnvInfo } from './EnvInfo';

export class Overview {
    //field
    total: number;
    pass: number;
    fail: number;
    skip: number;
    classes: string[] = [];
    envInfo: EnvInfo;
    startTime: number;
    endTime: number;

    //constructor
    constructor(total:number, pass:number, fail:number, skip:number,
         classes:string[], envInfo: EnvInfo, startTime:number, endTime:number) {
       this.total = total;
       this.pass = pass;
       this.fail = fail;
       this.skip = skip;
       this.classes = classes;
       this.envInfo = envInfo;
       this.startTime = startTime;
       this.endTime = endTime;

    }

    //function
    disp():void {
       console.log('Total is  :   '+this.total)
    }

    /*
      Set field name as required by chart
      Example:
    */
    public static  formatFieldNames(jsonString) : string {
      jsonString = jsonString.replace('browserDesiredCapabilities','browser-desired-capabilities');
      jsonString = jsonString.replace('browserActualCapabilities','browser-actual-capabilities');
      jsonString = jsonString.replace('isfwBuildInfo','isfw-build-info');
      jsonString = jsonString.replace('qafType','qaf-Type');
      jsonString = jsonString.replace('qafRevision','qaf-Revision');
      jsonString = jsonString.replace('qafVersion','qaf-Version');
      jsonString = jsonString.replace('qafBuildTime','qaf-Build-Time');
      jsonString = jsonString.replace('qafBuildTime','qaf-Build-Time');
      jsonString = jsonString.replace('runParameters','run-parameters');
      jsonString = jsonString.replace('scenarioFileLoc','scenario-file-loc');
      jsonString = jsonString.replace('envResources','env.resources');
      jsonString = jsonString.replace('executionEnvInfo','execution-env-info');
      jsonString = jsonString.replace('javaArch','java.arch');
      jsonString = jsonString.replace('javaVendor','java.vendor');
      jsonString = jsonString.replace('javaVersion','java.version');
      jsonString = jsonString.replace('osArch','os.arch');
      jsonString = jsonString.replace('osName','os.name');
      jsonString = jsonString.replace('userName','user.name');
      jsonString = jsonString.replace('osVersion','os.version');

      return jsonString;
    }

 }