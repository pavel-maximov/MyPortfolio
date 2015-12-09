'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

gulp.task('sass', function () {
    gulp.src('./src/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'))
        .pipe(livereload());
});

gulp.task('sass:watch', function () {
    livereload.listen();
    gulp.watch('./src/css/**/*.scss', ['sass']);
    gulp.watch('./public/**/*.html', livereload.reload);
});
