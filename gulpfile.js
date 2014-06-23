var gulp = require('gulp'),
    connect = require('gulp-connect'),
    config = require('./config.json');

gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('./app/*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./app/*.html'], ['html']);
    gulp.watch(['./src/*.js'], ['scripts']);
});

gulp.task('scripts', function(){
    gulp.src(config.vendor_files.js)
        .pipe(gulp.dest(config.build_dir + '/js/vendor'))
    gulp.src(config.dist_files.js)
        .pipe(gulp.dest(config.build_dir + '/dist'))
    gulp.src(config.dist_files.assets)
        .pipe(gulp.dest(config.build_dir + '/dist/assets'));
});

gulp.task('default', ['scripts','connect', 'watch']);