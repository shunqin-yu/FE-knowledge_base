## DOM

1. `document`和`document.documentElement`的区别
   document 表示整个 html 文件，document.documentElement 表示文件中的 html 元素
2. `preventDefault()` 阻止默认事件，如 form 表单提交，a 标签 href 3.`stopPropagation()` 阻止事件冒泡

## 发布订阅模式和观察者模式

> 发布订阅模式：on 和 emit 没有关系，两者通过 event 桥梁联系
> 观察者模式：观察者和被观察者有关系，将观察者放入被观察者里

## promise

> 优点：

1. 解决了回调地狱的问题，可读性强
2. 多个异步并行 Promise.all
   > 缺点：
3. 无法终止异步
4. 相比同步代码还是欠缺可读性，所以后来有了 async + await 语法糖

## AOP 面向切面编程

> java 称之为注解，比较常见的场景是用来打印日志，执行某个方法的前后打印日志
> 对原方法入侵性不高，可插拔
> 前端称之为装饰器，react 里的高阶组件都能用装饰器的写法，vue 重写 array 方法也可用 aop 实现函数劫持

## 执行上下文
> 执行上下文是javascript代码解析和执行时
> 每个函数都有对应的执行上下文
> 执行（调用）栈用来管理执行上下文，先进后出
> 执行上下文分为：全局上下文、函数上下文、eval上下文

### 包含内容
1. 变量对象
2. 作用域链
3. 词法对象
4. this指针

### 周期
1. 创建阶段（函数被调用时、代码执行之前）
   - 创建变量对象：初始化var声明的变量、outer（作用域链）
   - 创建词法对象：初始化arguments、let、const、function声明的变量
   - 创建作用域链
   - 确定this指向

2. 执行阶段
   - 代码执行
   - 变量赋值

3. 回收阶段
   - 执行上下文出栈
   - GC回收

### 作用域-词法（静态）作用域
词法作用域是指作用域由代码中函数声明的位置决定而不是执行时的位置，所以词法作用域是静态的

### 区分作用域和执行上下文
1. 作用域只是一个“范围”，其中没有值，值是通过作用域对应的执行上下文环境中的变量来查找的，所以作用域是“静态”的，而执行上下文是“动态”的
2. 作用域中变量的值是在“执行”时确定，而作用域是在函数创建时就确定
3. 查找作用域下某个变量的值，就需要找到这个作用域对应的执行上下文环境，再在其中找到该变量的值

### 作用域链
> 每个执行上下文的变量环境中，都包含了一个外部引用outer，用来指向外部的执行上下文
> 当一段代码执行时，js引擎首先会在当前执行上下文中寻找该变量，如未找到，那么会继续在outer所指向的作用域链中查找，沿着outer查找的单向链表 我们称为作用域链

