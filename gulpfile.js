const gulp = require('gulp')
const debug = require('gulp-debug');
const merge = require('merge-stream')
const webpack = require('webpack-stream')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const sourcemaps = require('gulp-sourcemaps')
const bytediff = require('gulp-bytediff')
const browserSync = require('browser-sync').create()
const chalk = require('chalk')
const stream = require('stream');
const named = require('vinyl-named')
const rename = require('gulp-rename')
const filter = require('gulp-filter')
const flatten = require('gulp-flatten')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const posthtml = require('gulp-posthtml')
const posthtmlInclude = require('posthtml-include')
const htmlnano = require('htmlnano')
const sizereport = require('gulp-sizereport')
const postcssImport = require('postcss-import')
const postcssInlineSvg = require('postcss-inline-svg')
const postcssColorModFunction = require('postcss-color-mod-function').bind(null, {
  /* Use `.toRGBLegacy()` as other methods can result in lots of decimals */
  stringifier: (color) => color.toRGBLegacy()
})

const paths = {
  docs: { src: 'docs/**', dest: '_site' },
  styles: { src: 'src/builds/*.css', dest: 'dist', watch: 'src/**/*.css' },
  scripts: { src: 'src/builds/*.js', dest: 'dist', watch: 'src/**/*.js' }
}

// https://stackoverflow.com/a/20732091
const humanFileSize = (size) => {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}

const formatByteMessage = (source, data) => {
  const prettyStartSize = humanFileSize(data.startSize)
  let message = ''

  if (data.startSize !== data.endSize) {
    const change = data.savings > 0 ? 'saved' : 'gained'
    const prettySavings = humanFileSize(Math.abs(data.savings))
    let prettyEndSize = humanFileSize(data.endSize)

    if (data.endSize > data.startSize) prettyEndSize = chalk.yellow(prettyEndSize)
    if (data.endSize < data.startSize) prettyEndSize = chalk.green(prettyEndSize)

    message = chalk`${change} ${prettySavings} (${prettyStartSize} -> {bold ${prettyEndSize}})`
  } else message = chalk`kept original filesize. ({bold ${prettyStartSize}})`

  return chalk`{cyan ${source.padStart(12, ' ')}}: {bold ${data.fileName}} ${message}`
}

const style = () => {
  const startDiff = () => bytediff.start()
  const endDiff = (source) => bytediff.stop((data) => formatByteMessage(source, data))

  return (
    gulp
      .src(paths.styles.src)
      .pipe(postcss([postcssImport(), postcssColorModFunction(), postcssInlineSvg()]))

      .pipe(startDiff())
      .pipe(postcss([autoprefixer()]))
      .pipe(endDiff('autoprefixer'))

      .pipe(flatten()) // Put files in dist/*, not dist/builds/*
      .pipe(gulp.dest(paths.styles.dest))

      // <minifying>
      .pipe(startDiff())
      .pipe(postcss([cssnano({ preset: ['default', { svgo: { floatPrecision: 0 } }] })]))
      .pipe(endDiff('minification'))
      .pipe(rename({ suffix: '.min' }))
      // </minifying>

      .pipe(gulp.dest(paths.styles.dest))
      .pipe(gulp.dest(paths.docs.dest + '/gmx.css'))

      .pipe(sizereport({ gzip: true, total: false, title: 'SIZE REPORT' }))
      .pipe(browserSync.stream())
  )
}

const scripts = (done) => {
  const webpackConfig = {
    mode: 'production',
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      }]
    },
    devtool: false
  };

  const main = gulp.src('src/builds/gmx.js')
    .pipe(named())
    .pipe(webpack({
      ...webpackConfig,
      optimization: { minimize: false },
      output: { filename: 'gmx.js' }
    }))
    .pipe(gulp.dest(paths.scripts.dest));

  const minified = gulp.src('src/builds/gmx.js')
    .pipe(named())
    .pipe(webpack({
      ...webpackConfig,
      output: { filename: 'gmx.min.js' }
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(gulp.dest(paths.docs.dest + '/gmx.css'))
    
    .pipe(sizereport({ gzip: true, total: false, title: 'SIZE REPORT (JS)' }))
    .pipe(browserSync.stream());

  return merge(main, minified).on('end', done);
};

const docs = () => {
  const htmlOnly = filter('**/*.html', { restore: true })
  const jsOnly = filter('**/*.js', { restore: true })
  const cssOnly = filter('**/*.css', { restore: true })

  return (
    gulp
      // Exclude all HTML files but index.html
      .src(paths.docs.src, { ignore: '**/!(index).html', 
        // https://stackoverflow.com/a/78450106
        encoding: false })
        
      .pipe(debug({ title: 'Processing:' }))

      // * Process HTML *
      .pipe(htmlOnly)
      .pipe(posthtml([
        posthtmlInclude({ root: 'docs/_includes' }),
        htmlnano()
      ]))
      .pipe(htmlOnly.restore)

      // * Process JS *
      .pipe(jsOnly)
      .pipe(babel({ presets: ['@babel/preset-env'] }))
      .pipe(terser({ toplevel: true }))
      .pipe(jsOnly.restore)

      // * Process CSS *
      .pipe(cssOnly)
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(cssOnly.restore)

      .pipe(gulp.dest(paths.docs.dest))
  )
}

const browserReload = (done) => {
  browserSync.reload()
  return done()
}

const startDevServer = () => {
  browserSync.init({ server: { baseDir: './_site' } })

  gulp.watch(paths.styles.watch, gulp.series(style, browserReload))
  gulp.watch(paths.scripts.watch, gulp.series(scripts, browserReload))
  gulp.watch(paths.docs.src, gulp.series(docs, browserReload))
}

const build = gulp.parallel(style, scripts, docs)
const watch = gulp.series(build, startDevServer)

module.exports.build = build
module.exports.watch = watch
