
export class ExecutionEnvInfo {
    //field
    javaArch: string;
    javaVendor: string;
    javaVersion: string;
    osArch: string;
    host: string;
    osName: string;
    userName: string;
    osVersion: string;
    //constructor
    constructor(javaArch:string, javaVendor:string, javaVersion: string, osArch: string,
        host:string, osName:string, userName:string, osVersion: string) {
       this.javaArch = javaArch;
       this.javaVendor = javaVendor;
       this.javaVersion = javaVersion;
       this.osArch = osArch;
       this.host = host;
       this.osName = osName;
       this.userName = userName;
       this.osVersion = osVersion;
    }

    //function
    disp():void {
       console.log('resources is  :   ' + this.javaArch);
    }
 }