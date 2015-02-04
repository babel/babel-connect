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
    var destStat;

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

      to5.transformFile(src, transformOpts, function (err, result) {
        if (err) return next(err);
        write(result.code);
      });
    };

    var destExists = function () {
      if (cache[url] < +destStat.mtime) {
        compile();
      } else {
        next();
      }
    };

    fs.stat(src, function (err, stat) {
      if (err && err.code === 'ENOENT') return next();
      else if (err) return next(err);

      fs.stat(dest, function (err, stat) {
        if (err && err.code !== 'ENOENT') return next(err);
        destStat = stat;

        if (!err && cache[dest]) {
          destExists();
        } else {
          compile();
        }
      });
    });
  };
};
