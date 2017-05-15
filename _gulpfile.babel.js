import gulp           from 'gulp'
import babel          from 'gulp-babel'
import concat         from 'gulp-concat'
import plumber        from 'gulp-plumber'
import uglify         from 'gulp-uglify'
import browserify     from 'browserify'
import babelify       from 'babelify'
import source         from 'vinyl-source-stream'
import buffer         from 'vinyl-buffer'
import watchify       from 'watchify'

function rebundle() {
  bundler.bundle()
    .on('error', function(err) {
      console.error(err)
      this.emit('end')
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./example/dist'))
}

function watch() {
  return compile(true);
}

function app_build(){
  var bundler = watchify(browserify('./example/app.js', { debug: true }).transform(babel))
  
  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...')
      rebundle();
    })
  }

  rebundle()

  return browserify('./example/app.js', { debug: true })
    .bundle()
    .pipe(source('app.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('./example/dist'))
}

const build = gulp.series(
  app_build,
  watch
)

export { build }

export default build
