const { dirname, join } = require('path');
const { readFileSync } = require('fs');

const { log } = require('./util/log');

const { updateFontPaths } = require('./asset');
const { minifyCSS, minifyJS } = require('./minify');

function inlineAndMinifyCSS(html, basePath, outputDir, outputFileDir) {
  const cssRegex = /<link\s+[^>]*href=["']([^"']+\.css)["'][^>]*>/g;

  return html.replace(cssRegex, (match, cssPath) => {
    const fullPath = join(basePath, cssPath);
    try {
      let cssContent = readFileSync(fullPath, 'utf8');
      cssContent = updateFontPaths(cssContent, dirname(fullPath), outputDir, outputFileDir);
      cssContent = minifyCSS(cssContent);
      return `<style>${ cssContent }</style>`;
    } catch (err) {
      log('error', `Error reading CSS file ${ fullPath }: ${ err }`);
    }
  });
}

function inlineAndMinifyJS(html, basePath) {
  const jsRegex = /<script\s+[^>]*src=["']([^"']+\.js)["'][^>]*><\/script>/g;

  return html.replace(jsRegex, (match, jsPath) => {
    if (jsPath.startsWith('https://')) {
      return match;
    }

    const fullPath = join(basePath, jsPath);
    try {
      let jsContent = readFileSync(fullPath, 'utf8');
      jsContent = minifyJS(jsContent);
      return `<script>${ jsContent }</script>`;
    } catch (err) {
      log('error', `Error reading JS file ${ fullPath }: ${ err }`);
      return match;
    }
  });
}

module.exports = {
  inlineAndMinifyCSS,
  inlineAndMinifyJS
};
