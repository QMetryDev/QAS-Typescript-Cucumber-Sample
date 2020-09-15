import { ScenarioMetaData } from './ScenarioMetadata';

export class ScenarioMetaInfo {
    //field
    index:number;
    type: string;
    args: string[] = [];
    metaData: ScenarioMetaData;
    dependsOn: string[] = [];
    startTime: number;
    duration: number;
    result: string;
    passPer: number;

    //constructor
    constructor(index:number, type:string, args:string[], metaData:ScenarioMetaData,
        dependsOn:string[],  startTime:number, duration:number, result:string, passPer:number) {
       this.index = index;
       this.type = type;
       this.args = args;
       this.metaData = metaData;
       this.dependsOn = dependsOn;
       this.startTime = startTime;
       this.duration = duration;
       this.result = result;
       this.passPer = passPer;
    }

    //function
    disp():void {
    }
 }