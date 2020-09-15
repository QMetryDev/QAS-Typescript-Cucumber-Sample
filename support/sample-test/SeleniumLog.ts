
export class SeleniumLog {
    //field
    commandName: string;
    args: string[] = [];
    result: string;
    subLogs: string[] = [];
    duration: number;

    //constructor
    constructor(commandName:string, args:string[], result:string, subLogs:string[],
        duration:number) {
       this.commandName = commandName;
       this.args = args;
       this.result = result;
       this.subLogs = subLogs;
       this.duration = duration;
    }

    //function
    disp():void {
       console.log('Command Name is  :   '+this.commandName) ;
    }
 }