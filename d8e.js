const { existsSync, mkdirSync, readdirSync, statSync } = require('fs');
const { join, extname, relative } = require('path');

const { getConfig } = require('./src/util/config-file-parser');
const { throwAndExit } = require('./src/util/error');
const { log, printSecondsTaken } = require('./src/util/log');

const { copyImages } = require('./src/asset');
const { processHTMLFile } = require('./src/html');

const startTime = performance.now();
const action = process.argv[2];
if (action === 'version') {
  log('info', 'd8e VERSION: 0.4.0');
  printSecondsTaken(startTime);
  return;
}

log('info', 'd8e 0.4.0 starting\n');

const validActions = ['build', 'help', 'version'];
if (!validActions.includes(action)) {
  throwAndExit(`Unexpected action: '${ action }', expected one of: ${ validActions.join(', ') }`);
}

const { inputDirectory, outputDirectory } = getConfig();
if (!existsSync(inputDirectory)) {
  throwAndExit(`The specified input directory does not exist: ${ inputDirectory }`);
}

const cwd = process.cwd();

const outputDir = join(cwd, outputDirectory);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

copyImages(inputDirectory, outputDir);

const fullInputPath = join(cwd, inputDirectory);
const processedFiles = [];

function processDirectory(dir) {
  readdirSync(dir).forEach(file => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (extname(file).toLowerCase() === '.html') {
      const relativePath = relative(fullInputPath, fullPath);
      processHTMLFile(fullPath, join(outputDir, relativePath), outputDirectory);

      processedFiles.push(fullPath);
    }
  });
}

processDirectory(fullInputPath);

for (const processedFile of processedFiles) {
  log('info', `processed HTML file ${ processedFile }`);
}

printSecondsTaken(startTime);
