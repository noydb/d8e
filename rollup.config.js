import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {

  // entry point to components we want to bundle.
  input: './d8e.js',

  output: {
    // Output file for bundled/minified/flattened code
    file: 'build/d8e.js',
    // CommonJS format for Node.js.
    format: 'cjs',
    // Generate sourcemaps for debugging.
    // sourcemap: true,
    // inserts the value into the top of the output file.
    // we need this shebang, to tell the command line to
    // interpret and/or execute this file using Node.
    // we could write it into the src js file itself,
    // but when rollup builds, it throws an unexpected
    // token error on the shebang.
    banner: () => '#!/usr/bin/env node'
  },

  plugins: [
    // Convert CommonJS modules to ES6
    commonjs(),
    terser({
      maxWorkers: 4
    })
  ],

  // Specify external dependencies
  external: ['fs', 'path', 'package.json']
};
