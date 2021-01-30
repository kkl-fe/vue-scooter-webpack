const path = require('path')
const { merge } = require('webpack-merge')

const baseConfig = require('./options')
const projectRoot = process.cwd()

console.log(projectRoot)
const projectWebpackConfig = {}
try {
  projectWebpackConfig = require(path.resolve(
    projectRoot,
    './webpack.config.js'
  ))
} catch (error) {}

const options = merge(baseConfig, projectWebpackConfig)

async function build(webpackConfig) {
  const webpack = require('webpack')

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) return reject(err)

      if (stats.hasErrors()) {
        return reject(new Error('Build failed with errors.'))
      }

      console.log(`Build complete. The  directory is ready to be deployed.`)

      resolve()
    })
  })
}

module.exports = {
  options,
  build,
}
