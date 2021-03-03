import { defineStep, setDefaultTimeout } from "cucumber";
import { browser, protractor, by, $, element, ExpectedConditions, WebElement, ElementFinder } from "protractor";
import { ConfigurationManager } from "../source/base/ConfigurationManager";
import { LocatorUtils } from "../source/base/LocatorUtils";
let properties = ConfigurationManager.getBundle();
const chai = require("chai").use(require("chai-as-promised"));
const expect = chai.expect;

let locatorUtil = new LocatorUtils();
setDefaultTimeout(60 * 1000);
function jsScript() {
	return `function simulateDragDrop(sourceNode, destinationNode) {
	var EVENT_TYPES = {
	DRAG_END: 'dragend',
	DRAG_START: 'dragstart',
	DROP: 'drop'
	}

	function createCustomEvent(type) {
	var event = new CustomEvent("CustomEvent")
	event.initCustomEvent(type, true, true, null)
	event.dataTransfer = {
	data: {
	},
	setData: function(type, val) {
	this.data[type] = val
	},
	getData: function(type) {
	return this.data[type]
	}
	}
	return event
	}

	function dispatchEvent(node, type, event) {
	if (node.dispatchEvent) {
	return node.dispatchEvent(event)
	}
	if (node.fireEvent) {
	return node.fireEvent("on" + type, event)
	}
	}

	var event = createCustomEvent(EVENT_TYPES.DRAG_START)
	dispatchEvent(sourceNode, EVENT_TYPES.DRAG_START, event)

	var dropEvent = createCustomEvent(EVENT_TYPES.DROP)
	dropEvent.dataTransfer = event.dataTransfer
	dispatchEvent(destinationNode, EVENT_TYPES.DROP, dropEvent)

	var dragEndEvent = createCustomEvent(EVENT_TYPES.DRAG_END)
	dragEndEvent.dataTransfer = event.dataTransfer
	dispatchEvent(sourceNode, EVENT_TYPES.DRAG_END, dragEndEvent)
	}`;
}

defineStep(/get "(.*?)"$/, async url => {
	await browser.get(url);
});

defineStep(/click on "(.*?)"$/, async locator => {
	await element(locatorUtil.getLocator(locator).locator)
		.click()
		.then(() => { })
		.catch(err => {
			throw err;
		});
});

defineStep(/sendkeys "(.*?)" into "(.*?)"$/, async (text, locator) => {
	if (text.startsWith("${")) {
		text = properties.get(text.substring(2, text.length - 1));
	}
	await element(locatorUtil.getLocator(locator).locator)
		.sendKeys(text)
		.then(() => { })
		.catch(err => {
			throw err;
		});
});

defineStep(/^clear "(.*?)"$/, async locator => {
	await element(locatorUtil.getLocator(locator).locator)
		.clear()
		.then(() => { })
		.catch(err => {
			throw err;
		});
});

defineStep(/submit "(.*?)"$/, async locator => {
	await element(locatorUtil.getLocator(locator).locator)
		.submit()
		.then(() => { })
		.catch(err => {
			throw err;
		});
});
defineStep(/select "(.*?)" in "(.*?)"$/, async (text, locator) => {
	if (text.startsWith("${")) {
		text = properties.get(text.substring(2, text.length - 1));
	}
	await element(by.cssContainingText('option', text)).click()
		.then(() => { })
		.catch(err => {
			throw err;
		});
});
defineStep(/mouse move on "(.*?)"$/, async locator => {
	await browser
		.actions()
		.mouseMove(element(locatorUtil.getLocator(locator).locator))
		.perform()
		.then(() => { })
		.catch(err => {
			throw err;
		});
});
function processValue(value: String) {
	if (value.startsWith("${")) {
		value = properties.get(value.substring(2, value.length - 1));
	}
	return value;
}
defineStep(/^change locale to "(.*?)"$/, async locale => {
	ConfigurationManager.defaultLocale = locale;
	ConfigurationManager.setup();
});

defineStep(/^comment "(.*?)"$/, async value => {
	console.log("Comment ::: " + processValue(value));
});
defineStep(/Verify title is "(.*?)"$/, async expectedTitle => {
	await expect(browser.getTitle()).to.eventually.equal(expectedTitle);

	// await browser
	//   .getTitle()
	//   .then(actualPageTitle => {
	//     chai.assert(expectedTitle === actualPageTitle, actualPageTitle + " should be " + expectedTitle + ", actual is " + actualPageTitle);
	//   })
	//   .catch(err => {
	//     throw err;
	//   });
});

