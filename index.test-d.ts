import {expectType} from 'tsd';
import windowsApp from './index.js';

const {select, close} = await windowsApp('Microsoft.WindowsCalculator_8wekyb3d8bbwe!App');

await select.name_('One').click();
await select.name_('Plus').click();
await select.name_('Two').click();
await select.name_('Equals').click();

expectType<string>(await select.accessibilityId('CalculatorResults').getText());

await close();
