"use strict";

var gulp = require('gulp');
var compass = require('gulp-compass');
var webserver = require('gulp-webserver');
var cached = require('gulp-cached');
var jshint = require('gulp-jshint');
var prettify = require('gulp-jsbeautifier');

var paths = {
    files: {
        playerJS: 'js/player.js',
        playerSRC: '**/*.+(js|css)',
        playerCSS: '**/*.css',
    },
    dirs: {
        player: './',
        playerCSS: 'css/',
        playerSASS: 'sass/',
    },
};

/*
**** Player ****
*/

gulp.task('player:compass', function (){
    return gulp.src(paths.dirs.player + "sass/*.scss")
    .pipe(compass({
        css: paths.dirs.playerCSS,
        sass: paths.dirs.playerSASS,
        require: ['susy', 'breakpoint']
    }));
});

gulp.task('jshint', function(){
     gulp.src([paths.files.playerJS, 'Gulpfile.js'])
     .pipe(cached('jshint:src'))
     .pipe(jshint('.jshintrc'))
     .pipe(jshint.reporter('jshint-stylish'))
     .pipe(jshint.reporter('fail'));
});

gulp.task('jsbeautify', ['jshint'], function(){
    gulp.src(paths.files.playerJS)
    .pipe(cached('beautify:src'))
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('js/'));
});

gulp.task('playerbuild', ['jsbeautify','player:compass']);

gulp.task('player', ['playerbuild', 'watch:player'], function(){
    return gulp.src([paths.dirs.player])
    .pipe(webserver({
        port: 8080,
        open: true,
        host : "0.0.0.0"
    }));
});

gulp.task('default',[ 'player']);

gulp.task('watch:player', function(){
    gulp.watch(paths.files.playerCSS, ['player:compass']);
});

