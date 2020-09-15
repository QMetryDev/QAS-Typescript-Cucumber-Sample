export class Scenario {
    //field


    id: string;
    keyword: string;
    line: number;
    name: string;
    tags : any[];
    uri : string;
    type : string;
    steps : any[];
    //constructor
    constructor( keyword: string, name: string, line: number, id: string,
        tags : any[], uri : string, type : string, steps : any[]) {
       this.keyword = keyword;
       this.name = name;
       this.line = line;
       this.id = id;
       this.tags = tags;
       this.uri = uri;
       this.type = type;
       this.steps = steps;

    }

    //function
    disp():void {
       console.log('Name is  :   '+this.name);
    }
 }