const tape = require('tape')
const { PassThrough } = require('stream')
const createReadableValve = require('./index.js')

tape('subscribe', t => {
  t.plan(3)
  const passthru = new PassThrough()

  createReadableValve(passthru, chunk => !/fraud/.test(chunk))
    .subscribe(chunk => t.false(/fraud/.test(chunk), 'no fraud passed thru'))
    .error(t.end)

  for (const msg of [ 'hi', 'fraud', 'blabla', 'bye']) passthru.write(msg)
})

tape('subscribeOnce', t => {
  const passthru = new PassThrough()
  var called = 0

  createReadableValve(passthru, chunk => !/fraud/.test(chunk))
    .subscribeOnce(chunk => {
      if (++called > 1) t.fail('more than once')
      t.false(/fraud/.test(chunk), 'just once')
    })
    .error(t.end)

  for (const msg of [ 'hi', 'fraud', 'blabla', 'bye']) passthru.write(msg)

  setTimeout(t.end, 300)
})

tape('unsubscribe', t => {
  const passthru = new PassThrough()
  var called = 0

  const valve = createReadableValve(passthru, chunk => !/fraud/.test(chunk))
  valve.error(t.end)

  valve.subscribe(function listener (chunk) {
    if (++called > 1) t.fail('more than once')
    t.false(/fraud/.test(chunk), 'just once')
    valve.unsubscribe(listener)
  })

  var pending = 4
  for (const msg of [ 'hi', 'fraud', 'blabla', 'bye']) {
    passthru.write(msg)
    if (!--pending) setTimeout(t.end, 300)
  }
})

tape('error', t => {
  const passthru = new PassThrough()

  createReadableValve(passthru, chunk => !/fraud/.test(chunk))
    .subscribe(chunk => t.false(/fraud/.test(chunk), 'no fraud passed thru'))
    .error(err => {
      t.ok(err.message, 'some error')
      passthru.pause().unpipe().removeAllListeners().destroy() // just joking
      t.end()
    })

  for (const msg of [ 'fraud', 'money', 'hi' ]) {
    if (msg === 'hi') {
      passthru.emit('error', Error('some error'))
      break
    }
    passthru.write(msg)
  }
})

tape('unerror', t => {
  try {
    const passthru = new PassThrough()
    var called = 0

    createReadableValve(passthru, chunk => !/fraud/.test(chunk))
      .subscribe(chunk => t.false(/fraud/.test(chunk), 'no fraud passed thru'))
      .error(function handler (err) {
        if (++called > 1) t.fail('not unerrored')
        t.ok(err.message, 'some error')
        this.unerror(handler)
      })

    for (const msg of [ 'fraud', 'hi' ]) {
      passthru.write(msg)
      passthru.emit('error', Error('some error'))
    }


  } catch (err) {
    t.pass('the second error event is unhandled as it should be')
    setTimeout(t.end, 300)
  }
})

tape('fatal', t => {
  t.throws(() => {
    createReadableValve(new PassThrough())
      .subscribe(chunk => t.false(/fraud/.test(chunk), 'no fraud passed thru'))
  }, TypeError)

  t.end()
})

tape('predicate override', t => {
  t.plan(1)
  const passthru = new PassThrough()

  createReadableValve(passthru, chunk => !/fraud/.test(chunk))
    .subscribe(
      chunk => t.true(/fraud/.test(chunk), 'only fraud'), // listener
      chunk => /fraud/.test(chunk)                        // predicate
    )
    .error(t.end)

  for (const msg of [ 'hi', 'fraud', 'blabla', 'bye']) passthru.write(msg)
})
