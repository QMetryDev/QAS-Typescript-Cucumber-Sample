export class MetaInfo {
    //field
    name:string;
    dir: string;
    startTime: number;

    //constructor
    constructor(name:string, dir:string, startTime:number) {
       this.name = name;
       this.dir = dir;
       this.startTime = startTime;

    }

    //function
    disp():void {
       console.log('Name is  :   '+this.name);
    }
 }