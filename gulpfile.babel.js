import gulp from "gulp";
import cp from "child_process";
import BrowserSync from "browser-sync";


const browserSync = BrowserSync.create();
const hugoBin = `./bin/hugo.${process.platform === "win32" ? "exe" : process.platform}`;
const defaultArgs = ["-d", "../dist", "-s", "site"];

if (process.env.DEBUG) {
  defaultArgs.unshift("--debug");
}

gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, ["--buildDrafts", "--buildFuture"]));
gulp.task("build", ["hugo"]);
gulp.task("build-preview", [ "hugo-preview"]);

gulp.task("server", ["hugo"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./site/static/img/icons-*.svg", ["svg"]);
  gulp.watch("./site/**/*", ["hugo"]);
});

function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload("notify:false");
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
