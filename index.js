var path = require("path");
var to5  = require("6to5-core");
var fs   = require("fs");
var _    = require("lodash");

module.exports = function (opts) {
  opts = _.defaults(opts || {}, {
    options: {},
    dest:    "cache",
    src:     "assets"
  });

  var cache = Object.create(null);

  return function (req, res, next) {
    var url = req.url;
    if (!to5.canCompile(url)) return next();

    var dest = path.join(opts.dest, url);
    var src  = path.join(opts.src, url);

    var write = function (transformed) {
      fs.writeFile(dest, transformed, function (err) {
        if (err) {
          next(err);
        } else {
          cache[url] = Date.now();
          next();
        }
      });
    };

    var compile = function () {
      var transformOpts = _.clone(opts.options);

      to5.transformFile(opts.dest, transformOpts, function (err, result) {
        if (err) return next(err);
        write(result.code);
      });
    };

    var destExists = function () {
      fs.stat(dest, function (err, stat) {
        if (err) return next(err);

        if (cache[url] < +stat.mtime) {
          compile();
        } else {
          next();
        }
      });
    };

    fs.exists(src, function (exists) {
      if (!exists) return next();

      fs.exists(dest, function (exists) {
        if (exists && cache[dest]) {
          destExists();
        } else {
          compile();
        }
      });
    });
  };
};
