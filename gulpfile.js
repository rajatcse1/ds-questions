var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    clean = require('gulp-clean'),
    sass = require('gulp-ruby-sass'),
    util = require("gulp-util"),
    rename = require('gulp-rename'),
    zip = require('gulp-zip'),
    unzip = require('gulp-unzip'),
    exec = require('child_process').exec,

    devDirectory = 'app/',
    prodDirectory = 'build/',
    exeDirectory = 'exe/',
    nwEngine = 'nw.zip';

//adaptive to es6 format
require('es6-promise').polyfill();

gulp.task('default', function() {
    // place code for your default task here

});

gulp.task('webserver', function() {
    gulp.src(devDirectory)
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('prodServer', function() {
    gulp.src(prodDirectory)
        .pipe(webserver({
            livereload: true,
            open: true,
            port: 8001
        }));
});

gulp.task('cleanExe', function() {
    return gulp.src(exeDirectory, { read: false })
        .pipe(clean());
});

gulp.task('copyNW', ['cleanExe'], function() {
    return gulp.src(nwEngine).pipe(unzip()).pipe(gulp.dest(exeDirectory));
    //return gulp.src([nwEngineDirectory + '/**/*']).pipe(gulp.dest(exeDirectory));
});

gulp.task('zipApp', ['copyNW'], function() {
    return gulp.src(prodDirectory + '/**/*')
            .pipe(zip('app.nw'))
            .pipe(gulp.dest(exeDirectory));
});

gulp.task('buildApp', ['zipApp'], function(cb){
    exec('copy /b exe\\nw.exe+exe\\app.nw exe\\TMApp.exe', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('clean', function() {
    return gulp.src(prodDirectory, { read: false })
        .pipe(clean());
});

gulp.task('copyManifest', ['clean'], function() {
    return gulp.src(devDirectory + '/manifest.json')
                .pipe(rename('/package.json'))
                .pipe(gulp.dest(prodDirectory));
});

gulp.task('copyAssets', ['copyManifest'], function() {
    return gulp.src([devDirectory + '/assets/*']).pipe(gulp.dest(prodDirectory + '/assets'));
});

gulp.task('copyFonts', ['copyAssets'], function() {
    return gulp.src([devDirectory + '/bower_components/font-awesome/fonts/*.*']).pipe(gulp.dest(prodDirectory + '/fonts'));
});

gulp.task('usemin', ['copyFonts'], function() {
    return gulp.src(devDirectory + '/index.html')
        .pipe(usemin({
            css: [rev()],
            css1: [rev()],
            html: [minifyHtml({ empty: true })],
            js: [uglify(), rev()],
            js1: [uglify(), rev()],
            inlinejs: [uglify()],
            inlinecss: [minifyCss(), 'concat']
        }))
        .pipe(gulp.dest(prodDirectory));
});

gulp.task('sass', function () {
  return sass(devDirectory + '/styles/scss/app.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest(devDirectory + '/styles'));
});

gulp.task("watch", function(){
    util.log("Watching scss files for modifications");
    gulp.watch(devDirectory + '/styles/scss/*.scss', ["sass"]);
});

gulp.task('dev', ['webserver', 'watch']);
gulp.task('build', ['usemin']);
gulp.task('prod', ['prodServer']);
