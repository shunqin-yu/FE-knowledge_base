new Promise((resolve) => {
  console.log(1)
  resolve()
}).then(() => {
  console.log(2)
  setTimeout(() => {console.log(5)}, 0)
  Promise.resolve().then(() => {
    console.log(3)
  })
}).then(() => {
  console.log(4)
})