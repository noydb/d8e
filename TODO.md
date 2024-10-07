When bundling to dist/about/about.html the url in the browser will be:
https://cwp-96138d828021.herokuapp.com/work/work-overview.html

can maybe extract config file parser, error, and log into a CLI util library of some sort?

make this tool manage nginx config etc? or nah? might be better to keep separate.

Use Replace href with full links to enable web crawling

List things this tool will do to optimize for pageSpeed. Like using full (https) links to enable crawling

validate input directory is defined, output direcroty is defined, validate hostedURL exists.

I think we can reduce arguments for certain funcs by just find the config again. instead of finding it once in d8e.js
and constantly passing the values.
