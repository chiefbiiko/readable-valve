const createReadableValve = require('./index.js')
const { PassThrough } = require('stream')

const passthru = new PassThrough()

createReadableValve(passthru, chunk => !/fraud/.test(chunk))
  .subscribe(chunk => console.log(String(chunk)))
  .onerror(console.error)

for (const msg of [ 'hi', 'fraud', 'blabla', 'bye' ]) passthru.write(msg)
