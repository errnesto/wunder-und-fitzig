// Load Gulp and your plugins
var gulp       = require('gulp');
var nodemon    = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var open       = require("gulp-open");

var paths = {
	styles: 'app/stylus/**/*',
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

gulp.task('test', function () {
	console.log('kkkkkkkk')
	gulp.src('./server.js')
		.pipe(livereload());
});

// Watch task
gulp.task('watch', function () {
    gulp.watch('./server.js', ['test']);
});

//default task
gulp.task('default', ['server','watch']);

gulp.task('open', ['server','open-browser','watch']);