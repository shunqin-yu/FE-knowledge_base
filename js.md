## DOM
1. ```document```和```document.documentElement```的区别
document表示整个html文件，document.documentElement表示文件中的html元素
2. ```preventDefault()``` 阻止默认事件，如form表单提交，a标签href
3.```stopPropagation()``` 阻止事件冒泡


## 闭包
> 当前作用域之外访问的函数
> debonce、throllte

## 作用域
> 静态词法作用域，即定义时就已经生成

## AOP 面向切面编程
> java称之为注解，比较常见的场景是用来打印日志，执行某个方法的前后打印日志
> 对原方法入侵性不高，可插拔
> 前端称之为装饰器，react里的高阶组件都能用装饰器的写法，vue重写array方法也可用aop实现函数劫持

## 发布订阅模式和观察者模式
> 发布订阅模式：on和emit没有关系，两者通过event桥梁联系
> 观察者模式：观察者和被观察者有关系，将观察者放入被观察者里

## promise
> 优点： 
  1. 解决了回调地狱的问题，可读性强
  2. 多个异步并行 Promise.all
> 缺点：
  1. 无法终止异步
  2. 相比同步代码还是欠缺可读性，所以后来有了async + await语法糖
