const createReadableValve = (readable, predicate) => ({
  subscribe (listener, pred, n) {
    if (typeof pred === 'number') {
      n = pred
      pred = null
    }

    n = typeof n === 'number' && n > 0 ? Math.round(n) : NaN
    const p = pred || predicate

    if (typeof listener !== 'function')
      throw TypeError('listener is not a function')
    if (typeof p !== 'function')
      throw TypeError('predicate is not a function')

    const _listener = (...args) => {
      if (p.apply(this, args)) {
        listener.apply(this, args)
        if (n && !--n) readable.removeListener('data', _listener)
      }
    }

    _listener._id = String(listener)
    readable.on('data', _listener)

    return this
  },
  unsubscribe (listener) {
    const id = String(listener)
    const _listener = readable.listeners('data').find(l => l._id === id)
    if (_listener) readable.removeListener('data', _listener)
    return this
  },
  onerror (handler, n) {
    n = typeof n === 'number' && n > 0 ? Math.round(n) : NaN

    if (typeof handler !== 'function')
      throw TypeError('handler is not a function')

    const _handler = (...args) => {
      handler.apply(this, args)
      if (n && !--n) readable.removeListener('error', _handler)
    }

    _handler._id = String(handler)
    readable.on('error', _handler)

    return this
  },
  unerror (handler) {
    const id = String(handler)
    const _handler = readable.listeners('error').find(h => h._id === id)
    if (_handler) readable.removeListener('error', _handler)
    return this
  }
})

module.exports = createReadableValve
