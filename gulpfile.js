const { src, dest, watch, series } = require("gulp");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();

// Copy all html
function copyHtml() {
  return src("src/*.html").pipe(dest("dist"));
}

// Optimize images
function imageMin() {
  return src("src/images/*").pipe(imagemin()).pipe(dest("dist/images"));
}

// Sass Task
function scssTask() {
  return src("src/sass/*.scss", { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

// Concat scripts
function concatJS() {
  return src("src/js/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(dest("dist/js"));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      // baseDir: ".",
      baseDir: "src/.",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["src/sass/**/*.scss", "src/images/*", "src/js/**/*.js"],
    series(copyHtml, imageMin, scssTask, concatJS, browsersyncReload)
  );
}

// Default Gulp task
exports.default = series(
  copyHtml,
  imageMin,
  scssTask,
  concatJS,
  browsersyncServe,
  watchTask
);
