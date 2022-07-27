import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {By2 as by2, driver, windowsAppDriverCapabilities, Config as config} from 'selenium-appium';
import getPort, {portNumbers} from 'get-port';
import {pEvent} from 'p-event';

const startDirectory = path.dirname(fileURLToPath(import.meta.url));

const winAppDriverPath = path.join(startDirectory, 'vendor', 'Windows Application Driver', 'WinAppDriver.exe');

function toString(data) {
	if (data && data.byteLength > 0 && data.byteLength % 2 === 0 && data[1] === 0) {
		return data.toString('utf16le');
	}

	return data.toString();
}

async function launchAppDriver(port) {
	const instance = spawn(winAppDriverPath, [port], {cwd: path.dirname(winAppDriverPath)});

	await pEvent(instance.stdout, 'data', stdout => toString(stdout).includes('listening for requests'));

	return instance;
}

const ports = (function * () {
	while (true) {
		yield * portNumbers(1025, 65_535);
	}
})();

export default async function windowsApp(appId, {timeout = 10_000} = {}) {
	if ((!Number.isInteger(timeout) && timeout > 0) || timeout === false) {
		throw new TypeError('`timeout` was not a positive integer or false!');
	}

	if (timeout === false) {
		timeout = 0;
	}

	config.setWaitForTimeout(timeout);
	config.setWaitForPageTimeout(timeout);

	const port = await getPort({port: ports});
	const appDriver = await launchAppDriver(port);
	await driver.startWithCapabilities(windowsAppDriverCapabilities(appId), `http://localhost:${port}`);

	const select = {
		xPath: xPath => by2.nativeXpath(xPath, driver),
		class: class_ => by2.nativeClass(class_, driver),
		id: id => by2.nativeId(id, driver),
		name_: name => by2.nativeName(name, driver),
		accessibilityId: accessibilityId => by2.nativeAccessibilityId(accessibilityId, driver),
	};

	return {
		select,
		driver,
		async close() {
			await driver.quit();
			appDriver.kill();
		},
	};
}
