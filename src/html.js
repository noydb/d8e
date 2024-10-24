const { existsSync, mkdirSync, readFile, writeFile } = require('fs');
const { dirname } = require('path');

const { throwAndExit } = require('./util/error');

const { inlineAndMinifyCSS, inlineAndMinifyJS } = require('./inliner');
const { minifyHTML } = require('./minify');

function processHTMLFile(fileInputPath, fileOutputPath, outputDirectory) {
  readFile(fileInputPath, 'utf8', (err, data) => {
    if (err) {
      throwAndExit(`Error reading HTML file ${ fileInputPath }: ${ err }`);
    }

    const basePath = dirname(fileInputPath);
    const outputFileDir = dirname(fileOutputPath);
    if (!existsSync(outputFileDir)) {
      mkdirSync(outputFileDir, { recursive: true });
    }

    let processedHTML = inlineAndMinifyCSS(data, basePath, outputDirectory, outputFileDir);
    processedHTML = inlineAndMinifyJS(processedHTML, basePath);
    processedHTML = minifyHTML(processedHTML);

    writeFile(fileOutputPath, processedHTML, (err) => {
      if (err) {
        throwAndExit(`Error writing HTML file ${ fileOutputPath }: ${ err }`);
      }
    });
  });
}

module.exports = {
  processHTMLFile
};
