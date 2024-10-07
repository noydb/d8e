const { existsSync, mkdirSync, readFile, writeFile, readdirSync, statSync, readFileSync } = require('fs');
const { join, dirname, extname, relative } = require('path');

const { throwAndExit } = require('./src/util/error');
const { log, printSecondsTaken } = require('./src/util/log');

const { copyImages } = require('./src/asset');
const { inlineAndMinifyJS, inlineAndMinifyCSS } = require('./src/inliner');
const { minifyHTML } = require('./src/minify');

log('info', 'd8e 0.3.0 starting');
const startTime = performance.now();

const CONFIG_FILE_NAME = '.d8e';
const CONFIG_FILE_PATH = `./${ CONFIG_FILE_NAME }`;
let config;
try {
  const configData = readFileSync(CONFIG_FILE_PATH, 'utf8');
  config = JSON.parse(configData);

  log('info', `Successfully parsed config file (${ CONFIG_FILE_NAME })`);
} catch (error) {
  throwAndExit(`Error while reading config file (${ CONFIG_FILE_NAME }): ${ error.message }`);
}

const cwd = process.cwd();

const outputDir = join(cwd, config.outputDirectory);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

copyImages(config.inputDirectory, outputDir);

function processHTMLFile(inputPath, outputPath) {
  readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      throwAndExit(`Error reading HTML file: ${ inputPath }. ${ err }`);
    }

    const basePath = dirname(inputPath);

    let processedHTML = inlineAndMinifyCSS(data, basePath, outputDir);
    processedHTML = inlineAndMinifyJS(processedHTML, basePath);
    processedHTML = minifyHTML(processedHTML);

    const outputFileDir = dirname(outputPath);
    if (!existsSync(outputFileDir)) {
      mkdirSync(outputFileDir, { recursive: true });
    }

    writeFile(outputPath, processedHTML, (err) => {
      if (err) {
        throwAndExit(`Error writing HTML file ${ outputPath }: ${ err }`);
      }
    });
  });
}

const fullInputPath = join(cwd, config.inputDirectory);
const processedFiles = [];

function processDirectory(dir) {
  readdirSync(dir).forEach(file => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (extname(file).toLowerCase() === '.html') {
      const relativePath = relative(fullInputPath, fullPath);
      processHTMLFile(fullPath, join(outputDir, relativePath));

      processedFiles.push(fullPath);
    }
  });
}

processDirectory(fullInputPath);

for (const processedFile of processedFiles) {
  log('info', `processed HTML file ${ processedFile }`);
}

printSecondsTaken(startTime);
