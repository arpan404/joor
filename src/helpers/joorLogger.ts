import * as nodePath from 'node:path';

import Logger from '@/packages/logger';
// Logger instance to be used for logging inside the application.
const logger = new Logger({
  name: 'Joor',
  path: nodePath.resolve(process.cwd(), 'logs', 'joor.log'),
  flushInterval: 60 * 1000, // Flushes logs every 60 seconds
});

export default logger;
