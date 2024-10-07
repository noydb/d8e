const { cpSync } = require('fs');
const { basename, join, dirname, relative } = require('path');

function updateFontPaths(css, basePath, outputDir, outputFileDir) {
  const fontRegex = /url\(['"]?([^'"]+\.(woff2?|eot|ttf|otf))['"]?\)/g;

  return css.replace(fontRegex, (match, fontPath) => {
    const fontTargetDirectory = join(outputDir, 'asset', 'font');

    const relativeTargetDirectory = relative(outputFileDir, fontTargetDirectory);
    const fontFileName = basename(fontPath);
    const fontParentDirectoryName = basename(dirname(fontPath));

    return `url('${ relativeTargetDirectory }/${ fontParentDirectoryName }/${ fontFileName }')`;
  });
}

function copyFonts(basePath, outputPath) {
  const inputDir = join(basePath, 'asset', 'font');
  const outputDir = join(outputPath, 'asset', 'font');

  cpSync(inputDir, outputDir, { recursive: true });
}

function copyImages(basePath, outputPath) {
  const imgInputDir = join(basePath, 'asset', 'img');
  const imgOutputDir = join(outputPath, 'asset', 'img');

  cpSync(imgInputDir, imgOutputDir, { recursive: true });

  // TODO: if/when needed, implement more relative/flexible image paths.
  //  right now, images must be stored inside inputDirectory/asset/img
  //  so we can just copy them across as is, and the img src paths
  //  remain consistent/valid.
}

module.exports = { copyFonts, copyImages, updateFontPaths };
