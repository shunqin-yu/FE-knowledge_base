module.exports = {
  typeof(obj) {
    const type = typeof obj
    return type !== 'object' ? type :
      Object.prototype.toString.call(obj).split(' ')[1].replace(/\]/, '').toLowerCase()
  },
  isFunction(func) {
    return this.typeof(func) === 'function'
  },
  isObject(obj) {
    return this.typeof(obj) === 'object'
  }
}