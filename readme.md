# readable-valve

[![build status](http://img.shields.io/travis/chiefbiiko/readable-valve.svg?style=flat)](http://travis-ci.org/chiefbiiko/readable-valve) [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/chiefbiiko/readable-valve?branch=master&svg=true)](https://ci.appveyor.com/project/chiefbiiko/readable-valve) [![Security Responsible Disclosure](https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg)](./security.md)

***

Subscribe to filtered emits of readable streams.

***

## Get it!

```
npm install --save readable-valve
```

***

## Usage

``` js
const createReadableValve = require('readable-valve')
const { PassThrough } = require('stream')

const passthru = new PassThrough()

createReadableValve(passthru, chunk => !/fraud/.test(chunk))
  .subscribe(chunk => console.log(String(chunk)))
  .error(console.error)

for (const msg of [ 'hi', 'fraud', 'blabla', 'bye']) passthru.write(msg)

```

The valve will filter out all messages that contain the string `'fraud'`.

***

## API

### `valve = createReadableValve(stream, pred)`

Create a valve for a readable stream that filters according to a predicate function.

### `valve.subscribe(listener)`

Subscribe a listener to the valve.

### `valve.subscribeOnce(listener)`

Subscribe a listener to the valve that will be called at most once.

### `valve.unsubscribe(listener)`

Unubscribe a listener from the valve.

### `valve.error(handler)`

Handle stream errors.

### `valve.unerror(handler)`

Unregister the passed error handler.

***

## License

[MIT](./license.md)
