import { By2, WebDriver2 } from "selenium-appium"

declare namespace windowsApp {
	/**
	Select an element in the launched application.
	*/
	export declare const select: {
		/**
		Select an element in the launched application by css selector.
		@param selector The css selector.
		*/
		(selector: string): By2

		/**
		Select an element in the launched application by xpath.
		@param xPath The xPath.
		*/
		xPath(xPath: string): By2

		/**
		Select an element in the launched application by class.
		@param class_ The class.
		*/
		class(class_: string): By2

		/**
		Select an element in the launched application by id.
		@param id The id.
		*/
		id(id: string): By2

		/**
		Select an element in the launched application by name.
		@param name The name.
		*/
		name_(name: string): By2

		/**
		Select an element in the launched application by accessibility id.
		@param accessibilityId The accessibility id.
		*/
		accessibilityId(accessibilityId: string): By2
	}

	export interface Options {
		/**
		The timeout for interactions with elements and application startup in milliseconds. Set to `false` to disable.
		@default 10000
		*/
		timeout?: number | false
	}
}

/**
Launch the specified application and provide options to manipulate it.

Only one application can be launched at a time.
@param appId The path to an exe file or the id of a UWP.
@example
```
const windowsApp = require("windows-app")

const {select, close} = await windowsApp("Microsoft.WindowsCalculator_8wekyb3d8bbwe!App") // Calculator app

await select.name_("One").click()
await select.name_("Plus").click()
await select.name_("Two").click()
await select.name_("Equals").click()
const result = Number((await select.accessibilityId("CalculatorResults").getText()).replace("Display is", ""))

console.log(`The result of 1 + 2 is ${result}`)
//=> "The result of 1 + 2 is 3"

await close()
```
*/
declare function windowsApp(appId: string, options?: windowsApp.Options): Promise<{
	select: typeof windowsApp.select

	/**
	The [`selenium-appium`](https://github.com/react-native-windows/selenium-appium#readme) driver.
	*/
	driver: WebDriver2

	/**
	Close the application and end all associated processes.
	@returns A promise that resolves when completed.
	*/
	close(): Promise<void>
}>

export = windowsApp
