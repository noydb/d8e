const { existsSync, mkdirSync, readFile, writeFile, readdirSync, statSync } = require('fs');
const { join, dirname, extname, relative } = require('path');

const { copyImages } = require('./src/asset');
const { inlineAndMinifyJS, inlineAndMinifyCSS } = require('./src/inliner');
const { minifyHTML } = require('./src/minify');

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Please provide an input directory as a command line argument.');
  process.exit(1);
}

const cwd = process.cwd();

const outputDir = join(cwd, 'dist');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

copyImages(inputDir, outputDir);

function processHTMLFile(inputPath, outputPath) {
  readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading the file ${ inputPath }:`, err);
      return;
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
        console.error(`Error writing the file ${ outputPath }:`, err);
        return;
      }

      console.log(`Processed and saved: ${ outputPath }`);
    });
  });
}

const fullInputPath = join(cwd, inputDir);

function processDirectory(dir) {
  readdirSync(dir).forEach(file => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (extname(file).toLowerCase() === '.html') {
      const relativePath = relative(fullInputPath, fullPath);
      processHTMLFile(fullPath, join(outputDir, relativePath));
    }
  });
}

processDirectory(fullInputPath);

console.log(`Processing HTML files from ${ fullInputPath }`);
console.log(`Output directory: ${ outputDir }`);
