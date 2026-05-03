import { listen } from '../../src/runtime/node.js';
import config from './joor.config.js';
import chat from './rpc/ai/chat.rpc.js';
import check from './rpc/health/check.rpc.js';
import getUser from './rpc/users/get.rpc.js';
import searchUsers from './rpc/users/search.rpc.js';

const manifest = {
  procedures: {
    'ai.chat': chat,
    'health.check': check,
    'users.get': getUser,
    'users.search': searchUsers,
  },
};

listen(manifest, {
  ...config,
  port: 3000,
});

console.info('Joor example listening on http://localhost:3000/rpc');
