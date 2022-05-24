import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { uglify } from 'rollup-plugin-uglify';


module.exports = [
  {
    input: './src/index.js',
    output: {
      file: './dist/index.js',
      format: 'umd',
      name: 'WxminiAsyncSolve',
    },
    plugins: [
      commonjs(),
      babel({
        exclude: '**/node_modules/**',
      }),
      uglify()
    ],
  },
]