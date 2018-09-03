const createReadableValve = (readable, predicate) => {
  const listenerMap = new Map()
  return Object.freeze({
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

      listenerMap.set(listener, _listener)
      readable.on('data', _listener)

      return this
    },
    unsubscribe (listener) {
      const _listener = listenerMap.get(listener)
      if (_listener) readable.removeListener('data', _listener)
      return this
    },
    onerror (listener, n) {
      n = typeof n === 'number' && n > 0 ? Math.round(n) : NaN

      if (typeof listener !== 'function')
        throw TypeError('listener is not a function')

      const _listener = (...args) => {
        listener.apply(this, args)
        if (n && !--n) readable.removeListener('error', _listener)
      }

      listenerMap.set(listener, _listener)
      readable.on('error', _listener)

      return this
    },
    unerror (listener) {
      const _listener = listenerMap.get(listener)
      if (_listener) readable.removeListener('error', _listener)
      return this
    }
  })
}

module.exports = createReadableValve
