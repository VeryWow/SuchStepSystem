import gulp            from 'gulp'
import babel           from 'gulp-babel'
import concat          from 'gulp-concat'
import plumber         from 'gulp-plumber'
import uglify          from 'gulp-uglify'
import browserify          from 'gulp-browserify'

export function js_build(){
  return gulp.src('classes/**/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dest'))
}

export function app_build(){
  return gulp.src('example/app.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./example/dist'))
}

const build = gulp.series(
  js_build,
  app_build
)

export { build }

export default build
