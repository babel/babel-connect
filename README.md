# babel-connect

[Babel](https://github.com/babel/babel) [connect](https://github.com/senchalabs/connect) plugin

## Installation

    $ npm install babel-connect

## Usage

```javascript
var babelMiddleware = require("babel-connect");

app.use(babelMiddleware({
  options: {
    // options to use when transforming files
  },
  src: "assets",
  dest: "cache",
  ignore: /node_modules/
}));

app.use(connect.static("cache"));
```
