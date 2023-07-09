/* eslint-disable @typescript-eslint/no-var-requires */
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
/* eslint-enable @typescript-eslint/no-var-requires */

const dirname = path.resolve('.');

module.exports = {
  mode: 'development',
  entry: {
    chrome: ['./src/chrome.ts', './src/styles/app.css'],
    firefox: ['./src/firefox.ts', './src/styles/app.css'],
    GraphicEqualizer: ['./src/GraphicEqualizer/index.ts'],
    Knob: ['./src/Knob/index.ts']
  },
  output: {
    filename: '[name].js',
    path: `${dirname}/dist`,
    publicPath: '/dist/',
    library: {
      type: 'window'
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'app.css'
    })
  ],
  devtool: 'source-map'
};
