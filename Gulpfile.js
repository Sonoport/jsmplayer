"use strict";

var compass = require('gulp-compass');

var paths = {
    files: {
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

gulp.task('playerbuild', ['player:compass']);

gulp.task('player', ['player:compass', 'watch:player'], function(){
    return gulp.src([paths.dirs.player])
    .pipe(webserver({
        port: 8080,
        open: true,
        host : "0.0.0.0"
    }));
});

gulp.task('watch:player', function(){
    gulp.watch(paths.files.playerCSS, ['player:compass']);
});

