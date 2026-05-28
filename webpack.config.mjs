import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import fs from 'node:fs';
import path from 'node:path';

const dirname = path.resolve('.');

export default [{
  mode: 'production',
  entry: {
    main   : './src/main.ts',
    chrome : './src/chrome.ts',
    firefox: './src/firefox.ts'
  },
  output: {
    filename: '[name].js',
    path: `${dirname}/dist`,
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          },
          keep_classnames: /^.*?Processor$/
        }
      })
    ]
  },
  devtool: 'source-map'
}];
