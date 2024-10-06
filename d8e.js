const { existsSync, mkdirSync, readFile, writeFile } = require('fs');
const { join, dirname } = require('path');

const { copyImages } = require('./src/asset');
const { inlineAndMinifyJS, inlineAndMinifyCSS } = require('./src/inliner');
const { minifyHTML } = require('./src/minify');

const inputPath = join(__dirname, '..', 'src', 'index.html');
const outputDir = join(__dirname, '..', 'dist');
const outputPath = join(outputDir, 'index.html');

// Ensure the dist directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const basePath = dirname(inputPath);

  let processedHTML = inlineAndMinifyCSS(data, basePath, outputDir);
  processedHTML = inlineAndMinifyJS(processedHTML, basePath);
  processedHTML = copyImages(processedHTML, basePath, outputDir);
  processedHTML = minifyHTML(processedHTML);

  // Write the processed HTML to dist/index.html
  writeFile(outputPath, processedHTML, (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log(`The processed HTML has been saved to ${ outputDir }`);
  });
});
