const { existsSync, mkdirSync, readdirSync, rm, statSync } = require('fs');
const { join, extname, relative } = require('path');

const { getConfig } = require('./src/util/config-file-parser');
const { throwAndExit } = require('./src/util/error');
const { log, printSecondsTaken } = require('./src/util/log');

const { copyImages } = require('./src/asset');
const { processHTMLFile } = require('./src/html');

const startTime = performance.now();
const action = process.argv[2];
if (action === 'version') {
  log('info', 'd8e VERSION: 0.4.1');
  printSecondsTaken(startTime);
  return;
}

log('info', 'd8e 0.4.1 starting\n');

if (action !== 'build' && action !== 'b') {
  throwAndExit(`Unexpected action: '${ action }', expected 'build' or 'b'`);
}

const { inputDirectory, outputDirectory } = getConfig();
if (!existsSync(inputDirectory)) {
  throwAndExit(`The specified input directory does not exist: ${ inputDirectory }`);
}

const cwd = process.cwd();

const outputDir = join(cwd, outputDirectory);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
} else {
  rm(outputDir, { recursive: true }, (err) => {
    if (err) {
      log('error', `Error removing output directory: ${ err }`);
    }
  });
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