defineStep(/verify "(.*?)" is present$/, async locator => {
	try {
		chai.assert(
			await element(locatorUtil.getLocator(locator).locator).isPresent(),
			"Element should be not present"
		);
	} catch (error) {
		throw error;
	}
});

function ensureElementIsPresent(elmnt: ElementFinder) {
	// waitForElement(element);
	return new Promise((resolve, reject) => {
		elmnt.isPresent().then(function (isPresent) {
			if (isPresent) {
				resolve();
			} else {
				reject(new Error("Element should be present"));
			}
		});
	});

}

/**
 * Waits for the element to be present and displayed on the page
 * @param {string} elementSelector
 */
function waitForElement(element) {
	browser.wait(ExpectedConditions.presenceOf(element));
}

defineStep(/verify "(.*?)" is not present$/, async locator => {
	await element(locatorUtil.getLocator(locator).locator)
		.isPresent()
		.then(function (isPresent) {
			if (isPresent) {
				chai.assert(false, "Element is present");
			} else {
				chai.assert(true, "Element should not be present");
			}
		})
		.catch(err => {
			throw err;
		});
});

defineStep(/verify "(.*?)" is visible$/, async locator => {
	await element(locatorUtil.getLocator(locator).locator)
		.isPresent()
		.then(isPresent => {
			if (isPresent) {
				element(locatorUtil.getLocator(locator).locator)
					.isDisplayed()
					.then(function (isVisible) {
						if (isVisible) {
							chai.assert(true, "Element is visible");
						} else {
							chai.assert(false, "Element should not be visible");
						}
					})
					.catch(err => {
						throw err;
					});
			}
		})
		.catch((err) => {
			chai.assert(false, "Element is not present");
			throw err;
		});
});

defineStep(/verify "(.*?)" is not visible$/, (locator, callback) => {
	let elmnt = element(locatorUtil.getLocator(locator).locator);
	ensureElementIsPresent(elmnt).then(() => {
		try {
			element(locatorUtil.getLocator(locator).locator)
				.isDisplayed()
				.then(isVisible => {
					if (isVisible) {
						chai.assert(false, "Element is visible");
						callback(new Error("Element is visible"));
					} else {
						chai.assert(true, "Element should not be visible");
						callback();
					}
				})
				.catch(err => {
					callback(err);
				});
		} catch (error) {
			callback(error);
		}
	}).catch((err) => {
		callback(err);
	})
});

defineStep(/verify "(.*?)" value is "(.*?)"$/, async (locator, value) => {
	if (value.startsWith("${")) {
		value = properties.get(value.substring(2, value.length - 1));
	}
	await element(locatorUtil.getLocator(locator).locator)
		.getAttribute("value")
		.then(valueOfElement => {
			chai.assert(
				valueOfElement === value,
				"value of element should be " + value + ",actual is " + valueOfElement
			);
		});
});

defineStep(/verify "(.*?)" value is not "(.*?)"$/, async (locator, value) => {
	if (value.startsWith("${")) {
		value = properties.get(value.substring(2, value.length - 1));
	}
	await element(locatorUtil.getLocator(locator).locator)
		.getAttribute("value")
		.then(valueOfElement => {
			chai.assert(
				valueOfElement !== value,
				"value of element should not be " + value + ",actual is " + valueOfElement
			);
		});
});

defineStep(/verify "(.*?)" text is "(.*?)"$/, (locator, expectedText, callback) => {
	let elmnt = element(locatorUtil.getLocator(locator).locator);
	ensureElementIsPresent(elmnt).then(() => {
		if (expectedText.startsWith("${")) {
			expectedText = properties.get(expectedText.substring(2, expectedText.length - 1));
		}
		elmnt
			.getText()
			.then(actualText => {
				try {
					chai.assert(actualText === expectedText, actualText + " should be " + expectedText + ", actual is " + actualText);
					callback();
				} catch (error) {
					callback(error);
				}

			});
	}).catch((err) => {
		callback(err);
	});

});

defineStep(/verify "(.*?)" text is not "(.*?)"$/, (locator, expectedText, callback) => {
	let elmnt = element(locatorUtil.getLocator(locator).locator);
	ensureElementIsPresent(elmnt).then(() => {
		if (expectedText.startsWith("${")) {
			expectedText = properties.get(expectedText.substring(2, expectedText.length - 1));
		}
		elmnt
			.getText()
			.then(actualText => {
				try {
					chai.assert(actualText !== expectedText, actualText + " should not be " + expectedText + ", actual is " + actualText);
					callback();
				} catch (error) {
					callback(error);
				}
			});
	}).catch((err) => {
		callback(err);
	});
});

