export class ScenarioMetaData {
    //field
    description:string;
    groups:string[];
    lineNo:number;
    name:string;
    referece:string;
	sign:string;
	resultFileName:string;

    //constructor
    constructor(description:string, groups:string[], lineNo:number, name:string, referece:string, sign:string) {
       this.description = description;
       this.groups = groups;
       this.lineNo = lineNo;
       this.name = name;
       this.referece = referece;
       this.resultFileName = name;
       this.sign = sign;
    }

    //function
    disp():void {
       console.log('Name is  :   '+this.name);
    }
 }