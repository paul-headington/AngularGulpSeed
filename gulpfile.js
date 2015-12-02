// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var angularInjector = require('gulp-angular-injector');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var sass = require('gulp-sass');
var open = require('gulp-open');
var karma = require('karma');


// tasks
gulp.task('lint', function () {
  gulp.src(['./app/**/*.js', '!./bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
});

gulp.task('bower', function () {
  gulp.src('./index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('./'));
});

gulp.task('inject-index', function () {
    
//    gulp.src('./index.html')
//        .pipe(inject(
//            gulp.src(['./app/**/*.js', '!./app/**/*.test.js', './app/**/*.css', './assets/**/*.css']) 
//                .pipe(angularFilesort())
//            ))
//        .pipe(gulp.dest('./'));
        
    var target = gulp.src('./index.html');
      // It's not necessary to read the files (will speed up things), we're only after their paths:
      var sources = gulp.src(['./app/**/*.js', '!./app/**/*.test.js', './app/**/*.css', './assets/**/*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('sass', function () {
  var injectAppFiles = gulp.src(['./app/**/*.scss', '!./app/app.scss'], {read: false});
  var target = gulp.src('./app/app.scss');
    
  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }
 
  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };
 
  return target.pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(gulp.dest('./app/'))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'))
    .pipe(connect.reload());
    
});

gulp.task('html', function () {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./assets/**/*.css', '!./bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/assets/'));
});

gulp.task('clean-angular', function(){
  gulp.src(['./app/**/*.js', '!./bower_components/**'])
    .pipe(angularInjector())
    .pipe(gulp.dest('./app/'));
});

gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/app/'));
});

gulp.task('copy-bower-components', function () {
  gulp.src('./bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', function () {
  gulp.src(['./*.html','./*.ico','./*.txt', '!./node_modules/**', '!./dist/**'])
    .pipe(gulp.dest('dist/'));
  gulp.src(['./app/**/*.html', '!./node_modules/**', '!./dist/**'])
    .pipe(gulp.dest('dist/app/'));
});

gulp.task('copy-assets', function() {
  gulp.src(['./assets/**/*.*', '!./bower_components/**'])
    .pipe(gulp.dest('./dist/assets/'));
});

gulp.task('test', function() {
    server = new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
      });
    server.start();
    
  
});

gulp.task('watch', function(){
    console.log("watching....");
    gulp.watch('./app/**/*.js', ['inject-index','sass']);        
    //gulp.watch('./bower_components/**', ['bower']);
    gulp.watch('./app/**/*.scss', ['sass']);
    gulp.watch('./app/**/*.html', ['html']);
    gulp.watch('./assets/**/*.css', ['inject-index']);
});

gulp.task('serve', function () {
  connect.server({
    root: '',
    port: 8000,
    livereload: true
  });
  gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:8000'}));
});

gulp.task('serveDist', function () {
  connect.server({
    root: 'dist/',
    port: 9000,
    livereload: true
  });
    gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:9000'}));
});

// default task
gulp.task('default',
  ['lint', 'sass', 'inject-index', 'bower', 'serve', 'watch']
);

//to do update injector to injec the minified files
gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['lint', 'copy-assets', 'minify-css', 'clean-angular', 'minify-js', 'inject-index', 'bower', 'copy-html-files', 'copy-bower-components', 'serveDist' ]
  );
});