const utils = require('./../../utils')
const PENDING = Symbol('PENDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')
const isPromise = promise => (utils.isObject(promise) || utils.isFunction(promise)) && utils.isFunction(promise.then)

function defer() {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })

  return dfd
}

class Promise {
  static defer = defer
  static deferred = defer
  static all(promises) {
    const count = promises.length
    const results = []
    let callCount = 0
    return new Promise((resolve, reject) => {
      const processData = (index) => (value) => {
        results[index] = value
        if (++callCount === count) resolve(results)
      }

      for (let i = 0; i < count; i++) {
        const current = promises[i]
        if (isPromise(current)) Promise.resolve(current).then(processData(i), reject)
        else processData(i)(current)
      }
    })
  }
  
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(resolve, reject)
      }
    })
  }

  static resolve(promise) {
    if (promise instanceof Promise) return promise

    return new Promise((resolve, reject) =>
      isPromise(promise) ? promise.then(resolve, reject) : resolve(promise)
    )
  }

  static reject(error) {
    return new Promise((resolve, reject) => reject(error))
  }

  constructor(executor) {
    this.status = PENDING
    this.value = this.reason = undefined
    this.onFulfilled = []
    this.onRejected = []

    const resolve = (value) => {
      if (this.status !== PENDING) return
      this.status = FULFILLED
      this.value = value
      this.onFulfilled.forEach(fn => fn())
    }

    const reject = (reason) => {
      if (this.status !== PENDING) return
      this.status = REJECTED
      this.reason = reason
      this.onRejected.forEach(fn => fn())
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    utils.isFunction(onFulfilled) || (onFulfilled = v => v)
    utils.isFunction(onRejected) || (onRejected = err => { throw err })

    let promise = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            this.resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            this.resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      if (this.status === PENDING) {
        this.onFulfilled.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              this.resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        this.onRejected.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              this.resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })

    return promise
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(cb) {
    return this.then(
      data => Promise.resolve(cb()).then(() => data),
      err => Promise.resolve(cb()).then(() => { throw err })
    )
  }

  resolvePromise(promise, x, resolve, reject) {
    if (x === promise) return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    let once = false

    if (utils.isObject(x) || utils.isFunction(x)) {
      try {
        const then = x.then
        if (utils.isFunction(then)) {
          then.call(
            x,
            y => {
              if (once) return
              once = true
              this.resolvePromise(promise, y, resolve, reject)
            },
            r => {
              if (once) return
              once = true
              reject(r)
            }
          )
        } else {
          resolve(x)
        }
      } catch (error) {
        if (once) return
        once = true
        reject(error)
      }
    } else {
      resolve(x)
    }
  }
}

module.exports = Promise