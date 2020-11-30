const utils = require('./../../utils')
const PENDING = Symbol('PENDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')

const resolvePromise = (promise, x, resolve, reject) => {
  // 自己调用自己，循环引用
  // const p = new Promise(resolve => resolve(1)).then(res => p)
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }

  // 控制状态： 状态一旦发生改变，则无法更改
  let once = false

  if (utils.isFunction(x) || utils.isObject(x)) {
    try {
      let then = x.then
      if (utils.isFunction(then)) {
        // then.call的写法可避免再次获取x.then
        then.call(x, y => {
          if (once) return
          once = true
           
          resolvePromise(promise, y, resolve, reject)
        }, r => {
          if (once) return
          once = true
          resolvePromise(promise, r, resolve, reject)
        })
      } else resolve(x) // 结果x为普通对象则直接resolve
    } catch (error) {
      if (once) return
      once = true
      reject(error)
    }
  } else resolve(x) // 结果x为普通值则直接resolve
}

module.exports = class Promise {
  constructor(executor) {
    // 默认为pending状态
    this.status = PENDING
    this.value = this.reason = undefined
    // 存放then里的成功和失败的回调函数
    this.onFulfilled = []
    this.onRejected = []

    const resolve = (value) => {
      // status已经发生过改变
      if (this.status !== PENDING) return
      this.value = value
      this.status = FULFILLED
      // 执行then里注册的成功回调函数
      this.onFulfilled.forEach(fn => fn())
    }

    const reject = (reason) => {
      // status已经发生过改变
      if (this.status !== PENDING) return
      this.reason = reason
      this.status = REJECTED
      // 执行then里注册的失败回调函数
      this.onRejected.forEach(fn => fn())
    }

    try {
      // 运行出错，则调用reject
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  // 默认成功回调会返回传入的参数，失败回调回继续抛出异常到下个then失败回调
  // 返回一个promise实例，以实现链式调用
  then(onFulfilled = res => res, onRejected = err => { throw err }) {
    const promise = new Promise((resolve, reject) => {
      // 同步的逻辑:
      /** 
       * new Promise(resolve => resolve(1)).then(console.log)
      */
      {
        if (this.status === FULFILLED) {
          // 不使用setTimeout模拟异步就无法获取promise实例
          // 因为此时promise实例还未生成
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              // 传入回调的返回值
              resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              // 运行出错，则调用reject
              reject(error)
            }
          })
        }

        if (this.status === REJECTED) {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        }
      }

      // 异步的逻辑
      // then会立即执行，但会把传入的成功失败回调放入队列中，等待resolve/reject调用时一次执行队列
      /** 
       * new Promise(resolve => {
       * setTimeout(resolve, 1000)
       * }).then(console.log)
      */
      if (this.status === PENDING) {
        // 将回调存入队列中
        this.onFulfilled.push(() =>
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }))
        this.onRejected.push(() => setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }))
      }

    })

    return promise
  }
}