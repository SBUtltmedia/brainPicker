var gulp = require("gulp");
var gutil = require("gulp-util");
var livereload = require("gulp-livereload");
var webpack = require("webpack");

gulp.task("webpack", function () {
    webpack(
        require("./webpack.config.js"),
        function (err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log(stats.toString({ colors: true }));
        }
    );
});

gulp.task("watch", function () {
    livereload.listen();

    gulp.watch([
        "dist/bundle.js",
        "index.html",
    ], function (event) {
        livereload.changed(event);
    });

});

gulp.task("default", ["webpack", "watch"]);
