## 实现sleep函数，延迟1s后调用then方法
```javascript
function sleep(delay) {
  return {
    then(onFulfilled) {
      setTimeout(onFulled, delay)
    }
  }
}

// sleep(1000).then(() => console.log('hello'))
```

## 用setTimeout模拟setInterval
```javascript
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
```