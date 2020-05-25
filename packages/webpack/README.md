1. webpack5 有啥更新
2. webpack4 有啥更新
3. webpack原理
4. 写1个webpack loader

## 1. webpack优化
1. noParse
> 不去解析jquery的依赖关系
```js
module: {
    noParse: /jquery/,
    rule: [...]
}
```
2. IgnorePlugin
> 忽略掉一些引用
```js
new webpack.IgnorePlugin(/\.\/locale/, /moment/), // 忽略掉末moment加载语言包， 然后手动引入
```
3. DllPlugin
> 打包一些不会改变的包 example:react react-dom
4. happypack
> 多线程打包
5. webpack自带点的优化
> tree-shaking把没用到的代码自动删除掉， import 在成产环境下，会自动去除掉没用的代码。 es6模块会把结果放在default上
> scope hosting 作用域提升
```js
// 会自动省略一些可以简化的代码
    let a =1;
    let b =2;
    let c =3;
    let d =a+b+c;
    console.log(d);
// 打包后 直接let d = 6;
```
6. 抽取公告代码
> 1. 抽离第三方包 react、react-dom、 mobx... 2.抽离公告模块
```js
// webpack 4 用以下配置了 之前用commonChunkPlugin
optimization: {
    splitChunks: {
        vendor { // 第三方包
            priority: 1, // 权重
            test: /node_modules/, // 正则
        },
        common { // 公共的模块
            chunks: 'initial',
            minSize: 0,
            minChunks: 2
        }
    }
}
```
7. 懒加载
> 代码中可以动态import 文件 返回promise (data) => data.default
vue、react懒加载类似
8. 热更新
```js
new webpack.HotModuleReplacementPlugin()
// 代码中
if (module.hot) {
    module.hot.accept()
}
```
9. Tapable 把webpack各个插件串联起来
webpack本质上是一种事件流的机制，它的工作流程就算是将各个插件串联起来，而实现这一切的核心就是Tapable，Tapable有点类似于nodejs的events库，核心原理也是依赖于发布订阅模式，
```js
// webpack 源码 lib/compiler里
const {
    SyncHook,
    SyncBailHook, // 保险的同步 如果return !== undefined 停止
    SyncWaterfailHook, // 瀑布 上一个结果传给下一个 reduce
    SyncLoopHook, // 同步 遇到不return undefined的执行多次
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfailHook
} = require('tapable')
```
## loader
1. loader的执行顺序是从右向左从下到上
```js
modules: {
    rules: [
        {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        }
    ]
}

```
2. loader的分类
 - 前置loader pre
 - 普通loader normal
 - 后置loader post
> loader的执行顺序 pre + noraml + inline + post
 - inline loader
 ```js
// inline loader 执行顺序 pre + noraml + inline + post
let str = require('inline-loader!./a.js');
 // -! 不会让文件再去通过 pre+normal
let str = require('-!inline-loader!./a.js');
 // ! 没有normal
let str = require('!inline-loader!./a.js');
 // !! 什么都不要
let str = require('!inline-loader!./a.js');
 ```

 3. loader默认有2部分组成pitchLoader 和 normalLoader
 > pitch和normal执行顺序整好相反，当pitch没定义或者没有返回值时，依次执行pitch再获取资源再执行loader,当某个pitch有返回值，会跳过之后一直到自己的normalLoader之后。

 ```js
loader3pitch  -> loader2pitch -> loader1pitch -> source -> loader1 -> loader2 -> loader3
 ```

**Loader的特点**
 - 第一个Loader要返回js脚本 比如：不能返回个 number， 因为最终要放在eval('')里执行的。
 - 每个loader只做1件内容，为了使loader在更多场景链式调用。
 - 每个loader都是1个模块
 ```js
function loader(Source){...; return ...} module.export = loader;
 ```
 - 每个loader都是无状态的，确保loader在不同模块转换之间不保存状态。






