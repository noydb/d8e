const { copyFileSync, cpSync, existsSync, mkdirSync } = require('fs');
const { basename, join, relative } = require('path');

const { log } = require('./util/log');

function copyFonts(css, basePath, outputDir) {
  const fontRegex = /url\(['"]?([^'"]+\.(woff2?|eot|ttf|otf))['"]?\)/g;
  const copiedFonts = new Set();
  const fontOutputDir = join(outputDir, 'asset', 'font');

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
        log('error', `Error copying font ${ fullPath }: ${ err }`);
        return match;
      }
    }

    const relativeFontPath = relative(outputDir, join(fontOutputDir, fontName)).replace(/\\/g, '/');
    return `url('${ relativeFontPath }')`;
  });
}

function copyImages(basePath, outputPath) {
  const imgInputDir = join(basePath, 'asset', 'img');
  const imgOutputDir = join(outputPath, 'asset', 'img');

  cpSync(imgInputDir, imgOutputDir, { recursive: true });

  // TODO: if/when needed, implement more relative/flexible image paths.
  //  right now, images must be stored inside inputDirectory/asset/img
  //  so we can just copy them across as is, and the img src paths
  //  remain consistent/valid.
  // const imgRegex = /<img\s+[^>]*src=["']([^"']+\.(png|jpg|jpeg|gif|svg))["'][^>]*>/g;
  // const copiedImages = new Set();

  //
  // if (!existsSync(imgOutputDir)) {
  //   mkdirSync(imgOutputDir, { recursive: true });
  // }
  //
  // return html.replace(imgRegex, (match, imgPath) => {
  //   const fullPath = join(basePath, imgPath);
  //   const imgName = basename(imgPath);
  //   const imgOutputPath = join(imgOutputDir, imgPath);
  //   console.log({ imgOutputPath });
  //
  //   // console.log(imgOutputPath);
  //
  //   if (!copiedImages.has(imgName)) {
  //     try {
  //       copyFileSync(fullPath, imgOutputPath);
  //       copiedImages.add(imgName);
  //     } catch (err) {
  //       console.error(`Error copying image ${ fullPath }:`, err);
  //       return match; // If there's an error, leave the original <img> tag unchanged
  //     }
  //   }
  //
  //   console.log({ imgPath });

  // console.log({ ttttt: dirname(outputPath), imgOutputPath, ddd: relative(dirname(outputPath), imgOutputPath) });
  // const relativeImgPath = relative(dirname(outputPath), imgPath).replace(/\\/g, '/');
  // console.log(relativeImgPath);

  // return imgPath;
  // return match.replace(imgPath);
  // });
}

module.exports = { copyFonts, copyImages };
