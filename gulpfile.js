var gulp = require('gulp');
var imageMin = require('gulp-imagemin');
var uglify = require('gulp-uglify');



gulp.task('scripts', function() {
    // 1. 找到文件
    gulp.src('./src/js/*.js')
    // 2. 压缩文件
        .pipe(uglify({ mangle: false }))
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('./Szwechat/skin/js'))
})


gulp.task('default',['scripts'])


gulp.task('watch',function(){
    gulp.watch('./src/js/*.js', ['scripts']);
});