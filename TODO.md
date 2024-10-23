When bundling to dist/about/about.html the url in the browser will be:
https://cwp-96138d828021.herokuapp.com/work/work-overview.html

can maybe extract config file parser, error, and log into a CLI util library of some sort?

make this tool manage nginx config etc? or nah? might be better to keep separate.

Use Replace href with full links to enable web crawling

List things this tool will do to optimize for pageSpeed. Like using full (https) links to enable crawling

validate input directory is defined, output direcroty is defined, validate hostedURL exists.

I think we can reduce arguments for certain funcs by just find the config again. instead of finding it once in d8e.js
and constantly passing the values.


Clean HTML: 
https://plainvanillaweb.com/pages/styling.html

REUSABLE minimalistic CSS RESET:
/* generic minimal CSS reset inspiration: https://www.digitalocean.com/community/tutorials/css-minimal-css-reset */ :root { box-sizing: border-box; line-height: 1.4; /* https://kilianvalkhof.com/2022/css-html/your-css-reset-needs-text-size-adjust-probably/ */ -moz-text-size-adjust: none; -webkit-text-size-adjust: none; text-size-adjust: none; } *, *::before, *::after { box-sizing: inherit; } body, h1, h2, h3, h4, h5, h6, p { margin: 0; padding: 0; font-weight: normal; } img { max-width:100%; height:auto; }
