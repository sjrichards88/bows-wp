/*!
 * gulp
 *
 * To install dependencies listed in package.json:
 * 1. cd to the directory containing the package.json
 * 2. type: npm install
 *
 * To install dependencies listed in bower.json:
 * 1. cd to the directory containing the bower.json
 * 2. type: bower install
 */

// Include gulp and plugins 
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleancss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber');

// Project directories
var config = {
    bootstrapDir: './node_modules/bootstrap-sass',
    jQueryDir: './node_modules/jquery',
    modernizrDir: './node_modules/npm-modernizr',
    publicDir: './build',
    projectScssDir: './src/scss',
    projectJsDir: './src/js',
    projectImagesDir: './src/images'
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src(config.projectJsDir + '/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile our scss
gulp.task('scss', function() {
    return gulp.src(config.projectScssDir + '/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        precision: 8,
        style: 'compressed',
        includePaths: [config.bootstrapDir + '/assets/stylesheets']
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: [
            "Android 2.3",
            "Android >= 4",
            "Chrome >= 20",
            "Firefox >= 24",
            "Explorer >= 8",
            "iOS >= 6",
            "Opera >= 12",
            "Safari >= 6"
        ]
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleancss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.publicDir + '/assets/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        config.modernizrDir + '/modernizr.js',
        // config.jQueryDir + '/dist/jquery.min.js',
        config.bootstrapDir + '/assets/javascripts/bootstrap/transition.js',
        //config.bootstrapDir + '/assets/javascripts/bootstrap/alert.js',
        //config.bootstrapDir + '/assets/javascripts/bootstrap/button.js',
        config.bootstrapDir + '/assets/javascripts/bootstrap/carousel.js',
        config.bootstrapDir + '/assets/javascripts/bootstrap/collapse.js',
        config.bootstrapDir + '/assets/javascripts/bootstrap/dropdown.js',
        config.bootstrapDir + '/assets/javascripts/bootstrap/modal.js',
        //config.bootstrapDir + '/assets/javascripts/bootstrap/tab.js',
        //config.bootstrapDir + '/assets/javascripts/bootstrap/affix.js',
        //config.bootstrapDir + '/assets/javascripts/bootstrap/scrollspy.js',
        //config.bootstrapDir + '/assets/javascripts/bootstrap/tooltip.js',
        //config.bootstrapDir + '/assets/javascripts/bootstrap/popover.js',
        config.projectJsDir + '/vendor/*.js',
        config.projectJsDir + '/*.js',
    ])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.publicDir + '/assets/js'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.publicDir + '/assets/js'));
});

gulp.task('fonts', function() {
    return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
    .pipe(gulp.dest(config.publicDir + '/assets/fonts'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(config.projectJsDir + '/**/*.js', ['lint', 'scripts']);
    gulp.watch(config.projectScssDir + '/**/*.scss', ['scss']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'scss', 'fonts', 'watch']);