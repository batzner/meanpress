// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('clean', function () {
    return del('dist/**/*');
});

gulp.task('babel', function () {

    return gulp.src([
        './**/*.js', 'bin/www',
        '!./gulpfile.babel.js',
        '!./node_modules/**/*.js',
        '!./dist/**/*'
    ])
        .pipe(babel())
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
    gulp.watch('./app.js', ['babel']);
});

gulp.task('default', ['clean', 'babel', 'watch']);

// TODO: Add tasks to reduce page weight: https://www.sitepoint.com/introduction-gulp-js/

// TODO: Set NODE_ENV like in https://github.com/meanjs/mean/blob/master/gulpfile.js