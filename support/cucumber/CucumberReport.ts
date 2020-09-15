import { Feature } from './Feature';

export class CucumberReport {
    //field
    features:Feature[];

    //constructor
    constructor(features: Feature[]) {
       this.features = features;
    }

    //function
    disp():void {
       console.log('Name is  :   '+this.features);
    }
 }