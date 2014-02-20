var gulp = require('gulp');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var connect = require('connect');
var http = require('http');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var open = require('open');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var svgmin = require('gulp-svgmin');
var handlebars = require('gulp-handlebars');
var declare = require('gulp-declare');

var app = connect()
  .use(connect.static(__dirname));

var options = {
  'port': 8000,
  'host': 'localhost',
  'stylPath': './css/styl/',
  'jsPath': './js/',
  'imgPath': './assets/'
};

gulp.task('connect', function () {
  http.createServer(app).listen(8000);
});

gulp.task('open-browser', function() {
  open('http://' + options.host + ':' + options.port);
});

gulp.task('css', function() {
  gulp.src(options.stylPath + 'main.styl')
    .pipe(stylus({
      urlFunc: ['embedurl'],
      "resolve url": true
    }))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./css'))
    .pipe(livereload());
});

gulp.task('templates', function () {
  gulp.src(['./templates/*.hbs'])
    .pipe(handlebars())
    .pipe(declare({
      namespace: 'App.templates'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(options.jsPath));
});

gulp.task('js', function() {
  gulp.src([
      options.jsPath + 'vendor/jquery-1.10.2.min.js',
      options.jsPath + 'vendor/lodash-2.4.1.min.js',
      options.jsPath + 'vendor/handlebars-runtime-v1.3.0.js',
      options.jsPath + 'vendor/moment-2.5.1.min.js',
      options.jsPath + 'vendor/jquery.bxslider.js',
      options.jsPath + 'templates.js',
      options.jsPath + 'main.js'
    ])
    .pipe(jshint())
    .pipe(concat('site.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(options.jsPath + 'dist'));
});

gulp.task('html', function() {
  gulp.src('*.html')
    .pipe(livereload());
});

gulp.task('img', function() {
  gulp.src(options.imgPath + '*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('./img'));
});

gulp.task('watch', function() {
  gulp.watch(options.stylPath + '**/*.styl', ['css']);
  gulp.watch(options.jsPath + '*.js', ['js']);
  gulp.watch('./templates/*.hbs', ['templates', 'js']);
  gulp.watch('*.html', ['html']);
  gulp.watch(options.imgPath + '*.svg', ['img']);
});

gulp.task('build', ['css', 'templates', 'js']);
gulp.task('default', ['connect', 'build', 'watch']);
gulp.task('start', ['open-browser', 'default']);
