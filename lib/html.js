// TODO The following code pulls out a package
class VueScooterHtmlPlugin {
  constructor(opts) {
    this.opts = opts
    console.log('init vue scooter html plugin', opts)
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('VueScooterHtmlPlugin', (compilation) => {
      // The compiler is starting a new compilation...
      // Static Plugin interface |compilation |HOOK NAME | register listener
      this.opts.origin.getHooks(compilation).beforeEmit.tapAsync(
        'VueScooterHtmlPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          const { done, reg, placement } = this.opts
          // remove vue-scooter.js
          data.html = data.html.replace(reg, placement)
          done instanceof Function && done.call(this, data)
          // Tell webpack to move on
          cb(null, data)
        }
      )
    })
  }
}

module.exports = {
  VueScooterHtmlPlugin,
}
