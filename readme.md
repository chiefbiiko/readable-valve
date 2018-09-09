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
  .onerror(console.error)

for (const msg of [ 'hi', 'fraud', 'blabla', 'bye' ]) passthru.write(msg)
```

The valve will filter out all messages that contain the string `'fraud'`.

***

## API

### `valve = createReadableValve(readable[, pred])`

Create a valve for a readable stream that filters according to a predicate function. If the predicate is not passed at instantiation it must be provided in any calls of `valve.subscribe`.

### `valve.subscribe(listener[, pred][, n])`

Subscribe a listener to the valve. If no predicate was passed at instantiation it must be provided here. If a predicate was passed at instantiation and also to a call of `valve.subscribe`, the latter takes precedence. The trailing parameter can be used to limit the number of listener calls.

> You can register various predicate listeners with a readable stream using only one valve by specifying distinct predicates in `valve.subscribe` calls.

### `valve.unsubscribe(listener)`

Unubscribe a listener from the valve.

### `valve.onerror(listener[, n])`

Handle errors of the underlying readable stream. Setting the trailing parameter to a positive number limits the number of listener calls.

> The valve itself does not generate errors. All errors emitted by a valve are simply forwarded from the underlying readable stream. Thus, the `valve.onerror` method should primarily be used to attach error listeners to readables which do not have any error listeners registered with themselves. 

### `valve.unerror(listener)`

Unregister the passed error listener.

***

## License

[MIT](./license.md)
