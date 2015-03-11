'use strict';

var gulp = require('gulp')
  , path = require('path')
  , $ = require('gulp-load-plugins')({
    pattern: [
      'gulp-*',
      'browser-sync'
    ]
  })

  , buildConfig = require('../build.config.js')

  , appFiles = path.join(buildConfig.appDir, '**/*')
  , sassFiles = path.join(buildConfig.appDir, 'styles/**/*')
  , unitTestFiles = path.join(buildConfig.unitTestDir, '**/*_test.*');

gulp.task('browserSync', function () {
  $.browserSync({
    host: buildConfig.host,
    open: 'external',
    port: buildConfig.port,
    server: {
      baseDir: buildConfig.buildDir
    }
  });
});

gulp.task('sass', function() {
  return gulp.src(buildConfig.appDir+'/styles/main.sass')
    .pipe($.compass({
      css: buildConfig.appDir+'/styles',
      sass: buildConfig.appDir+'/styles'
    }))
    .pipe(gulp.dest(buildConfig.buildCss))
    .pipe($.browserSync.reload({stream:true}));
});

gulp.task('watch', function () {
  $.browserSync.reload();
  gulp.watch([unitTestFiles], ['unitTest']);
  gulp.watch([appFiles, '!' + unitTestFiles, '!' + sassFiles], ['build', $.browserSync.reload]);
  gulp.watch([sassFiles], ['sass']);
});
