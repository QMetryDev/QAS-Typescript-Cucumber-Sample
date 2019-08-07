
export class RunParameters {
    //field
    resources: string;
    scenarioFileLoc: string;
    baseurl: string;
    envResources: string;

    //constructor
    constructor(resources:string, scenarioFileLoc:string, baseurl: string, envResources: string) {
       this.resources = resources;
       this.scenarioFileLoc = scenarioFileLoc;
       this.baseurl = baseurl;
       this.envResources = envResources;
    }

    //function
    disp():void {
       console.log('resources is  :   ' + this.resources);
    }
 }