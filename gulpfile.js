const fs = require('fs');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const webpack = require('gulp-webpack');
const browserSync = require('browser-sync');
const config = {
  webpack: require('./webpack.config')
};

function reload() {
  browserSync.reload({ stream: false });
};

gulp.task('browsersync', function() {
  browserSync.init({
    files: ['public/**/*.*', 'views/**/*.*','sass/**/*.*'], // BrowserSyncにまかせるファイル群
    proxy: 'http://localhost:3000',  // express の動作するポートにプロキシ
    port: 4000,  // BrowserSync は 4000 番ポートで起動
    open: false  // ブラウザ open しない
  });
});

gulp.task("webpack", function() {
  gulp.src("public/javascripts/**/*js")
  .pipe(webpack(config.webpack))
  .pipe(gulp.dest("public/javascripts"));
});

gulp.task('serve', ['browsersync', 'webpack'], function () {
  nodemon({
    script: './bin/www',
    ext: 'js html css',
    ignore: [  // nodemon で監視しないディレクトリ
      'node_modules',
      'bin',
      'views',
      'public',
      'test'
    ],
    env: {
      'NODE_ENV': 'development'
    },
    stdout: false  // Express の再起動時のログを監視するため
  })
  .on('readable', function() {
    this.stdout.on('data', function(chunk) {
      if (/^Express\ server\ listening/.test(chunk)) reload();
      process.stdout.write(chunk);
    });
    this.stderr.on('data', function(chunk) {
      process.stderr.write(chunk);
    });
  });
});

gulp.task('default', ['serve']);
