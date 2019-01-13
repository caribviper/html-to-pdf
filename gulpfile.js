const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require('gulp-rename');
const merge = require('merge2');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return merge([
    tsResult.js.pipe(gulp.dest('lib')),
    tsResult.dts.pipe(gulp.dest('lib'))
  ]);
});

gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function () {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('lib'));
});

gulp.task('compress', function (cb) {
  pump([
    gulp.src('lib/**/*.js'),
    uglify(),
    rename({suffix: '.min'}),
    gulp.dest('dist')
  ],
    cb
  );
});

gulp.task('default', ['watch', 'assets', 'compress']);
