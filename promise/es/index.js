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
    const count = promises.length // 异步任务数量
    const results = [] // 输出结果
    let callCount = 0 // 异步任务完成调用次数
    // 返回一个promsie
    return new Promise((resolve, reject) => {
      const processData = (index) => (value) => {
        results[index] = value
        // 如果callCount和任务数量相等，即全部任务执行完成
        if (++callCount === count) resolve(results)
      }

      // 遍历每个任务，如果当前任务为promise就执行then方法，不是promise直接添加至输出结果
      // 每个任务完成时callCount + 1
      for (let i = 0; i < count; i++) {
        const current = promises[i]
        if (isPromise(current)) Promise.resolve(current).then(processData(i), reject)
        else processData(i)(current)
      }
    })
  }
  
  // 竞态：有一个成功或失败便返回
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(resolve, reject)
      }
    })
  }

  static resolve(promise) {
    // 如果为Promise实例对象，直接返回
    if (promise instanceof Promise) return promise

    // 如果是thenable或普通值，则包装城promise
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
    this.onFulfilled = [] // 成功调用函数队列
    this.onRejected = [] // 失败调用函数队列

    const resolve = (value) => {
      if (this.status !== PENDING) return
      this.status = FULFILLED
      this.value = value
      this.onFulfilled.forEach(fn => fn()) // 循环执行成功队列, fn为传入的onFulfilled
    }

    const reject = (reason) => {
      if (this.status !== PENDING) return
      this.status = REJECTED
      this.reason = reason
      this.onRejected.forEach(fn => fn()) // 循环执行失败队列, fn为传入的onRejected
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      // executor执行报错时直接调用reject
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    // 如果入参不为函数类型
    // onFulfilled默认返回上次的结果
    // onRejected默认继续将错误往下一个抛
    utils.isFunction(onFulfilled) || (onFulfilled = v => v)
    utils.isFunction(onRejected) || (onRejected = err => { throw err })

    let promise = new Promise((resolve, reject) => {
      // 由于这个回调(executor)执行时promise实例还未生成完毕，所以想在这里获取实例对象只能通过异步来获取
      // 官方使用的是微任务实现，这里使用setTimeout宏任务实现
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            this.resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            // onFulfilled(resolve)执行报错时直接调用reject
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
            // onRejected(reject)执行报错时直接调用reject
            reject(error)
          }
        })
      }

      // 先调用then，异步调用resolve/reject时
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

    // 每次执行then方法都会返回一个新promise实例，以此实现链式调用
    return promise
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  // 不管成功失败都会走finally，finally回调无参数，执行完finally后会将上个状态返回值透传给下个promise
  finally(cb) {
    return this.then(
      data => Promise.resolve(cb()).then(() => data),
      err => Promise.resolve(cb()).then(() => { throw err })
    )
  }

  resolvePromise(promise, x, resolve, reject) {
    // 如果返回值是当前实例，那么抛错提示循环引用
    if (x === promise) return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    let once = false

    if (utils.isObject(x) || utils.isFunction(x)) {
      try {
        const then = x.then
        if (utils.isFunction(then)) {
          // 认定为promise，执行then方法
          // then.call写法可避免重新x.then获取值
          // 该promise resolve/reject时调用对应的方法，将返回值传递给下一个promsie
          // 状态一经改变便无法再次改变，使用once控制调用
          then.call(
            x,
            y => {
              if (once) return
              once = true
              // y有可能还是一个promsie，所以递归调用该值，如果是promise就继续处理，普通值就resolve
              this.resolvePromise(promise, y, resolve, reject)
            },
            r => {
              if (once) return
              once = true
              reject(r)
            }
          )
        } else {
          // 没有then方法，那么是普通对象或普通函数，直接resolve
          resolve(x)
        }
      } catch (error) {
        // 获取x.then时可能会报错，如：defineProperty设置getter方法内抛错
        if (once) return
        once = true
        reject(error)
      }
    } else {
      // 如果不是对象和函数，直接resolve
      resolve(x)
    }
  }
}

module.exports = Promise