const gulp = require('gulp');

/** ****** BROWSER SYNC ******* */

const browserSync = require('browser-sync').create();

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  gulp.watch('dist/').on('change', browserSync.reload);
});

/** ****** BROWSER SYNC ******* */

/** ****** HTML ******* */
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');

gulp.task('html:dev', () =>
  gulp
    .src('./src/*.html')
    .pipe(
      nunjucksRender({
        path: ['src/templates/'],
      })
    )
    .pipe(gulp.dest('dist/'))
);

gulp.task('html:build', () =>
  gulp
    .src('./src/*.html')
    .pipe(
      nunjucksRender({
        path: ['src/templates/'],
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/'))
);

gulp.task('html:watch', () => {
  gulp.watch('./src/**/*.html', gulp.series('html:dev'));
});

/** ****** HTML ******* */

/** ****** SCSS ******* */

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

gulp.task('scss:dev', () =>
  gulp
    .src('./src/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/'))
);

gulp.task('scss:build', () =>
  gulp
    .src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('dist/'))
);

gulp.task('scss:watch', () => {
  gulp.watch('./src/**/*.scss', gulp.series('scss:dev'));
});

/** ****** SCSS ******* */

/** ****** JS ******* */

const webpack = require('webpack-stream');

gulp.task('js:dev', () =>
  gulp
    .src('./src/*.js')
    .pipe(
      webpack({
        entry: {
          index: './src/index.js',
        },
        output: {
          filename: 'index.js',
        },
        mode: 'development',
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'eslint-loader',
            },
          ],
        },
      })
    )
    .pipe(gulp.dest('dist/'))
);

gulp.task('js:build', () =>
  gulp
    .src('./src/*.js')
    .pipe(
      webpack({
        entry: {
          index: './src/index.js',
        },
        output: {
          filename: 'index.js',
        },
        mode: 'production',
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest('dist/'))
);

gulp.task('js:watch', () => {
  gulp.watch('./src/**/*.js', gulp.series('js:dev'));
});

/** ****** JS ******* */

/** ****** IMAGES ******* */

const imagemin = require('gulp-imagemin');

gulp.task('copy:images', () => gulp.src('./src/images/**/*').pipe(gulp.dest('dist/images/')));

gulp.task('imagemin', () =>
  gulp
    .src('./src/images/**/*')
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
        }),
        imagemin.jpegtran({
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 5,
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: true,
            },
            {
              cleanupIDs: false,
            },
            {
              removeUselessStrokeAndFill: true,
            },
            {
              removeDimensions: true,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest('dist/images'))
);

gulp.task('images:watch', () => {
  gulp.watch('./src/images/**/*', gulp.series('copy:images'));
});

/** ****** IMAGES ******* */

/** ****** STATIC FOLDER ******* */

gulp.task('copy:static', () => gulp.src('./static/**/*').pipe(gulp.dest('dist/')));

gulp.task('static:watch', () => {
  gulp.watch('./static/**/*', gulp.series('copy:static'));
});

/** ****** STATIC FOLDER ******* */

/** ****** FONTS ******* */

gulp.task('copy:fonts', () => gulp.src('./src/fonts/**/*').pipe(gulp.dest('dist/fonts/')));

/** ****** FONTS ******* */

/** ****** CLEAN ******* */

const del = require('del');

gulp.task('clean', () => del('./dist'));

/** ****** CLEAN ******* */

gulp.task(
  'dev',
  gulp.series(
    'clean',
    gulp.parallel(
      'scss:dev',
      'js:dev',
      'html:dev',
      'copy:images',
      'copy:fonts',
      'copy:static',
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
    gulp.parallel('scss:build', 'js:build', 'html:build', 'copy:images', 'copy:fonts', 'copy:static')
  )
);
