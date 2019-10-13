import fs from 'fs';

let env;

if (process.env.ENV) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  env = require(`./env.${process.env.ENV.trim()}.json`);
} else {
  // eslint-disable-next-line global-require
  env = require('./env.json');
}

const frontEnv = {
  apiUrl: env.apiUrl || '/api',
};

fs.writeFileSync('./src/front.env.json', JSON.stringify(frontEnv, null, 2));

