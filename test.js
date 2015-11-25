var http = require("http");
var serveStatic = require("serve-static");
var request = require("supertest");
var assert = require("assert");
var babelMiddleware = require("./");

var serve = serveStatic("cache");
var babel = babelMiddleware({
  options: {
    presets: ["es2015"]
  },
  src: "fixtures",
  dest: "compiled",
  ignore: /node_modules/
});

var server = http.createServer(function(req, res) {
  function onError(err) {
    res.statusCode = err.status || 500;
    res.end(err.message);
    return;
  }
  babel(req, res, function(err) {
    if (err) return onError(err);
    serve(req, res, function(err) {
      if (err) return onError(err);
      res.setHeader("Content-Type", "text/javascript");
      res.end();
    });
  });
});

describe("babelMiddleware()", function() {
  it("should compile", function(done) {
    request(server)
      .get("/fixture.js")
      .expect(function(res) {
        assert.ok(
          res.text.indexOf("function square(n) {") > -1,
          "`" + res.text + "` should contain `function square(n) {`"
        );
      })
      .expect(200, done);
  });

  it("should not compile", function(done) {
    request(server)
      .get("/fixture.txt")
      .expect(function(res) {
        assert.equal(res.text, "");
      })
      .expect(200, done);
  });
});
