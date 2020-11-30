const Promise = require('./lib/index')

const a = () => new Promise((resolve) => {
  setTimeout(() => {resolve(111)}, 1000)
})

Promise.all([1,2,3,a(), a()]).then(console.log)