defineStep(/verify link with text "(.*?)" is present$/, (link, callback) => {
	let elmnt = element(by.linkText(link));
	expect(elmnt.isPresent()).to.eventually.equal(true).and.notify(callback);
	// ensureElementIsPresent(elmnt).then(() => {
	// }).catch((err) => {
	//   callback(err);
	// })
});

defineStep(/verify link with partial text "(.*?)" is present$/, (link, callback) => {

	let elmnt = element(by.partialLinkText(link));
	expect(elmnt.isPresent()).to.eventually.equal(true).and.notify(callback);
	// ensureElementIsPresent(elmnt).then(() => {
	// }).catch((err) => {
	//   callback(err);
	// })
});

defineStep(/switch to frame "(.*?)"$/, async nameOrIndex => {
	try {
		let ele = element(locatorUtil.getLocator(nameOrIndex).locator).getWebElement();
		await browser.switchTo().frame(ele);
	} catch (error) {
		await browser.switchTo().frame(nameOrIndex);
	}
});

defineStep(/switch to default content$/, async () => {
	await browser.switchTo().defaultContent();
});

defineStep(/wait until "(.*?)" to be present$/, async loc => {
	let ele = element(locatorUtil.getLocator(loc).locator);
	await browser.wait(
		ExpectedConditions.presenceOf(ele),
		5000,
		"Element taking too long to appear in the DOM"
	);
});

defineStep(/wait until "(.*?)" to be visible$/, async loc => {
	let ele = element(locatorUtil.getLocator(loc).locator);
	await browser.driver.wait(
		ExpectedConditions.visibilityOf(ele),
		5000,
		"Element taking too long to appear in the DOM"
	);
});
defineStep(/type Enter "(.*?)"$/, async locator => {
	await element(locatorUtil.getLocator(locator).locator)
		.sendKeys(protractor.Key.ENTER)
		.then(() => { })
		.catch(err => {
			throw err;
		});
});
defineStep(/close "(.*?)"$/,  async url => {
    await browser.driver.close();
});
defineStep(/switchWindow "(.*?)"$/,  async index => {
    await browser.driver.getAllWindowHandles().then((windowArray) => {
         browser.driver.switchTo().window(windowArray[index]);
    });
});
defineStep(/wait for "(.*?)" millisec$/,  async time => {
	if(time && /^[0-9]*$/mg.test(time.trim())){
		await browser.driver.sleep(time).then(() => { }).catch(err => {throw err;});
	}else{
		throw 'Invalid Input : '+time;
	}
});
defineStep(/maximizeWindow "(.*?)"$/,  async url => {
    await browser.driver.manage().window().maximize();
});
defineStep(/drag "(.*?)" and drop on "(.*?)" perform$/, async (source, target) => {
	// await browser.actions().dragAndDrop(element(locatorUtil.getLocator(source).locator),element(locatorUtil.getLocator(target).locator)).mouseUp(element(locatorUtil.getLocator(target).locator)).perform()
	// 	.then(() => {}).catch(err => {throw err;});
	await browser.executeScript(jsScript() + "simulateDragDrop(arguments[0], arguments[1])", element(locatorUtil.getLocator(source).locator),element(locatorUtil.getLocator(target).locator))
	.then(() => { })
	.catch(err => {
		throw err;
	});
	await browser.driver.actions().mouseDown(element(locatorUtil.getLocator(source).locator)).mouseMove(element(locatorUtil.getLocator(target).locator)).mouseUp().perform()
		.then(() => { })
		.catch(err => {
			throw err;
		});
});
defineStep(/offset drag "(.*?)" and drop on "(.*?)" and "(.*?)"$/, async (source, xOffSet , yOffSet) => {
	await browser.actions().dragAndDrop(element(locatorUtil.getLocator(source).locator), { x: parseInt(xOffSet), y: parseInt(yOffSet) }).mouseUp().perform()
		.then(() => { }).catch(err => {throw err;});
});
defineStep(/drag "(.*?)" and drop on value "(.*?)" perform$/, async (source, jsvalue) => {
	let jsValueScript ="arguments[0].setAttribute('value',"+jsvalue+");if(typeof(arguments[0].onchange) === 'function'){arguments[0].onchange('');}";
	await browser.executeScript(jsValueScript, element(locatorUtil.getLocator(source).locator)).then(() => { }).catch(err => {throw err;});
});
