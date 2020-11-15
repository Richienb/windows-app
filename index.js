"use strict"

const { By2: by2, driver, windowsAppDriverCapabilities, Config: config } = require("selenium-appium")
const { main: appium } = require("appium")
const getPort = require("get-port")
const cssSelectorToXPath = require("css-to-xpath")

let driverActive = false

module.exports = async (appId, { timeout = 10000 } = {}) => {
	if (driverActive) {
		throw new Error("Driver is currently in use! Close it before using another one.")
	}

	if ((!Number.isInteger(timeout) && timeout > 0) || timeout === false) {
		throw new TypeError("`timeout` was not a positive integer or false!")
	}

	if (timeout === false) {
		timeout = 0
	}

	config.setWaitForTimeout(timeout)
	config.setWaitForPageTimeout(timeout)

	const port = await getPort({ port: 4723 })
	const server = await appium({
		port,
		throwInsteadOfExit: true,
		loglevel: "error"
	})
	await driver.startWithCapabilities(windowsAppDriverCapabilities(appId), `http://localhost:${port}/wd/hub`)

	driverActive = true

	const select = selector => by2.nativeXpath(cssSelectorToXPath(selector), driver)
	select.xPath = xPath => by2.nativeXpath(xPath, driver)
	select.class = class_ => by2.nativeClass(class_, driver)
	select.id = id => by2.nativeId(id, driver)
	select.name_ = name => by2.nativeName(name, driver)
	select.accessibilityId = accessibilityId => by2.nativeAccessibilityId(accessibilityId, driver)

	return {
		select,
		driver,
		async close() {
			await driver.quit()
			await server.close()
			driverActive = false
		}
	}
}
