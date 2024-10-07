function log(type, arg) {
  const output = arg;
  switch (type) {
    case 'info':
      console.info('INFO: ' + output);
      break;
    case 'error':
      console.error('ERROR: ' + output);
      break;
    case 'success':
      console.info('SUCCESS: ' + output);
      break;
    case 'warn':
      console.warn('WARN: ' + output);
      break;
    case 'test':
      console.info('TEST: ' + output);
      break;
    case '':
      console.log(arg);
  }
}

function printSecondsTaken(startTime) {
  log('', '');

  const millisTaken = performance.now() - startTime;
  const secondsTaken = (millisTaken / 1000).toFixed(2);

  log('info', `Process complete in ${ secondsTaken + 's' }.`);
}

module.exports = {
  log,
  printSecondsTaken
};
