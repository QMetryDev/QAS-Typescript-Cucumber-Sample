
export class BrowserDesiredCapabilities {
    //field
    browserName:string;
    takesScreenshot: boolean;
    javascriptEnabled: boolean;
    version: string;
    platform: string;
    cssSelectorsEnabled: boolean;

    //constructor
    constructor(browserName:string, takesScreenshot:boolean, javascriptEnabled: boolean,
        version: string, platform: string, cssSelectorsEnabled: boolean) {
       this.browserName = browserName;
       this.takesScreenshot = takesScreenshot;
       this.javascriptEnabled = javascriptEnabled;
       this.version = version;
       this.platform = platform;
       this.cssSelectorsEnabled = cssSelectorsEnabled;
    }

    //function
    disp():void {
       console.log('Index is  :   '+this.browserName)
    }
 }