// Load Gulp and your plugins
var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var nodemon      = require('gulp-nodemon');
var livereload   = require('gulp-livereload');
var open         = require("gulp-open");
var stylus       = require('gulp-stylus');
var autoprefixer = require('autoprefixer-stylus');
var nib          = require('nib');
var browserify   = require('browserify');
var rsync        = require('gulp-rsync')
var source       = require('vinyl-source-stream');

var paths = {
	styles:   'app/stylus/**/*.styl',
	react:    'app/jsx/**/*',
    mainJs:   './client.js',
    mainStyl: 'app/stylus/main.styl',
    jsDist:   './assets/js/',
    cssDist:  './assets/css',
    deploy:   './'
};

var config = {
    SERVER_CONNECTION: 'wundf@sculptor.uberspace.de',
    SERVER_DEST:       '~/node/wunder-und-fitzig',
    DONT_DEPLOY:       ['.git/', '.gitignore', '.DS_Store', 'Gulpfile.js', 'node_modules/', 'app/stylus/'],
    produce:           false
}
process.env.PORT = 3000

//start server.js and restart on chnages
gulp.task('server', function () {
	nodemon({ script: 'server.js' })
});

gulp.task('open-browser', function () {
	var options = {
		url: "http://localhost:65432",
		app: "Google Chrome Canary"
	};
	gulp.src("./server.js") //a file is needed to not overlook task
	.pipe(open("", options));
});

gulp.task('stylus', function (cb) {
    var pipe = gulp.src(paths.mainStyl)
		.pipe(plumber())
        .pipe(stylus({
            use: autoprefixer({browsers: ['Firefox > 5%', 'Explorer 9', 'Chrome > 5%', 'Safari > 5%']}),
            set: ['compress']
        }))
        .pipe(gulp.dest(paths.cssDist))

    if(!config.produce)
        pipe.pipe(livereload());

    pipe.on('end', cb)
});

gulp.task('browserify', function (cb) {
    if (config.produce)
        process.env.NODE_ENV = 'production'

    var b = browserify({
        debug: true,
    });
    b.add(paths.mainJs);
    b.plugin('minifyify', {map: '/assets/bundle.map.json', output: './assets/bundle.map.json'});
    var pipe = plumber()
        .pipe(b.bundle())
        .pipe(source('main.js'))
        .pipe(gulp.dest(paths.jsDist))

    if (!config.produce)
        pipe.pipe(livereload())

    pipe.on('end', cb)
});

gulp.task('open', ['server','open-browser','watch']);
gulp.task('set-produce', function() {config.produce = true})
gulp.task('produce', ['set-produce', 'stylus','browserify'])

gulp.task('deploy', ['produce'], function() {
  gulp.src(paths.deploy)
  .pipe(rsync({
    root:        paths.deploy,
    recursive:   true,
    compress:    true,
    progress:    true,
    exclude:     config.DONT_DEPLOY,
    hostname:    config.SERVER_CONNECTION,
    destination: config.SERVER_DEST
  }))
})

// Watch task
gulp.task('watch', function () {
    gulp.watch(paths.styles, ['stylus']);
    gulp.watch(paths.react, ['browserify']);
});

//default task
gulp.task('default', ['server','stylus','browserify','watch']);
