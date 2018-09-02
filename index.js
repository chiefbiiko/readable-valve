const createReadableValve = (readable, predicate) => ({
  subscribe (listener, pred) {
    const p = pred || predicate
    if (!p) throw TypeError('no predicate')
    const _listener = (...args) => p(...args) && listener.apply(this, args)
    _listener._id = String(listener)
    readable.on('data', _listener)
    return this
  },
  subscribeOnce (listener, pred) {
    const p = pred || predicate
    if (!p) throw TypeError('no predicate')
    const _listener = (...args) => p(...args) && listener.apply(this, args)
    _listener._id = String(listener)
    readable.once('data', _listener)
    return this
  },
  unsubscribe (listener) {
    const id = String(listener)
    const _listener = readable.listeners('data').find(l => l._id === id)
    if (_listener) readable.removeListener('data', _listener)
    return this
  },
  error (handler) {
    const _handler = (...args) => handler.apply(this, args)
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