![作用域链查找过程](https://static001.geekbang.org/resource/image/20/a7/20a832656434264db47c93e657e346a7.png)

### let、const、var的区别
> 作用域快中通过let、const定义的变量，会被存放在执行上下文中的“词法环境”中，这个区域中的变量并不影响作用域块之外的变量
> 在词法环境内部，维护了一个小型栈结构，栈底是函数最外层的变量，进入一个作用域块后，就会把该作用域块内部的变量压入栈顶；当作用域执行完成之后就会从栈顶弹出，这就是词法环境的结构
> 查找方式：首先从词法环境的栈顶向下查询，如没有找到，会继续在变量环境中查找

![变量查找过程](https://static001.geekbang.org/resource/image/06/08/06c06a756632acb12aa97b3be57bb908.png)

#### 暂时性死区
> 执行上下文是在编译时（执行前）创建的，执行时已经存在词法环境了，但在赋值之前访问该变量javascript引擎会抛出一个错误；所以，发生暂时性死区并不是该变量不存在

### this机制
> this和作用域链是两套不同的系统机制，他们之间没太多联系
> this和执行上下文绑定，每个执行上下文中都有this
> 作用域是静态的，this是动态的

1. 函数自主调用时，指向全局对象；严格模式下指向undefined
2. 硬绑定（call、apply、bind）时，指向绑定的对象
3. 构建函数中，指向实例对象
4. 函数被对象调用时，函数执行上下文中的this指向该对象
5. 箭头函数没有执行上下文，会从作用域链找到父级执行上下文中的this，所以箭头函数中的this采用的是作用域链规则

## JS基础
> JS是一门动态的、弱类型的语言
- 动态：不需要指定变量类型，可以使用同一变量名保存多种数据类型
- 弱类型：支持隐式转换

数组遍历：forEach、for-in、for-of、map
对象遍历：for-in、keys、entries、values、getOwnPropertyNames

**为什么利用多个域名提供网站资源更有效？**
1. 突破浏览器并发限制，现在浏览器对同一域名下请求最大量控制在6个
2. 跨域不会传cookie，节省带宽

### 跨域
1. jsonp：利用img/script等标签不受跨域限制的特性实现，缺点：只支持get请求
2. CORS（跨域资源共享）：W3C标准，CORS分为简单请求和复杂请求
   - 简单请求：HEAD、GET、POST
      浏览器会直接发出请求，并在头部信息中加一个origin字段表明请求源（协议 + 域名 + 端口）
   - 复杂请求：PUT、DELETE、contentType为application/json
      增加一个OPTIONS预检请求询问服务器，得到允许后才进行正式请求，OPTIONS请求附带了origin和Access-Control-Request-Method（请求方法）、Access-Control-Request-Headers（请求头）
      响应头Access-Control-Max-Age可以缓存预检请求的有效期，单位为秒，缓存期间不用再次发起预检请求

CORS跨域默认不发送cookie信息，如果要发送cookie，需要客户端设置withCredentials为true，服务端也需要指定响应头Access-Control-Allow-Credentials为true，需要注意的是，如果要发送cookie，Access-Control-Allow-Origin就不能设为”*“


# 前端工程化 - webpack、babel、git
## webpack
### 名词意义
- chunk：块，指若干个js module的集合
- bundle：块的集合，表示一个可以运行的整体
- vendor：公共资源文件
- hash：打包后输出的文件名
 - hash：每次构建hash都会变化，并且所有文件共用一个hash
 - chunkhash：构建时候chunk（每个入口文件）发生变化时chunkhash会变（依赖的模块hash也会变化）
 - contenthash：只有每个生成的文件资深内容发生变化时，contenthash才变化
所以js适用于chunkhash，css适用于contenthash，image适用于hash
- source map
将编译、打包、压缩后的代码映射回源代码的过程，由于打包压缩转换后的代码不具备可读性，所以在调试时就需要用到source map
map文件只有在打开浏览器控制台时才会加载
生产环境一般有三种处理方案：
1. hidden-source-map：借助第三方监控平台Sentry使用
2. nosource-source-map：只显示具体行数以及查看源代码的错误栈，安全性比source map高
3. source-map：通过nginx设置将.map文件只对白名单开放
注意：避免在生产环境使用inline-、eval，因为它们会增加bundle的体积，并降低整体性能

### 构建流程
> webpack的运行流程是一个串行的过程
1. 初始化参数：从配置文件和shell命令中读取和合并参数，得到最终参数
2. 开始编译：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始编译
3. 确定入口：根据配置中的entry得到所有的入口文件
4. 编译模块：从入口文件出发，调用所有配置的loader对模块代码进行转换，再找出该模块依赖的模块，进行递归转换处理
5. 完成模块编译：loader转换后，得到了每个模块的最终内容以及模块间的依赖关系
6. 输出资源：根据入口和模块间的依赖关系，组转成一个个包含多个模块的chunk，再把每个chunk转换成一个单独的文件加入到输出列表
7. 输出完成：确定好输出列表后，根据配置确定输出的路径和文件名，把文件内容写到文件系统

简而言之：
> 在这个过程中，webpack会在特定时间点广播出特定事件，对应的Plugin在监听到感兴趣的事件时会执行特定的逻辑，并且Plugin可以调用webpack提供的API改变webpack运行的结果
- 初始化：启动构建，读取与合并配置参数，加载Plugin，实例化Compiler（钩子）
- 编译：从entry出发，针对每个Module串行调用对应的loader转换文件的内容，在找到该Module依赖的Module，递归地进行处理
- 输出：将编译后的Module组合成chunk，再将chunk转换成文件，输出到文件系统

### Loader
> loader的执行顺序是从右往左、从后往前

#### 常用loader
- babel-loader
- css-loader、sass-loader、less-loader、style-loader、postcss-loader
- file-loader、url-loader
- tslint-loader、eslint-loader、ts-loader

### Plugin
> 扩展了webpack的功能，比loader更强大，作用是全局范围

#### 常用plugin
- clean-webpack-plugin：每次打包前清空打包目录
- copy-webpack-plugin：将文件目录复制到打包目录
- mini-css-extract-plugin：将CSS抽离出来单独打包并且通过配置是否压缩
- html-webpack-plugin：根据指定的template生成新html，并且自动引入出口js、css
- webapck-merge：针对多个webpack配置进行合并

### resolve
> 配置webpack模块和模块路径的映射
- resolve.modules：配置寻找第三方模块的路径，默认为node_modules
- reoslve.alias：通过别名把愿路径映射成简称
- resolve.extensions：配置默认文件后缀查找规则，默认为['js', 'json']

### 热更新HMR（Hot Module Replacement）
> 基于WDS（webpack-dev-server）的模块热替换，只刷新局部发生变化的部分
1. devServer.hot = true
2. plugins: [new webpack.HotModuleReplacement()]
3. main.js中：```module && module.hot && module.hot.accept()```

#### 热更新原理
> HMR的核心就是客户端从服务器拉取更新后的chunk diff（需要更新的部分）
实际上WDS与浏览器之间维护了一个Websocket，当本地资源发生变化时，WDS会向浏览器推送更新，并带上构建时的hash，浏览器拿到后与上一次资源进行比对，比对出差异后会向WDS发起请求来获取更改内容（文件列表、hash），浏览器再借助这些信息继续向WDS发起jsonp请求获取该chunk的增量更新
后续的部分（拿到增量更新之后如何处理？保留哪些状态？哪些有需要更新？）由HotModulePlugin来完成，像react-hot-laoder、vue-loader都是借助HotModulePlugin提供的API来实现HMR

### 性能优化
- 减少检查范围：配置loader的exclude
- 分离CSS、减小js文件体积：MiniCssExtractPlugin
- 压缩CSS：OptimizeCssAssetsWebpackPlugin
- 压缩HTML：HtmlWebpackPlugin
- 压缩图片：ImgWebpackLoader
- 压缩JS：TerserWebpackPlugin
- 分离webpack配置，减少对应环境不必要的配置
- 多进程解析、压缩：通过thread-loader开启多进程处理任务，TerserWebpackPlugin开启多进程压缩
- 静态资源分离、缓存：通过DllPlugin或Externals进行静态依赖包的分离
   由于splitChunks每次打包都会重新构建vendor，所以出于效率考虑，使用插件将第三方库单独打包到一个文件中，只有在第三方库版本发生变化时才会重新打包
- tree shaking：通过ES Module语法检查未引用代码，以及sideEffects来标记无副作用代码，最后用UglifyJsPlugin删除冗余代码
- 异步加载：异步代码会单独分离出一个文件，使用import()结合react-loadable

### tree shaking
> 本质是消除引用但没使用的模块代码，依赖ES Module静态饿的特性

#### side effects
> 指在import时会执行一些动作，但不一定有任何export
tree shaking不能识别哪些模块睡意side effects，需要显式地配置package.json
```javascript
{
   "name": "tree-shaking",
   "sideEffects": Boolean|Array[path]
}
```


## babel
> bebal是一个编译器
> babel插件分为两种
- 语法插件：如preset-env，解析特定类型的语法（不是转换），转换AST时支持解析新语法
- 转换插件：如polyfill，启用对应的语法插件后将代码polyfill

### 原理：解析（Parser）-> 转换（Transform）-> 代码生成（Generate）
1. 解析：将源代码解析成抽象语法树（AST）
   1. 词法分析（分词）：把源代码拆分成最小单元<Tokens>[{type,value}]
   2. 语法分析（Parser）：把TOkens解析成AST
2. 转换：将AST做一些特殊处理，让其符合编译器的咬碎 ES6 -> ES5
   深度遍历AST树，取出里面的每个type生成Visitor，然后分析type，符合转换条件将替换成polyfill对应的type，生成新的AST
3. 生成：babel-generator生成新的源代码

### 常用插件
> presets：为一组插件集，配置时可通过targets指定browserlist目标环境才转换
- @babel/preset-env：支持最新但不包含stage阶段的JS语法，可通过设置useBuiltIns为usage来优化polyfill插件，使得不用在代码里显式地引入polyfill以及只polyfill用到的语法，需要注意的是，当设置useBuiltIns时必须同时设置corejs（默认为2，当前polyfill版本默认会安装：core-js@2）
- @babel/polyfill：转换内置函数和实例方法，如：Promise、includes、Object.assign...
   -S，需要在代码运行时加载
   包含regenerator-runtime/runtime、core-js两个插件
- @babel/plugin-transform-runtime
   @babel/preset-env插件会在每个使用class的文件中生成一个辅助函数_createClass，plugin-transform-runtime插件会将辅助函数集成，只需生成一次，然后调用就行
   需要注意的是，该包依赖@babel/runtime，需要安装 -S

### presets/plugins
- plugin运行在presets之前
- plugin按顺序执行
- presets按倒序执行


# 浏览器
## 从输入URL到页面加载发生了什么？
1. DNS解析：查询域名对应的IP地址
2. TCP连接：建议连接（3次握手）-> 传输数据 -> 断开连接（4次挥手）
3. 发送HTTP请求：构建HTTP请求报文，通过TCP协议发送至服务端
4. 服务端响应：返回HTTP响应报文
5. 浏览器解析渲染：构建DOM Tree -> 构建CSS Rule Tree -> 合并生成Render Tree -> Layout Tree -> Paint

### DNS解析（域名系统解析）
> 通过网络查找哪台机器有你需要的资源的过程
网络通讯大部分是TCP/IP协议，而TCP/IP又是基于IP地址的，所以计算机在通讯时只能识别IP地址，而不能识别域名，所以为了方便记忆搞出一套域名系统规则来映射IP，DNS解析就是通过域名查找对应IP的过程

解析过程：
1. 查询www.xxx.com（域名）
2. 访问客户端DNS缓存：浏览器 -> host -> 路由；如果有，则直接返回
3. 访问ISP（互联网服务提供商，如：联通、电信等）DNS服务器；如果本地服务器有，则直接返回
4. 本地去咨询DNS服务器：DNS根服务器发现是.com区域管理的，告诉本地去咨询它
5. 本地去咨询.com顶级域名服务器：顶级域名服务器告诉本地去咨询xxx.com主区域服务器
6. 本地去咨询xxx.com主区域服务器：查找到对应的IP地址，返回给本地
7. 本地通知用户，同时缓存这个IP地址






### TCP连接
> TCP（transmisson control protocol，传输控制协议）是一种面向连接的、可靠的、基于字节流的传输层通信协议

相对于UDP协议的特点
- 对于数据包的丢失，建立重传机制
- 引入数据包排序机制，保证把乱序的数据包组合成一个完整的文件
TCP：接收方接收到的数据是完整、有序、无差错的
UDP：接收方接收到的数据可能丢失、无序。不需要三次握手、四次挥手


*三次握手、四次挥手是为了建立可靠连接的最低握手次数*


#### 建立连接（三次握手）
> 通过“三次握手”建立Client和Server间的连接

**名词解释**
SYN：建立连接的标志，可为0或1，三次握手时是1
ACK：确认连接的标志，可为0或1，三次握手时是1
seq：序列号，随机数
ack：确认号，seq + 1

**序号的作用**
用来确定数据包的顺序以及数据包是否有丢失建立重发

to Server：SYN=1，seq=1234  Server根据SYN=1即可知道Client要求连接
to Client：SYN=1，ACK=1，ack=seq+1，seq=2345  Client检查ack是否正确以及ACK是否为1
to Server：ACK=1，ack=seq+1 Server确定ack值是否正确以及ACK是否为1

1. Client（SYN_SENT 同步已发送） --(SYN=1, seq=x)--> Server === Client发送能力正常
2. Server（SYN-RECV 同步已接收） --(SYN=1, ACK=1, seq=y, ack=x+1) --> Client === Server发送能力正常
3. Client（ESTABLISHED 已建立连接） --(ACK=1, seq=x+1, ack=y+1) --> Server === Client接收能力正常

刚开始Client处于CLOSED状态，Server处于LISTEN状态
第一次握手时；Client发送一个SYN报文，并指明初始化序号seq。此时Client状态变更为SYN_SENT
第二次握手时；Server接收到来自Client的SYN报文后，会以自己的SYN、ACK报文作为应答，并且也指明初始化seq，同时会把Client的seq+1作为ack的值。此时Server状态变更为SYN_RECD
第三次握手时；Client接收到来自Server的SYN报文后，会把Server的seq+1作为ack的值，发送ACK报文给Server。此时Client状态变更为ESTABLISHED
Server接收到Client的ACK报文后，状态为变更为ESTABLISHED，此时 双方建立了连接


**为什么需要三次握手？**
因为Client和Server需要确认双方的接收和发送能力正常

**为什么仅第三次握手可携带数据？**
为了防止恶意攻击，如果Client第一次握手时在SYN报文中携带大量的数据并且重复发送SYN报文的话，会让服务器花费大量时间、内存来接收存放这些数据

**为什么不是两次握手？**
为了防止Client已经失效的请求报文段突然传到了Server，产生死锁
比如：Client发出一个请求，但由于在某个网络结点长时间滞留，导致在一段时间后（超出有效期）才能到达Server，本该是个已经失效的报文段，如果是两次握手，那么Server在接收到报文段后就会向Client发出确认报文段，并建立连接，由于是失效请求，Client并不会响应来自Server的确认请求，导致Server一直在等待，从而造成死锁

**什么是半连接队列？**
Server在接收到Client的SYN报文（第一次握手）后，会将状态置为SYN_RECD，Server会把这种状态的请求放在一个队列里，称之为半连接队列

**什么是全连接队列？**
顾名思义，就是已经完成三次握手建立连接的请求，此时状态为ESTABLISHED，Server会把这种状态的请求放在一个队列里，称之为全连接队列。*如果队列满了可能会出现丢包的现象*

**关于SYN、ACK重传机制**
Server发送完SYN、ACK报文后，如果未收到Client的确认报文便会进行首次重传，等待一段时间内仍未收到Client的响应会进行第二次重传。如果重传次数达到了系统规定的最大值，Server会将这一请求从半连接队列中删除。*每次重传间隔的时间不一定相同*

**什么是SYN攻击？**
> Server的资源是在第二次握手时分配的，而Client的资源是在第三次握手时分配的，所以Server容易受到SYN洪泛攻击。
Client在短时间内伪造大量不存在的IP，并向Server不断发送SYN报文，Server则回复SYN、ACK报文并等待Client的ACK报文，由于IP不存在，因此根据重传机制Server需要不断重传直到超时，这些伪造的SYN报文长时间占用半连接队列，导致正常的SYN报文请求因为队列满而被丢弃，从而引起网络的拥甚至系统瘫痪，SYN攻击是一种典型的DoS/DDoS攻击

如果防御？ 常见有：缩短超时时间、增加最大半连接数、过滤网关防护、SYN cookiess...


### 发送HTTP请求
> 构建请求报文，并通过TCP协议发送到服务器指定端口（http默认为80/8080，https默认为443）

请求报文由三个部分组成：
   - 请求行：即请求方法：GET、POST、PUT、DELETE、HEAD、OPTIONS
   - 请求头
   - 请求体

### 服务端响应
> 服务端处理请求完毕后，会返回响应报文

响应报文也由三部分组成：
 - 状态码：1xx（请求已接收）、2xx（请求成功）、3xx（重定向）、4xx（客户端错误）、5xx（服务端错误）
 - 响应头
 - 响应体
### 断开连接（四次挥手）
to Server：-- FIN=1，seq=u -->
to Client：-- ACK=1，seq=v，ack=u+1 --> 
to Client：-- FIN=1，ACK=1，seq=w，ack=u+1 -->
to Server：-- ACK=1，seq=u+1，ack=w+1 -->

1. Client发送一个FIN报文，并进入FIN_WAIT1状态
2. Server发送一个ACK报文，并进入CLOSE_WAIT状态，客户端收到报文后进入FIN_WAIT2状态
3. Server发送一个FIN、ACK报文，并进入LAST_ACK状态
4. Client发送一个ACK报文，并进入TIME_WAIT状态，延迟2MSL（为了保证ACK报文能到达Server）进入CLOSE状态

**什么是半关闭？**
所谓的半关闭，其实就是TCP提供了连接的一端结束它的发送后还能接收另一端数据的能力

**为什么需要四次挥手？**
当Server接收到Client的FIN报文后，很可能不会立即关闭socket，所以只能先回复Client一个ACK报文，等到Server所有的报文都发送完成之后，再回复Client一个ACK、FIN报文，告诉Client可以关闭了，Client接收到报文后再回复Server一个ACK报文，2MSL后Client关闭连接

**为什么四次挥手释放连接时，需要等待2MSL？**
> MSL：“最长报文段寿命”，指的是在一个TCP周期中耗时最长的报文请求时间
为了保证Client最后的ACK报文能够到达Server，因为网络是不可靠的，ACK容易丢失，从而导致Server处在LAST_ACK状态接收不到对FIN_ACK的回复报文请求，超时后便会重传FIN_ACK报文，Client此时能够接收到FIN_ACK报文重新发送ACK报文

### 浏览器解析
![浏览器解析过程](https://github.com/LiangJunrong/document-library/blob/master/系列-面试资料/浏览器/img/other-page-parse.png)

1. 构建DOM Tree，出发DOMContentLoaded事件
2. 构建CSSOM Tree
3. 合并生成Render Tree
4. 计算几何信息，生成Layout Tree
5. GUI绘制Paint

- 构建DOM Tree时可能会因为CSS/JS资源的加载而暂停（阻塞）
- 构建CSSOM Tree和构建DOM一般是并行的，和JS执行互斥，现代浏览器内部优化，只在JS访问CSS时才发生互斥
- 合并Render Tree，去除display:none的元素以及元标签（meta、script、head...）
- Layout Tree输出的是盒子模型，脱离文档流实际就是脱离Render Tree

#### DOM树如何生成
> 在渲染引擎内部，又一个HTML解析器（HTMLParser）模块，它负责将HTML字节流转换成DOM结构

**HTMLParser什么时候解析？**
*HTMLParser并不是等待整个文档加载完成才解析的，而是随着HTML文档边加载边解析*
网络进程在接收到响应头后，会根据响应头的content-type来判断文件的类型，比如content-type为text/html，浏览器就会为该请求选择或创建一个渲染进程，随后*网络进程和渲染进程之间会建立一个共享数据的管道*，网络进程接收到数据之后放入管道，而渲染进程则从管道的另一端不断地读取数据，HTMLParser拿到数据解析

字节流（Bytes）-> 分词器（Tokens）-> 生成节点（Node）-> DOM

字节流转换为DOM的三个阶段：
1. 通过分词器将字节流转换成Tokens
   - Tag Token：标签，分为Start Token<>和End Token</>
   - Text Token：文本
2. 将Token解析成Node， 
// 2、3阶段一起进行
3. 将Node添加到DOM树
> HTMLParser维护了一个Token栈结构，主要用来计算节点之间的父子关系，在第一个阶段中生成的Token会被按照顺序压入栈中

- 如果压入栈中的是Start Token，HTMLParser会创建一个Node，然后将其加入到DOM树中
- 如果压入栈中的是Text Token，不需要入栈，它的父节点就是当前栈顶节点
- 如果压入栈中的是End Token，HTMLParser会查看栈顶的节点是否对应，如果是，就将Start Token从栈中弹出，表示该节点解析完成

**渲染阻塞**
JS的下载和执行都会阻塞DOM解析，Chrome做了很多优化，其中一个主要的优化就是预解析操作，当渲染引擎收到字节流之后，会开启一个预解析线程，用来分析HTML中包含的js、css等资源，预解析线程会提前下载这些资源

使用策略来规避或减少阻塞：使用CDN加速、压缩文件体积；如果js中没有操作DOM，就可以将该脚本设为async/defer

JS可以修改DOM结构以及CSS样式，所以在遇见script标签时会暂停解析DOM/CSSOM，直至JS执行完毕

**网页从空白到出现内容所花费的时间？**
这段时间就是HTML文档加载到解析完成的时间，也就是DOMContentLoaded事件触发之前所需的时间

*所以，对首屏时间而言，script放在HTML头部和尾部效果是一样的，都需要等待js执行完毕，而script放在结尾处是由于通常js需要操作DOM，为了保证能够找到对应的DOM节点*

**script之async**
加载脚本是异步的，可以和DOM解析并行，待脚本加载完毕后，DOM暂停解析，此时开始执行脚本，脚本执行完成后继续解析DOM，所以，*async模式下 DOMContentLoaded事件既有可能在js执行完成前触发，也有可能在执行完成后触发*

**script之defer**
顾名思义，即延迟js执行时机，加载过程也是异步的，可以和DOM解析并行，*但总是在DOM解析完成后再执行脚本，而且DOMContentLoaded事件会在js执行完成后才触发*

**CSS解析会阻塞DOM构建吗？**
CSS并不会直接阻塞DOM构建，但因为script脚本会阻塞DOM构建，而又因为js执行时可能访问css属性，所以js会等待CSS构建完成后才开始执行，如此一来，*CSS阻塞js执行，js执行阻塞DOM构建*

*CSS解析会阻塞Render Tree生成，因为Render Tree生成依赖于CSS OM和DOM*


### why virtual DOM？
虚拟DOM诞生的主要目的是跨平台，React、React Native
顺便优化了JS直接操作DOM带来的性能问题（Fiber 双缓存批量更新）
抽象数据层，屏蔽了繁琐的原生操作，数据驱动视图