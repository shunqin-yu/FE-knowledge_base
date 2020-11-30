const Promise = require('./lib/index')


new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
}).then(res1 => {
  return new Promise((resolve) => {
    console.log({res1})
    setTimeout(() => resolve(2))
  })
}).finally(() => {
  return 1
}).then(console.log)