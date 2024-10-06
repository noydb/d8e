const { dirname, join } = require('path');
const { readFileSync } = require('fs');

const { copyFonts } = require('./asset');
const { minifyCSS, minifyJS } =  require('./minify');

function inlineAndMinifyCSS(html, basePath, outputDir) {
  const cssRegex = /<link\s+[^>]*href=["']([^"']+\.css)["'][^>]*>/g;

  return html.replace(cssRegex, (match, cssPath) => {
    const fullPath = join(basePath, cssPath);
    try {
      let cssContent = readFileSync(fullPath, 'utf8');
      cssContent = copyFonts(cssContent, dirname(fullPath), outputDir);
      cssContent = minifyCSS(cssContent);
      return `<style>${ cssContent }</style>`;
    } catch (err) {
      console.error(`Error reading CSS file ${ fullPath }:`, err);
      return match;
    }
  });
}

function inlineAndMinifyJS(html, basePath) {
  const jsRegex = /<script\s+[^>]*src=["']([^"']+\.js)["'][^>]*><\/script>/g;

  return html.replace(jsRegex, (match, jsPath) => {
    const fullPath = join(basePath, jsPath);
    try {
      let jsContent = readFileSync(fullPath, 'utf8');
      jsContent = minifyJS(jsContent);
      return `<script>${ jsContent }</script>`;
    } catch (err) {
      console.error(`Error reading JS file ${ fullPath }:`, err);
      return match;
    }
  });
}

module.exports = {
  inlineAndMinifyCSS,
  inlineAndMinifyJS
};
