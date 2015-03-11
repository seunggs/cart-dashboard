'use strict';

var outDir = 'build/';

module.exports = {
  host: 'localhost',
  port: 3000,

  // app directories
  appDir: 'public',

  // unit test directories
  unitTestDir: 'public',

  // build test dir
  buildTestDir: outDir + 'test/',

  // build directories
  buildDir: outDir + 'public/',
  buildCss: outDir + 'public/css/',
  buildFonts: outDir + 'public/fonts/',
  buildImages: outDir + 'public/images/',
  buildJs: outDir + 'public/js/',
  extDir: outDir + 'public/vendor/',
  extCss: outDir + 'public/vendor/css/',
  extFonts: outDir + 'public/vendor/fonts/',
  extJs: outDir + 'public/vendor/js/'
};
