const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const projectPath = process.cwd();
const srcDirPath = path.resolve(__dirname, 'src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: false,
  target: 'node',
  context: path.resolve(projectPath),
  mode: process.env.NODE_ENV,
  entry: path.resolve(projectPath, 'src/main.js'),
  output: {
    filename: 'main.js',
    path: path.join(projectPath, 'dist'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias: {
      '@': srcDirPath
    },
    extensions: ['.js'],
    mainFiles: ['index'],
    modules: [srcDirPath, nodeModulesPath]
  },
  performance: {
    hints: false
  },
  optimization: {
    minimize: false
  },
  stats: (() => {
    return {
      warnings: false,
      assets: true,
      assetsSort: '!size',
      cached: true,
      builtAt: true,
      cachedAssets: true,
      children: true,
      chunksSort: '!size',
      chunkGroups: true,
      chunkModules: true,
      chunkOrigins: true,
      chunks: true,
      colors: true,
      depth: true,
      entrypoints: true,
      env: true,
      errorDetails: true,
      errors: true
    };
  })(),
  plugins: [
    // 清理资源
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ['**/*']
    })
  ]
};
