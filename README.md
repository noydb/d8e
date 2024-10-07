# d8e

A node CLI tool for bundling/preparing a static HTML website for deployment. This tool will:

1. Traverse all HTML files - in the specified `inputDirectory` in `.d8e`
2. Convert all JS & CSS into inline HTML scripts
3. Minify the JS, CSS & HTML
4. Copy the HTML files - and any images & fonts - to the specified outputDirectory (in `.d8e`)

---

## Usage

### 1. `npm install -g d8e`

### 2. Create a config file - in the root of your project - like:

```JSON
{
  "inputDirectory": "src2",
  "outputDirectory": "dist",
  "verbose": false
}
```

### 3. `d8e b`

---

## FYI

**Note: place images inside `<inputDirectory>/asset/img`. This ensures seamless mapping of image src attributes.**
