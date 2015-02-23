var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var open = require('gulp-open');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var port = process.env.port || 3000;
var autoPrefixerOptions = {
    browsers: ['last 2 version', '> %5']
}
gulp.task('sass', function () {
    gulp.src('./app/src/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(autoPrefixerOptions))
        .pipe(concat('custom.css'))
        .pipe(gulp.dest('./app/dist'));
});

gulp.task('browserify', function () {
    browserify('./app/src/js/app.js')
        .transform('reactify', {
            'es6': true
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./app/dist'));
});

gulp.task('connect', function () {
    connect.server({
        root: 'app',
        port: port,
        livereload: true
    });
});

gulp.task('open', function () {
    var options = {
        url: 'http://localhost:' + port,
    };
    gulp.src('./app/index.html').pipe(open('', options));
});

gulp.task('html', function () {
    gulp.src('./app/*.html').pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('./app/dist/**/*.js').pipe(connect.reload());
});

gulp.task('css', function () {
    gulp.src('./app/dist/**/*.css').pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('./app/index.html', ['html']);
    gulp.watch('./app/dist/**/*.js', ['js']);
    gulp.watch('./app/dist/**/*.css', ['css']);
    gulp.watch('./app/src/**/*.scss', ['sass']);
    gulp.watch('./app/src/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify', 'sass']);
gulp.task('serve', ['browserify', 'sass', 'connect', 'open', 'watch']);