import * as configurationmanager from "./ConfigurationManager";
export class LocatorUtils {
  getLocator(locator, ...text) {
    let description: string;
    if (
      configurationmanager.ConfigurationManager.getBundle().get(locator) !==
      undefined &&
      configurationmanager.ConfigurationManager.getBundle().get(locator) !==
      null
    ) {
      locator = configurationmanager.ConfigurationManager.getBundle().get(
        locator
      );
    } else {
    }

    try {
      let locatorJson = locator;
      locator = JSON.parse(locatorJson)['locator'];
      description = JSON.parse(locatorJson)['desc'];
    } catch (e) {
      try {
        let locatorJson = locator.replace(/\\\\/g, '\\').replace(/\\\"/g, '"');
        locator = JSON.parse(locatorJson)['locator'];
        description = JSON.parse(locatorJson)['desc'];
      } catch (error) {
        description = locator;
      }
    }

    let locatorType = locator.split("=", 1);
    let locValue = locator.substring(locator.indexOf("=") + 1);
    if (locator.indexOf("=") <= -1) {
      throw new Error('Locator/Key ' + locator + " seems invalid");
    }
    locValue = locValue.replace(/'/g, "\\'");
    let eleLocator = "by." + locatorType + "('" + locValue + "')";
    if (text && text.length > 0) {
      eleLocator = eleLocator.replace("%s", text[0]);
    }
    try {
      return { locator: eval(eleLocator), description };
    } catch (error) {
      throw new Error(error);
    }
  }
}
