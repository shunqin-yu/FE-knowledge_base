const utils = require('./../../utils')
const PENDING = Symbol('PENDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')
const isPromise = p => (utils.isFunction(p) || utils.isObject(p)) &&
      utils.isFunction(p.then)

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
  static resolve(inst) {
    if (inst instanceof Promise) return inst

    return new Promise((resolve, reject) => {
      if (isPromise(inst)) {
        then.call(inst, resolve, reject)
      } else resolve(inst)
    })
  }
  static reject(inst) {
    return new Promise((resolve, reject) => reject(inst))
  }
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const current = promises[i]
        Promise.resolve(current).then(resolve, reject)
      }
    })
  }
  static all(promises) {
    const results = []
    let callCount = 0
  
    return new Promise((resolve, reject) => {
      const processData = (index, value) => {
        results[index] = value
        if (++callCount === promises.length) resolve(results)
      }
  
      for (let i = 0; i < promises.length; i++) {
        const current = promises[i]
        if (isPromise(current)) {
          current.then(data => {
            results[i] = data
            processData(i, data)
          }, reject)
        } else processData(i, current)
      }
    })
  }
  constructor(executor) {
    this.status = PENDING
    this.value = this.reason = undefined
    this.onFulfilled = []
    this.onRejected = []

    const resolve = (value) => {
      if (this.status !== PENDING) return
      this.value = value
      this.status = FULFILLED
      this.onFulfilled.forEach(fn => fn())
    }

    const reject = (reason) => {
      if (this.status !== PENDING) return
      this.reason = reason
      this.status = REJECTED
      this.onRejected.forEach(fn => fn())
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }

    let once = false

    if (utils.isFunction(x) || utils.isObject(x)) {
      try {
        let then = x.then
        if (utils.isFunction(then)) {
          then.call(x, y => {
            if (once) return
            once = true
            this.resolvePromise(promise, y, resolve, reject)
          }, r => {
            if (once) return
            once = true
            reject(r)
          })
        } else resolve(x)
      } catch (error) {
        if (once) return
        once = true
        reject(error)
      }
    } else resolve(x)
  }

  then(onFulfilled, onRejected) {
    utils.isFunction(onFulfilled) || (onFulfilled = res => res)
    utils.isFunction(onRejected) || (onRejected = err => { throw err })
    const promise = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            this.resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            this.resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      if (this.status === PENDING) {
        this.onFulfilled.push(() =>
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              this.resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }))
        this.onRejected.push(() => setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            this.resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }))
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
}

module.exports = Promise