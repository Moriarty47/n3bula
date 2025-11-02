import { GM_addStyle } from '$';

import '../lib/toast';
import inject from './inject';
import { log, getConfig, setConfig } from './utils';

import style from './style.css?raw';

GM_addStyle(style);
// initialize
setConfig(getConfig());
