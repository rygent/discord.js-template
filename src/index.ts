import 'dotenv/config';

import BaseClient from './structures/BaseClient.js';
import * as Configuration from './lib/Configuration.js';

const client = new BaseClient(Configuration);
void client.start();
