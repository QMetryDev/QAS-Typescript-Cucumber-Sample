import { Scenario } from './Scenario';

export class Feature {
    //field
    keyword: string;
    name: string;
    line: number;
    id: string;
    tags : string[];
    uri : string;
    elements: Scenario[];
    //constructor
    constructor( keyword: string, name: string, line: number, id: string,
        tags : string[], uri : string, elements: Scenario[]) {
       this.keyword = keyword;
       this.name = name;
       this.line = line;
       this.id = id;
       this.tags = tags;
       this.uri = uri;
       this.elements = this.elements;

    }

    //function
    disp():void {
       console.log('Name is  :   '+this.name);
    }
 }