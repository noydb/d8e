# d8e

A node CLI tool for bundling/preparing a static website for deployment. This tool will traverse all HTML files, and
convert JS & CSS into inline HTML scripts. This tool will also handle images & fonts.

This tool has been designed (for now) to work
with: [Nginx]( https://github.com/heroku/heroku-buildpack-nginx/blob/main/static.md)

## Usage

1. `npm install -g d8e`
2. `d8e <inputDirectory>`

This tool will output the result to `dist`.

---

**Note: place images inside `<inputDirectory>/asset/img`. This ensures seamless mapping of image src attributes.**
