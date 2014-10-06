# 6to5-connect

[6to5](https://github.com/sebmck/6to5) [connect](https://github.com/senchalabs/connect) plugin

## Installation

    $ npm install 6to5-connect

## Usage

```javascript
var to5 = require("6to5");

app.use(to5.middleware({
  options: {
    // options to use when transforming files
  },
  src: "assets",
  dest: "cache"
}));

app.use(connect.static("cache"));
```
