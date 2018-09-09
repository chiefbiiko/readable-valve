const createReadableValve = (readable, predicate) => {
  const listeners = new Map()
  return Object.freeze({
    subscribe (listener, pred, n) {
      if (typeof pred === 'number') {
        n = pred
        pred = null
      }
      n = typeof n === 'number' && n > 0 && n % 1 === 0 ? n : null
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
      listeners.set(listener, _listener)
      readable.on('data', _listener)
      return this
    },
    unsubscribe (listener) {
      const _listener = listeners.get(listener)
      if (_listener) readable.removeListener('data', _listener)
      return this
    },
    onerror (listener, n) {
      n = typeof n === 'number' && n > 0 && n % 1 === 0 ? n : null
      if (typeof listener !== 'function')
        throw TypeError('listener is not a function')
      const _listener = (...args) => {
        listener.apply(this, args)
        if (n && !--n) readable.removeListener('error', _listener)
      }
      listeners.set(listener, _listener)
      readable.on('error', _listener)
      return this
    },
    unerror (listener) {
      const _listener = listeners.get(listener)
      if (_listener) readable.removeListener('error', _listener)
      return this
    }
  })
}

module.exports = createReadableValve
