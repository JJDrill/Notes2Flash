var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

gulp.task('default', ['compileJavascript', 'HTML', 'css', 'jstree', 'tinymce', 'minify']);

gulp.task('compileJavascript', function() {
  return gulp.src('./scripts/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts'))
});

gulp.task('HTML', function() {
  gulp
    .src('./*.html')
    .pipe(gulp.dest('./build'))
});

gulp.task('css', function() {
  gulp
    .src('./style/**/*.*')
    .pipe(gulp.dest('./build/style'))
});

gulp.task('jstree', function() {
  gulp
    .src('./jstree/**/*.*')
    .pipe(gulp.dest('./build/jstree'))
});

gulp.task('tinymce', function() {
  gulp
    .src('./tinymce/**/*.*')
    .pipe(gulp.dest('./build/tinymce'))
});

gulp.task('minify', ['compileJavascript'], function() {
  return gulp.src('./build/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build'))
});
