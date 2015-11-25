var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task('default', ['cleanBuildDir', 'compileJavascript', 'HTML', 'css', 'tinymce', 'minify']);

gulp.task('cleanBuildDir', function () {
  return del([
    './build/report.csv',
    './build/**/*'
  ]);
});

gulp.task('compileJavascript', ['cleanBuildDir'], function() {
  return gulp.src('./scripts/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts'))
});

gulp.task('HTML', ['cleanBuildDir'], function() {
  gulp
    .src('./*.html')
    .pipe(gulp.dest('./build'))
});

gulp.task('css', ['cleanBuildDir'], function() {
  gulp
    .src('./style/**/*.*')
    .pipe(gulp.dest('./build/style'))
});

gulp.task('tinymce', ['cleanBuildDir'], function() {
  gulp
    .src('./tinymce/**/*.*')
    .pipe(gulp.dest('./build/tinymce'))
});

gulp.task('minify', ['compileJavascript'], function() {
  return gulp.src('./build/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build'))
});
