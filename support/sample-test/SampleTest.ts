import { SeleniumLog } from './SeleniumLog';
import { CheckPoints } from './CheckPoints';

export class SampleTest {
    //field
    seleniumLog: SeleniumLog[];
    checkPoints: CheckPoints[];
    errorTrace: string;

    //constructor
    constructor(seleniumLog: SeleniumLog[], checkPoints: CheckPoints[], errorTrace:string) {
       this.seleniumLog = seleniumLog;
       this.checkPoints = checkPoints;
       this.errorTrace = errorTrace;
    }

    //function
    disp():void {
       console.log('ErrorTrace is  :   '+this.errorTrace);
    }
 }