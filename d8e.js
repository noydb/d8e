const { existsSync, mkdirSync, readFile, writeFile, readdirSync, statSync } = require('fs');
const { join, dirname, extname, relative } = require('path');

// Use __dirname to resolve local module paths
const { copyImages } = require(join(__dirname, 'src', 'asset'));
const { inlineAndMinifyJS, inlineAndMinifyCSS } = require(join(__dirname, 'src', 'inliner'));
const { minifyHTML } = require(join(__dirname, 'src', 'minify'));

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Please provide an input directory as a command line argument.');
  process.exit(1);
}

// Use current working directory for input and output
const cwd = process.cwd();
const fullInputPath = join(cwd, inputDir);
const outputDir = join(cwd, 'dist');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

function processHTMLFile(inputPath, outputPath) {
  readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading the file ${ inputPath }:`, err);
      return;
    }

    const basePath = dirname(inputPath);

    let processedHTML = inlineAndMinifyCSS(data, basePath, outputDir);
    processedHTML = inlineAndMinifyJS(processedHTML, basePath);
    processedHTML = copyImages(processedHTML, basePath, outputDir);
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

function processDirectory(dir) {
  readdirSync(dir).forEach(file => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (extname(file).toLowerCase() === '.html') {
      const relativePath = relative(fullInputPath, fullPath);
      const outputPath = join(outputDir, relativePath);
      processHTMLFile(fullPath, outputPath);
    }
  });
}

processDirectory(fullInputPath);

console.log(`Processing HTML files from ${ fullInputPath }`);
console.log(`Output directory: ${ outputDir }`);
