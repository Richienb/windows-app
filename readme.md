# windows-app

Automate Windows applications.

## Install

```sh
npm install windows-app
```

This module vendors [Windows Application Driver](https://github.com/microsoft/WinAppDriver#readme). You will need to [enable developer mode](https://docs.microsoft.com/windows/apps/get-started/enable-your-device-for-development#activate-developer-mode-sideload-apps-and-access-other-developer-features) yourself.

## Usage

```js
import windowsApp from 'windows-app';

const {select, close} = await windowsApp('Microsoft.WindowsCalculator_8wekyb3d8bbwe!App'); // Calculator app

await select.name_('One').click();
await select.name_('Plus').click();
await select.name_('Two').click();
await select.name_('Equals').click();
const result = Number((await select.accessibilityId('CalculatorResults').getText()).replace('Display is', ''));

console.log(`The result of 1 + 2 is ${result}`);
//=> 'The result of 1 + 2 is 3'

await close();
```

## API

### windowsApp(appId, options?)

Launch the specified application and provide options to manipulate it.

Only one application can be launched at a time.

#### appId

Type: `string`

The path to an exe file or the id of a UWP.

#### options

Type: `object`

##### timeout

Type: `integer | false`\
Default: `10000`

The timeout for interactions with elements and application startup in milliseconds. Set to `false` to disable.

#### Return value

##### select.xPath(xPath)

##### select.class(class_)

##### select.id(id)

##### select.name_(name)

##### select.accessibilityId(accessibilityId)

Select an element in the launched application.

##### driver

The [`selenium-appium`](https://github.com/react-native-windows/selenium-appium#readme) driver for lower-level testing.

##### close()

Close the application and end all associated processes. Returns a promise that resolves when completed.

## Tips

- Use [Accessibility Insights](https://accessibilityinsights.io) to inspect applications in order to get element names.
