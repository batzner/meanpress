/**
 * Basic concept follows https://www.justinmccandless.com/post/a-tutorial-for-getting-started-with-gulp/
 */
const gulp = require('gulp');

// Include plug-ins
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const nodemon = require('gulp-nodemon');

// Bases for specifying paths in gulp.src and gulp.dest
const bases = {
    frontend: 'public/',
    dist: 'dist/'
};

// Paths to be used in gulp.src
const sourcePaths = {
    javascripts: ['javascripts/**/*.js'],
    stylesheets: ['stylesheets/**/*.css'],
    html: ['templates/**/*.html'],
    images: ['images/**/*.png', 'images/**/*.jpg', 'images/**/*.jpeg', 'images/**/*.gif'],
    all: ['**/*', '!**/README.md']
};

// Paths to be used in gulp.dest
const destPaths = {
    javascripts: 'javascripts/',
    stylesheets: 'stylesheets/',
    html: 'templates/',
    images: 'images/'
};

const minJsName = 'app.min.js';

// ESLint ignores:
const eslintIgnores = ['!**/visualizing-travel-times-with-multidimensional-scaling/**/*'];

// Delete the dist directory
gulp.task('clean', function () {
    return gulp.src(bases.dist)
        .pipe(clean());
});

// Copy the public directory to dist. We are copying all files to make sure, we don't miss files
// that get added in the future.
gulp.task('copy', ['clean'], function () {
    return gulp.src(sourcePaths.all, {cwd: bases.frontend})
        .pipe(gulp.dest(bases.dist));
});

// Check code style on JS
gulp.task('eslint', function () {
    gulp.src(sourcePaths.javascripts.concat(eslintIgnores), {cwd: bases.frontend})
        .pipe(eslint())
        .pipe(eslint.format());
});

// Transpile the javascript files to ES5. Then, minify them.
gulp.task('javascripts', ['copy'], function () {
    return gulp.src(sourcePaths.javascripts, {cwd: bases.dist})
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat(minJsName))
        .pipe(gulp.dest(bases.dist+destPaths.javascripts));
});

// Minify the images
gulp.task('images', ['copy'], function () {
    return gulp.src(sourcePaths.images, {cwd: bases.dist})
        .pipe(imagemin())
        .pipe(gulp.dest(bases.dist+destPaths.images));
});

// Watch the public directory in order to move changes directly to dist
gulp.task('dev', ['copy'], function () {
    gulp.watch(['public/**/*'], ['copy']);
});

// Default task producing a ready-to-ship frontend in the dist folder
gulp.task('default', ['javascripts', 'images']);