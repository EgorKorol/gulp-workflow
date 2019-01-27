const gulp = require('gulp');

/******** BROWSER SYNC ********/

const browserSync = require('browser-sync').create();

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  gulp.watch('dist/').on('change', browserSync.reload);
});

/******** BROWSER SYNC ********/

/******** HTML ********/

gulp.task('copy:html', function () {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('html:watch', function () {
  gulp.watch('./src/**/*.html', gulp.series('copy:html'));
});

/******** HTML ********/

/******** SCSS ********/

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

gulp.task('scss:dev', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/'));
});

gulp.task('scss:build', function () {
  return gulp.src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(gulp.dest('dist/'));
});

gulp.task('scss:watch', function () {
  gulp.watch('./src/**/*.scss', gulp.series('scss:dev'));
});

/******** SCSS ********/

/******** JS ********/

const webpack = require('webpack-stream');

gulp.task('js:dev', function () {
  return gulp.src('./src/**/*.js')
    .pipe(webpack({
      entry: {
        index: './src/index.js'
      },
      output: {
        filename: 'index.js',
      },
      mode: 'development'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('js:build', function () {
  return gulp.src('./src/**/*.js')
    .pipe(webpack({
      entry: {
        index: './src/index.js'
      },
      output: {
        filename: 'index.js',
      },
      mode: 'production',
      // module: {
      //   rules: [{
      //     test: /\.(js)$/,
      //     exclude: /(node_modules)/,
      //     loader: 'babel-loader',
      //     query: {
      //       presets: ['@babel/env']
      //     }
      //   }]
      // },
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('js:watch', function () {
  gulp.watch('./src/**/*.js', gulp.series('js:dev'));
});

/******** JS ********/

/******** IMAGES ********/

const imagemin = require('gulp-imagemin');

gulp.task('copy:images', function () {
  return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('imagemin', function () {
  return gulp.src('./src/images/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          },
          {
            removeUselessStrokeAndFill: true
          },
          {
            removeDimensions: true
          }
        ]
      })
    ]))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('images:watch', function () {
  gulp.watch('./src/images/**/*', gulp.series('copy:images'));
});

/******** IMAGES ********/

/******** STATIC FOLDER ********/

gulp.task('copy:static', function () {
  return gulp.src('./static/**/*')
    .pipe(gulp.dest('dist/'));
});

gulp.task('static:watch', function () {
  gulp.watch('./static/**/*', gulp.series('copy:static'));
});

/******** STATIC FOLDER ********/

/******** FONTS ********/

gulp.task('copy:fonts', function () {
  return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('dist/fonts/'));
});

/******** FONTS ********/

/******** CLEAN ********/

const del = require('del');

gulp.task('clean', function () {
  return del('./dist');
});

/******** CLEAN ********/

gulp.task(
  'dev',
  gulp.series(
    'clean',
    gulp.parallel(
      'scss:dev',
      'js:dev',
      'copy:html',
      'copy:images',
      'copy:fonts',
      'browser-sync',
      'html:watch',
      'scss:watch',
      'js:watch',
      'images:watch',
      'static:watch'
    )
  )
);

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'scss:build',
      'js:build',
      'copy:html',
      'copy:images',
      'copy:fonts'
    )
  )
);
