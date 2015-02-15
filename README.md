# bable-connect

[Bable](https://github.com/bable/bable) [connect](https://github.com/senchalabs/connect) plugin

## Installation

    $ npm install bable-connect

## Usage

```javascript
var bableMiddleware = require("bable-connect");

app.use(bableMiddleware({
  options: {
    // options to use when transforming files
  },
  src: "assets",
  dest: "cache"
}));

app.use(connect.static("cache"));
```
