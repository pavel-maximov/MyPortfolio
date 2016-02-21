'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
    gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./public/css/'))
        .pipe(livereload());
});

gulp.task('default', function () {
    livereload.listen();
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./public/**/*.html', livereload.reload);
});
