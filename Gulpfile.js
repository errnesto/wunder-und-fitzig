// Load Gulp and your plugins
var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    stylus  = require('gulp-stylus'),
    plumber = require('gulp-plumber'),
    include = require('gulp-include'),
    fileinclude = require('gulp-file-include'),
    react = require('gulp-react');

var paths = {
    styles: 'src/stylus/**/*',
    html:   'src/html/**/*.html',
    react:  'src/react/**/*.jsx'
};

// Connect task
gulp.task('connect', connect.server({
    root: __dirname + '/',
    port: 5000,
    livereload: true,
    open: {browser: 'Google Chrome Canary'}
}));

// HTML task
gulp.task('html', function () {
    gulp.src('./src/html/*.html')
        .pipe(fileinclude())
        .pipe(gulp.dest('./'))
        .pipe(connect.reload());
});

// React task
gulp.task('react', function () {
    gulp.src('./src/react/main.jsx')
        .pipe(include({extensions: 'jsx'}))
        .pipe(react())
        .pipe(gulp.dest('./assets/js'))
        .pipe(connect.reload());
});

// Stylus task
gulp.task('stylus', function () {
    gulp.src('./src/stylus/*.styl')
        .pipe(plumber())
        .pipe(stylus({
            use: ['nib'], 
            set: ['compress']
        }))
        .pipe(gulp.dest('./assets/css'))
        .pipe(connect.reload());
});

// Watch task
gulp.task('watch', function () {
    gulp.watch(paths.styles, ['stylus']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.react, ['react']);
});

// Set 'gulp server' for development
gulp.task('default', ['connect', 'stylus', 'react', 'html', 'watch']);