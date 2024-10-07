const { log } = require('./log');

function throwAndExit(message) {
  log('error', `Invalid CLI command. ${ message }`);
  log('', '');
  log('error', 'Process exited due to error (code: 1).');
  process.exit(1);
}

module.exports = { throwAndExit };
