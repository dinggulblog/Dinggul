const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = defineConfig({
  outputDir: path.resolve('../backend/public'),
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import '@/scss/helpers/mixin.scss';
          @import '@/scss/helpers/meidaQuery.scss';
          @import '@/scss/variables/_color.scss';
        `,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin(),
      new MiniCssExtractPlugin({ filename: '[name].css' })
    ],
    resolve: {
      fallback: {
        'fs': false,
        'net': false
      }
    }
  },
})
