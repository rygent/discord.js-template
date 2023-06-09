import 'dotenv/config';

import BaseClient from '#lib/BaseClient.js';
import * as Configuration from '#lib/Configuration.js';

const client = new BaseClient(Configuration);
void client.start();
