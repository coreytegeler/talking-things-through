var autoprefixer = require('gulp-autoprefixer');
var argv = require('yargs').argv;
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var coffee = require('gulp-coffee');
var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var postcss = require('postcss');
var sass = require('gulp-sass');
var replace = require('gulp-replace');

var paths = {
	sass: './public/sass/styles.scss',
	coffee: './public/coffee/*.coffee',
}

var dest = {
	css: './public/css/',
	js: './public/js/',
	images: './public/images/',
	fonts: './public/fonts/'
}

gulp.task('nodemon', function (cb) {
	var started = false;  
	return nodemon({
		script: 'index.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		} 
	});
});

gulp.task('sass', function() {
	var sassOptions = {
		compress: argv.prod ? true : false
	};
	var apOptions = {
		browsers: ['> 0.5%', 'last 5 versions', 'Firefox ESR', 'not dead']
	};
	log(paths.sass);
	gulp.src(paths.sass)
		.pipe(plumber())
		.pipe(sass(sassOptions))
		.pipe(autoprefixer(apOptions))
		.pipe(replace('images/', dest.images))
		.pipe(replace('fonts/', dest.fonts))
		.pipe(gulp.dest(dest.css))
		.pipe(browserSync.stream())
	.on('end', function() {
		log('Sass done');
		if (argv.prod) log('CSS minified');
	});
});

gulp.task('coffee', function() {
	gulp.src(paths.coffee)
		.pipe(coffee({bare: true}))
		.pipe(gulp.dest(dest.js))
		.pipe(browserSync.stream())
	.on('end', function() {
		log('Coffee done');
		if (argv.prod) log('JS minified');
	});
});

gulp.task('serve', ['nodemon', 'sass', 'coffee'], function() {
	browserSync.init(null, {
		proxy: 'http://localhost:5000',
		files: ['public/**/*.*'],
		open: false,
		port: 7000,
	});
	gulp.watch('public/sass/*.scss', ['sass']);
	gulp.watch('public/coffee/*.coffee', ['coffee']);
	gulp.watch('views/*').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);


function log(message) {
	gutil.log(gutil.colors.bold.green(message));
}