import gulp           from 'gulp'
import babel          from 'gulp-babel'
import concat         from 'gulp-concat'
import plumber        from 'gulp-plumber'
import uglify         from 'gulp-uglify'
import browserify     from 'browserify'
import babelify       from 'babelify'

export function js_build(){
  return gulp.src('classes/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
}

export function app_build(){
  return browserify('./example/app.js', { debug: true })
    .bundle()
    .pipe(source('app.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('./example/dist'))
}

const build = gulp.series(
  js_build,
  app_build
)

export { build }

export default build
