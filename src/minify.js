function minifyCSS(css) {
  return css
    .replace(/\/\*(?![\s\S]*?@preserve)[\s\S]*?\*\//g, '') // Remove comments, but keep those with @preserve
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/^\s+|\s+$/g, '') // Trim start and end
    .replace(/\s*([:;{}])\s*/g, '$1') // Remove spaces around :;{}
    .replace(/;}/g, '}'); // Remove last semicolon of a rule
}

function minifyHTML(html) {
  return html
    .replace(/<!--(?![\s\S]*?@preserve)[\s\S]*?-->/g, '') // Remove comments, but keep those with @preserve
    .replace(/(^\s+|\s+$)/gm, '') // Trim each line
    .replace(/\n/g, '') // Remove newlines
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
    .replace(/>\s+</g, '><'); // Remove spaces between tags
}

function minifyJS(js) {
  return js
    .replace(/\/\*(?![\s\S]*?@preserve)[\s\S]*?\*\/|\/\/.*$/gm, '') // Remove comments, but keep those with @preserve
    .replace(/(^\s+|\s+$)/gm, '') // Trim each line
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
    .replace(/\s*([=:+\-*/<>])\s*/g, '$1'); // Remove spaces around operators
}

module.exports = {
  minifyHTML,
  minifyCSS,
  minifyJS
};
