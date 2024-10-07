const { copyFileSync, existsSync, mkdirSync } = require('fs');
const { basename, join, relative } = require('path');

function copyFonts(css, basePath, outputDir) {
  const fontRegex = /url\(['"]?([^'"]+\.(woff2?|eot|ttf|otf))['"]?\)/g;
  const copiedFonts = new Set();
  const fontOutputDir = join(outputDir, 'font');

  if (!existsSync(fontOutputDir)) {
    mkdirSync(fontOutputDir, { recursive: true });
  }

  return css.replace(fontRegex, (match, fontPath) => {
    const fullPath = join(basePath, fontPath);
    const fontName = basename(fontPath);
    const outputPath = join(fontOutputDir, fontName);

    if (!copiedFonts.has(fontName)) {
      try {
        copyFileSync(fullPath, outputPath);
        copiedFonts.add(fontName);
      } catch (err) {
        console.error(`Error copying font ${ fullPath }:`, err);
        return match;
      }
    }

    const relativeFontPath = relative(outputDir, join(fontOutputDir, fontName)).replace(/\\/g, '/');
    return `url('${ relativeFontPath }')`;
  });
}

function copyImages(html, basePath, outputPath) {
  const imgRegex = /<img\s+[^>]*src=["']([^"']+\.(png|jpg|jpeg|gif|svg))["'][^>]*>/g;
  const copiedImages = new Set();
  const imgOutputDir = join(outputPath, 'img');

  if (!existsSync(imgOutputDir)) {
    mkdirSync(imgOutputDir, { recursive: true });
  }

  return html.replace(imgRegex, (match, imgPath) => {
    const fullPath = join(basePath, imgPath);
    const imgName = basename(imgPath);
    const imgOutputPath = join(imgOutputDir, imgName);

    if (!copiedImages.has(imgName)) {
      try {
        copyFileSync(fullPath, imgOutputPath);
        copiedImages.add(imgName);
      } catch (err) {
        console.error(`Error copying image ${ fullPath }:`, err);
        return match; // If there's an error, leave the original <img> tag unchanged
      }
    }

    const relativeImgPath = relative(outputPath, imgOutputPath).replace(/\\/g, '/');
    return match.replace(imgPath, relativeImgPath);
  });
}

module.exports = { copyFonts, copyImages };
