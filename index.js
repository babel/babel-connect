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
    var srcStat;

    var send = function (data) {
      res.set('Content-Type', 'application/javascript');
      res.end(data);
    };

    var write = function (transformed) {
      fs.writeFile(dest, transformed, function (err) {
        if (err) {
          next(err);
        } else {
          cache[url] = +srcStat.mtime;
          send(transformed);
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
      if (cache[url] !== +srcStat.mtime) {
        compile();
      } else {
        fs.readFile(dest, function (err, data) {
          if (err) return next(err);
          send(data);
        });
      }
    };

    fs.stat(src, function (err, stat) {
      if (err && err.code === 'ENOENT') return next();
      else if (err) return next(err);
      srcStat = stat;

      fs.stat(dest, function (err, stat) {
        if (err && err.code !== 'ENOENT') return next(err);

        if (!err && cache[dest]) {
          destExists();
        } else {
          compile();
        }
      });
    });
  };
};
