
export class IsfwBuildInfo {
    //field
    qafType: string;
    qafRevision: string;
    qafVersion: string;
    qafBuildTime: string;

    //constructor
    constructor(qafType:string, qafRevision:string, qafVersion: string, qafBuildTime: string) {
       this.qafType = qafType;
       this.qafRevision = qafRevision;
       this.qafVersion = qafVersion;
       this.qafBuildTime = qafBuildTime;
    }

    //function
    disp():void {
       console.log('Index is  :   ' + this.qafType)
    }
 }