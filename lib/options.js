const { resolve } = require('path');
const { DEFAULT_WORKSPACE, PROJECT_ROOT } = require('./const');

const getDefaultHtmlRawEditOptions = () => ({
  reg: new RegExp(`<script[\\s\\w=":\\/.@-]*(vue-scooter([\\w.@-]*).js)["\\s]><\\/script>`, 'gi'),
  placement: '',
  done: function(data) {
    data.html = data.html.replace(`<script type="module" src="./index.js"></script>`, '')
  }
});

const getDefaultJsRawEditOptions = workspace => ({
  // router目录下所有的js
  pathReg: new RegExp(
    `\\/${workspace}\\/(index|router)(\\/[.\\w\\/]{1,})?.js$`
  ),
  replaceReg: /VueScooter.load/g,
  replacement: 'import',
  // done: function(source) {
  //   return source;
  // },
});

function getOptions(vueScooterConfig) {
  let workspace = vueScooterConfig.workspace || DEFAULT_WORKSPACE;
  workspace = resolve(PROJECT_ROOT, workspace).replace(PROJECT_ROOT + '/', '');
  let rawEditOptions = getRawEditOptions(vueScooterConfig, workspace);

  return {
    rawEditOptions,
    workspace,
  };
}

function getRawEditOptions(vueScooterConfig, workspace) {
  const { html: customHtmlOptions, js: customJsOptions } =
    vueScooterConfig.rawEditOptions || {};

  const htmlRawEditOptions = Object.assign(
    {},
    getDefaultHtmlRawEditOptions(),
    customHtmlOptions || {}
  );
  const jsRawEditOptions = Object.assign(
    {},
    getDefaultJsRawEditOptions(workspace),
    customJsOptions || {}
  );
  return {
    html: htmlRawEditOptions,
    js: jsRawEditOptions,
  };
}

module.exports = {
  getOptions,
};
