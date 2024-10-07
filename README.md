# d8e

A node CLI tool for bundling/preparing a static website for deployment.

Run `d8e <inputDirectory>` to convert all html files inside `<inputDirectory>` to contain inlined CSS & JS.

This tool will output the result to `dist`.

**Note**: place images inside `<inputDirectory>/asset/img`. This ensures seamless mapping of image src attributes.¬ 
