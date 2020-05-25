/**
 * 手写代码部分
 */

// new
const _new = (fn, ...args) => {
    const obj = Object.create(fn.prototype);
    const ret = fn.apply(obj, args);
    return (typeof ret === 'object' && ret !== null) ? ret : obj;
}

// 防抖
const debounce = wait => fn => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(args)
        }, wait)
    }
}
// 节流
const throttle = wait => fn => {
    let timer;
    return (...args) => {
        if (timer) return;
        timer = setTimeout(() => timer = null, wait);
        fn(...args);
    }
}
// bind
// 1.用apply实现
Function.prototype.myBind = function(obj, ...args) {
    const context = this;
    return function(...args1) {
        context.apply(obj, [...args, ...args1]);
    }
}
// 不用apply
Function.prototype.myBind = function(obj, ...args) {
    return (...args1) => { // return 1个新函数
        let val;
        let args2 = [...args, ...args1];
        obj._fn = this;
        val = obj._fn(...args2);
        Reflect.deleteProperty(obj, _fn);
        return val;
    }
}

// call
Function.prototype.myCall = function(obj, ...args) {
    let val;
    obj._fn = this;
    val = obj._fn(...args);
    delete obj._fn;
    return val;
}
// apply
Function.prototype.myApply = function(obj, arr) {
    let val;
    let args = [...arr];
    obj._fn = this;
    val = obj._fn(...args);
    delete obj._fn;
    return val;
}
// instanceOf
function  myInstanceOf(l, r) {
    let lP = l.__proto__;
    let rP = r.prototype;

    while(true) {
        if (lP === null) return false;
        if (lP === rP) return true;
        lP == lP.__proto__;
    }
}
// 深克隆
// 简单版
function simpleClone(obj) {
    const res = Array.isArray(obj) ? [] : {};

    for(let key of Object.keys(obj)) {
        const type = typeof obj[key];
        if (type !== 'object' || type === null) {
            res[key] = obj[key];
        } else {
            res[key] = simpleClone(obj[key]);
        }
    }
    return res;
}
// 骚操作
function chanleClone(obj) {
    return new Promise((reslove,reject) => {
        const {p1, p2} = new MessageChannel();
        p2.onmessage = res => reslove(res.data);
        p1.postMessage = obj;
    });
}

// 深比较
function deepCompare(obj1, obj2) {
    const isObj = a => typeof a === 'object' && a !== null;
    if (!(isObj(obj1) && isObj(obj2))) return obj1 === obj2;

    const obj1Props = Object.getOwnPropertyDescriptors(obj1); // getOwnPropertyDescriptors
    const obj2Props = Object.getOwnPropertyDescriptors(obj2);

    if (Object.keys(obj1Props).length !== Object.keys(obj2Props).length) return false;

    return Object.keys(obj1Props).every(key => deepCompare(obj1[key], obj2[key])); // every
}

// Promise.allSettled
Promise.allSettled = (promises) => {
    return new Promise((reslove, reject) => {
        if (!Array.isArray(promises)) return;

        let len = promises.length;
        let num = 0;
        let resArr = new Array(len);

        for(let i = 0; i < len; i++) {
            (function(i) {
                Promise.resolve(promises[i]).then(
                    (data) => {
                        num++;
                        resArr[i] = {status: "fulfilled", value: data}
                        if (num === len) {
                            resolve(resArr);
                        }
                    },
                    (err) => {
                        num++;
                        resArr[i] = {status: "rejected", reason: err}
                        if (num === len) {
                            resolve(resArr);
                        }
                    }
                )
            })()
        }
    })
}

// promis 重试
const retry = (fn, times, delay) => {
    return new Promise((resolve, reject) => {
        let handle = () => {
            fn()
                .then(data => resolve(data))
                .catch(err => {
                    if (times === 0) {
                        reject(err);
                    }
                    times--;
                    setTimeout(handle, delay)
                })
        }
        handle();
    })
}

// events模块
class Event {
    handles;
    constructor() {
        this.handles = {};
    }

    on(name, handle) {
        if (!this.handles[name]) {
            this.handles[name] = [];
        }
        this.handles[name].push(handle);
    }
    // on(name, handle, once = false) {
    //     if (!this.handles[name]) {
    //         this.handles[name] = [];
    //     }
    //     handle.once = once;
    //     this.handles[name].push(handle);
    // }

    off(name, handle) {
        if (!name && !handle) { // 都没传 全清空
            this.handles = {};
            return;
        }

        if (!name) return; // 没穿name传了handle不行

        if (!handle) { // 只穿了name  清空这个name下的
            this.handles[name] = [];
            return;
        }

        // 清空某一个
        const events = this.handles[name];
        if (!events) return;

        for (let i = 0; i < events.length; i++) {
            const [callback] = events[i];

            if (callback === handle) {
                events.splice(i, 1);
            }
        }
    }

    once(name, handle) {
        const cache = (...args) => {
            this.off(name, cache);

            handle.apply(this, ...args);
        }

        this.handles[name].push(cache);
    }

    // once(name, handle) {
    //     this.on(name, handle, true);
    // }

    emmitter(name, ...args) {
        this.handles[name].forEach(event => {
            event.apply(this, args);
        })

        // this.handles[name].forEach(event => {
        //     event.apply(this, args);
        //     if (event.once) {
        //         this.off(name, event);
        //     }
        // })

    }
}
// node  util.promisify
function promisify (fn) {
    return (...args) => new Promise((reslove, reject) => {
        fn(...args, (err, data) => {
            if (err) {
                reject(err);
            }
            reslove(data)
        })
    })
}

// currying
// add(a)(b)(c)和add(a,b,c)都能输出a+b+c
function currying(fn) {
    let argArr = [];

    return function next(...args) {
        if (args.length > 0) {
            argArr = argArr.concat(args);
            return next;
        }
        return fn.apply(null, argArr);
    }
}
// 解析url  qs.parse  name=wty&age=19
// simple
const parse = (url) => url.split('&').reduce((res, cur) => {
    const [key, value] = cur.split('=');
    if (!value) return res;

    // simple
    // res.key = value;

    // a[0]=1&a[1]=2&b[c]=wty
    // transform({}, [a,0], 1)
    transform(res, key.split(/[\[\]]/g).filter(x => x), value);

    return res;
}, {})

const transform = (acc, path, value) => {
    let i = 0;
    for(; i < path.length -1; i++ ) {
        if (acc[path[i]] === undefined) {
            if (path[i+1].match(/^\d+$/)) { // 数组
                acc[path[i]] = [];
            } else {
                acc[path[i]] = {};
            }
        }
        acc = acc[path[i]];
    }
    acc[path[i]] = decodeURIComponent(value);
}

// compose
// koa
const compose = () => {
    // 第一种
    // const dispatch = async (index) => {
    //     if (index === this.arr.length) return;
    //     let middle = this.arr[index];

    //     return middle(() => dispatch(index + 1));
    // }

    // return dispatch(0);

    return this.arr.reduce((a, b) => {
        return (...args) => Promise.resolve(a(() => b(...args)));
    })(() => {
        console.log('last next()');
    })
}
// redux
const compose = (...fns) => {
    if (fns.length === 0) return;
    if (fns.length === 1) return fns[0];

    return fns.reduce((a, b) => (...args) => a(b(...agrs)))
}






