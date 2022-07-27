import windowsApp from './index.js';

const {select, close} = await windowsApp('Microsoft.WindowsCalculator_8wekyb3d8bbwe!App');

await select.name_('One').click();
await select.name_('Plus').click();
await select.name_('Two').click();
await select.name_('Equals').click();
const rawResults = await select.accessibilityId('CalculatorResults').getText();
const result = Number(rawResults.replace('Display is', ''));

console.log(`The result of 1 + 2 is ${result}`);

await close();
