const { copyFileSync } = require('fs');
const { join, basename } = require('path');

function copyFonts(css, basePath, outputDir) {
  const fontRegex = /url\(['"]?([^'"]+\.(woff2?|eot|ttf|otf))['"]?\)/g;
  const copiedFonts = new Set();

  return css.replace(fontRegex, (match, fontPath) => {
    const fullPath = join(basePath, fontPath);
    const fontName = basename(fontPath);
    const outputPath = join(outputDir, fontName);

    if (!copiedFonts.has(fontName)) {
      try {
        copyFileSync(fullPath, outputPath);
        copiedFonts.add(fontName);
        console.log(`Copied font: ${fontName}`);
      } catch (err) {
        console.error(`Error copying font ${fullPath}:`, err);
        return match;
      }
    }

    return `url('${fontName}')`;
  });
}

function copyImages(html, basePath, outputDir) {
  const imgRegex = /<img\s+[^>]*src=["']([^"']+\.(png|jpg|jpeg|gif|svg))["'][^>]*>/g;
  const copiedImages = new Set();

  return html.replace(imgRegex, (match, imgPath) => {
    const fullPath = join(basePath, imgPath);
    const imgName = basename(imgPath);
    const outputPath = join(outputDir, imgName);

    if (!copiedImages.has(imgName)) {
      try {
        copyFileSync(fullPath, outputPath);
        copiedImages.add(imgName);
      } catch (err) {
        console.error(`Error copying image ${ fullPath }:`, err);
        return match; // If there's an error, leave the original <img> tag unchanged
      }
    }

    // Update the src attribute to point to the new location
    return match.replace(imgPath, imgName);
  });
}

module.exports = { copyFonts, copyImages };
