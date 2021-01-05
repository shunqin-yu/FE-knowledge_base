## forwardRef
> 高阶函数：使父组件能调用函数式自组件方法

```javascript
class Parent extends React.Component {
  showChild = () => this.child.changeVisible(true)

  onRef = (ref) => (this.child = ref)

  render() {
    return (
      <React.Fragment>
        <button onClick={this.showChild}>Parent</button>
        <Child ref={this.onRef} />
      </React.Fragment>
    )
  }
}

const Child = forwardRef((props, ref) => {
  const [visible, changeVisible] = useState(false)

  // 暴露的自组件方法，供父组件调用
  useImperativeHandle(ref, () => ({
    changeVisible,
  }))

  return visible && <h1 onClick={() => changeVisible(false)}>Child</h1>
})
```


## useCallback
```javascript
function Parent() {
  const [value, setValue] = useState(0)

  // 返回一个回调函数，如果第二个参数没有指定改变的值，只会第一次返回新的回调函数，不再更新
  const changeValue = useCallback(() => {
    setValue(1)
  }, [])

  return (
    <div>
      {value}
      <Child onClick={changeValue} />
    </div>
  )
}

// 如果Parent不使用useCallback缓存onClick，那么子组件每次都会随父组件更新而更新，因为onClick每次都在变化
const Child = React.memo(function Child(props) {
  console.log('---render Child---')
  return <div onClick={props.onClick}>click me</div>
})
```

## useMemo
```javascript
function Parent() {
  const [value, setValue] = useState(0)
  const [num, setNum] = useState(0)
  const getNum = useMemo(() => {
    // 只有当num发生更改时才会重新执行回调
    console.log('useMemo')
    return () => {
      // 每次都会执行
      console.log('return')
      return 1
    }
  }, [num])

  return (
    <div>
      {getNum()}
      <button onClick={() => setValue(1)}>click me</button>
      <button onClick={() => setNum(1)}>click me1</button>
    </div>
  )
}
```


## useEffect
```javascript
function App() {

  useEffect(() => {
    return () => {} // 返回的callback为组件销毁时调用，相当于WillUnMount
  }, []) // 依赖项为空数组时只执行一次，相当于DidMount，依赖项为null时则每次组件渲染完后都调用，相当于DidUpdate
}
```

## React.memo
```javascript
function Parent() {
  const [value, setValue] = useState(0)

  function handleClick() {
    setValue(v => v + 1)
  }
  return (
    <div>
      <button onClick={handleClick}>click me!</button>
      {value}
      <Child name={value} />
    </div>
  )
}

// 无第二个参数时，props无更新不重新执行，有第二个参数时，根据返回值判断是否重新执行
// 类似于shouldComponentUpdate
const Child = React.memo((props) => {
  console.log('---render Child---')
  return <div>
    {props.name}
  </div>
}, (prevProps, nextProps) => {
  return true // true 不渲染，false 渲染
})
```