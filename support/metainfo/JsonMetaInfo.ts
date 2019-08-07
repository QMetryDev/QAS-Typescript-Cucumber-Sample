export class JsonMetaInfo {
    //field
    name:string;
    status: string;
    tests: string[] = [];
    total: number;
    pass: number;
    fail: number;
    skip: number;
    startTime: number;
    endTime: number;

    //constructor
    constructor(name:string, status:string, tests:string[], total:number,
        pass:number, fail:number, skip:number, startTime:number, endTime:number) {
       this.name = name;
       this.status = status;
       this.tests = tests;
       this.total = total;
       this.pass = pass;
       this.fail = fail;
       this.skip = skip;
       this.startTime = startTime;
       this.endTime = endTime;

    }

    //function
    disp():void {
    }
 }