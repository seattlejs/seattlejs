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

var app = connect()
  .use(connect.static(__dirname));

var options = {
  'port': 8000,
  'host': 'localhost',
  'stylPath': './css/styl/',
  'jsPath': './js/'
};

gulp.task('connect', function () {
  http.createServer(app).listen(8000);
});

gulp.task('open-browser', function() {
  open('http://' + options.host + ':' + options.port);
});

gulp.task('css', function() {
  gulp.src(options.stylPath + 'main.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./css'))
    .pipe(livereload());
});

gulp.task('js', function() {
  gulp.src([
      options.jsPath + 'vendor/jquery-1.10.2.min.js',
      options.jsPath + '*.js'
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

gulp.task('watch', function() {
  gulp.watch(options.stylPath + '**/*.styl', ['css']);
  gulp.watch(options.jsPath + '*.js', ['js']);
  gulp.watch('*.html', ['html']);
});

gulp.task('build', ['css', 'js']);
gulp.task('default', ['connect', 'build', 'watch']);
gulp.task('start', ['open-browser', 'default']);
