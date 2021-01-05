const { typeof } = require('./utils')
const { typeof } = require('./utils')

// 数字化金额 123456 -> 12,345,6
const [int, float] = String(1234567890.12).split('.')
const num = int.split('').reduce((n, n, i) => {
  p += i % 3 === 0 && i > 0 ? ',' + n : n
  return p
}, '')

// console.log(num + '.' + float)
// console.log(1234567890.12).toLocaleString('en-US')

// instanceof 实现
// 只能判断引用类型
function _instanceof(child, parent) {
  if (typeof child !== 'object' || child === null) return false
  let proto = Object.getPrototypeOf(child)
  const prototype = parent.prototype

  while (proto) {
    if (proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }

  return false
}

// console.log(_instanceof(new Promise(() => {}), Promise))

// 手写new
function _new(func, ...args) {
  if (typeof func !== 'function') throw new Error(`func is not a function!`)
  const obj = Object.create(func.prototype)
  const result = func.apply(obj, args)
  return result === undefined ? obj : result
}

// 浅拷贝
function shallowClone(obj) {
  if (typeof obj !== 'object' || obj === null)  return obj
  const newObj = Array.isArray(obj) ? [] : {}

  for (let prop in obj) {
    newObj[prop] = obj[prop]
  }

  return newObj
}

// 深拷贝
function clone(target, map = new Map()) {
  if (typeof target !== 'object' || target === null) return target
  if(map.get(target)) return map.get(target)
  map.set(target)
  let newObj = Array.isArray(target) ? [] : {}
  for (let prop in target) {
    newObj[prop] = clone(target[prop], map)
  }

  return newObj
}

// 用setTimeout模拟setInterval
function setInterval(cb, interval) {
  let timer = null
  function timeout() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb()
      timeout()
    }, interval)
  }

  timeout()
}

// setInterval(() => console.log('hello'), 1000)

// 实现sleep函数，延迟1s后调用then方法
function sleep(delay) {
  return {
    then(onFulfilled) {
      setTimeout(onFulfilled, delay)
    }
  }
}

// sleep(1000).then(() => console.log('hello'))