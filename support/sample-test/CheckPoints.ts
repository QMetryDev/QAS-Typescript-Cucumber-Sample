import { SubCheckPoints } from './SubCheckPoints';

export class CheckPoints {
    //field
    message: string;
    type: string;
    duration: number;
    threshold: number;
    subCheckPoints: SubCheckPoints[];

    //constructor
    constructor(message: string, type: string, duration: number, threshold: number, subCheckPoints: SubCheckPoints[]) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.threshold = threshold;
        this.subCheckPoints = subCheckPoints;
    }

    //function
    disp(): void {
        console.log('Message is  :   ' + this.message)
    }
}