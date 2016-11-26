// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');

// TODO: Add task to serve babel dist
// TODO: Add tasks to reduce page weight: https://www.sitepoint.com/introduction-gulp-js/

// JS hint task
gulp.task('jshint', function() {
    gulp.src('./src/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});