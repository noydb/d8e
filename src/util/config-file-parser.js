const { readFileSync } = require('fs');

const { throwAndExit } = require('./error');
const { log } = require('./log');

function getConfig() {
  const CONFIG_FILE_NAME = '.d8e';
  const CONFIG_FILE_PATH = `./${ CONFIG_FILE_NAME }`;

  try {
    const configData = readFileSync(CONFIG_FILE_PATH, 'utf8');
    const config = JSON.parse(configData);

    log('info', `parsed config file (${ CONFIG_FILE_NAME })`);

    return config;
  } catch (error) {
    throwAndExit(`Error while reading config file (${ CONFIG_FILE_NAME }): ${ error.message }`);
  }
}

module.exports = { getConfig };
