// Load Gulp and your plugins
var gulp       = require('gulp');
var plumber    = require('gulp-plumber');
var nodemon    = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var open       = require("gulp-open");
var stylus     = require('gulp-stylus');
var nib        = require('nib');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');

var paths = {
	styles: 'app/stylus/**/*.styl',
	react:  'app/jsx/**/*'
};

//start server.js and restart on chnages
gulp.task('server', function () {
	nodemon({ script: 'server.js' })
});

gulp.task('open-browser', function () {
	var options = {
		url: "http://localhost:3000",
		app: "Google Chrome Canary"
	};
	gulp.src("./server.js") //a file is needed to not overlook task
	.pipe(open("", options));
});

gulp.task('stylus', function () {
    gulp.src('app/stylus/main.styl')
    		.pipe(plumber())
        .pipe(stylus({
            use: nib(), 
            set: ['compress']
        }))
        .pipe(gulp.dest('./assets/css'))
        .pipe(livereload());
});

gulp.task('browserify', function () {
    browserify('./client.jsx')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./assets/js/'))
    .pipe(livereload());
});

// Watch task
gulp.task('watch', function () {
    gulp.watch(paths.styles, ['stylus']);
});

//default task
gulp.task('default', ['server','stylus','browserify','watch']);

gulp.task('open', ['server','open-browser','watch']);